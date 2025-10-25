# Deployment Guide

## Production Deployment Checklist

### 1. Environment Variables

Create a `.env` file for production:

\`\`\`bash
# Django Settings
SECRET_KEY=<generate-strong-secret-key>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database
DB_NAME=devops_platform
DB_USER=devops
DB_PASSWORD=<strong-password>
DB_HOST=db
DB_PORT=5432

# Redis
REDIS_URL=redis://redis:6379/0
REDIS_HOST=redis

# Encryption
ENCRYPTION_KEY=<generate-with-scripts/generate_encryption_key.py>

# CORS (adjust for your frontend domain)
CORS_ALLOWED_ORIGINS=https://yourdomain.com
\`\`\`

### 2. Generate Secure Keys

\`\`\`bash
# Generate Django SECRET_KEY
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

# Generate ENCRYPTION_KEY
cd backend
python scripts/generate_encryption_key.py
\`\`\`

### 3. Update docker-compose.yml for Production

\`\`\`yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always
    networks:
      - devops-network

  redis:
    image: redis:7-alpine
    restart: always
    networks:
      - devops-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: >
      sh -c "python manage.py migrate &&
             python manage.py collectstatic --noinput &&
             python scripts/create_default_user.py &&
             daphne -b 0.0.0.0 -p 8000 devops_platform.asgi:application"
    volumes:
      - static_files:/app/staticfiles
      - media_files:/app/media
      - ansible_data:/app/ansible_data
      - terraform_data:/app/terraform_data
    environment:
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_HOST=db
      - DB_PORT=5432
      - REDIS_URL=${REDIS_URL}
      - REDIS_HOST=redis
      - SECRET_KEY=${SECRET_KEY}
      - DEBUG=False
      - ALLOWED_HOSTS=${ALLOWED_HOSTS}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
    depends_on:
      - db
      - redis
    restart: always
    networks:
      - devops-network

  celery:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: celery -A devops_platform worker -l info
    volumes:
      - ansible_data:/app/ansible_data
      - terraform_data:/app/terraform_data
    environment:
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_HOST=db
      - DB_PORT=5432
      - REDIS_URL=${REDIS_URL}
      - REDIS_HOST=redis
      - SECRET_KEY=${SECRET_KEY}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
    depends_on:
      - db
      - redis
      - backend
    restart: always
    networks:
      - devops-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    environment:
      - REACT_APP_API_URL=https://api.yourdomain.com
    restart: always
    networks:
      - devops-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - static_files:/usr/share/nginx/html/static
      - media_files:/usr/share/nginx/html/media
    depends_on:
      - backend
      - frontend
    restart: always
    networks:
      - devops-network

networks:
  devops-network:
    driver: bridge

volumes:
  postgres_data:
  static_files:
  media_files:
  ansible_data:
  terraform_data:
\`\`\`

### 4. Create Production Dockerfile for Frontend

\`\`\`dockerfile
# frontend/Dockerfile.prod
FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

### 5. Nginx Configuration

Create `nginx/nginx.conf`:

\`\`\`nginx
upstream backend {
    server backend:8000;
}

upstream frontend {
    server frontend:80;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket for SSH
    location /ws/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Static files
    location /static/ {
        alias /usr/share/nginx/html/static/;
    }

    location /media/ {
        alias /usr/share/nginx/html/media/;
    }
}
\`\`\`

### 6. Database Backup Script

Create `scripts/backup_db.sh`:

\`\`\`bash
#!/bin/bash
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/devops_platform_$TIMESTAMP.sql"

mkdir -p $BACKUP_DIR

docker-compose exec -T db pg_dump -U devops devops_platform > $BACKUP_FILE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE"
\`\`\`

### 7. Deploy

\`\`\`bash
# Pull latest code
git pull origin main

# Build and start services
docker-compose -f docker-compose.yml up -d --build

# Check logs
docker-compose logs -f

# Run migrations
docker-compose exec backend python manage.py migrate

# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput
\`\`\`

### 8. Monitoring

Set up monitoring for:
- Container health: `docker-compose ps`
- Application logs: `docker-compose logs -f backend`
- Database connections
- Celery task queue
- Disk space usage

### 9. Backup Strategy

- Daily automated database backups
- Weekly full system backups
- Store backups off-site
- Test restore procedures regularly

### 10. Security Hardening

- Enable firewall (UFW/iptables)
- Use fail2ban for SSH protection
- Regular security updates
- Monitor audit logs
- Implement rate limiting
- Use strong passwords
- Enable 2FA for admin accounts
