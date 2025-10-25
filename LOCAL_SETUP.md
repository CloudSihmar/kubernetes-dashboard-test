# DevOps Control Platform - Local Setup Guide

## Overview
This guide explains how to run the complete DevOps Control Platform on your local laptop using Docker Compose.

## Prerequisites
- Docker Desktop installed and running
- Docker Compose v2.0 or later
- At least 4GB of available RAM

## Project Structure
```
├── backend/          # Django REST API
├── frontend/         # React frontend (Material-UI)
├── docker-compose.yml # Orchestration for all services
└── Dockerfiles in each directory
```

## Services Included
The Docker Compose setup includes:
- **PostgreSQL 15** - Main database
- **Redis 7** - Message broker for Celery
- **Django Backend** - REST API on port 8000
- **React Frontend** - Web UI on port 3000
- **Celery Worker** - Async task processor

## Quick Start

### 1. Clone/Navigate to Project
```bash
cd /path/to/devops-platform
```

### 2. Start All Services
```bash
docker-compose up --build
```

This command will:
- Build the backend and frontend Docker images
- Start PostgreSQL and Redis
- Run database migrations
- Create the default admin user
- Start the Django backend (port 8000)
- Start the React frontend (port 3000)
- Start the Celery worker

### 3. Access the Platform
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

### 4. Default Credentials
- **Username**: admin
- **Password**: admin (default in Docker setup)
- You'll be prompted to change the password on first login

**Note**: On Replit, the default password is `admin123` for testing purposes.

## Available Commands

### Start services in background
```bash
docker-compose up -d
```

### View logs
```bash
docker-compose logs -f
```

### View logs for specific service
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop all services
```bash
docker-compose down
```

### Stop and remove all data (including database)
```bash
docker-compose down -v
```

### Rebuild a specific service
```bash
docker-compose up --build backend
```

### Access backend shell
```bash
docker-compose exec backend python manage.py shell
```

### Run database migrations
```bash
docker-compose exec backend python manage.py migrate
```

### Create a new superuser
```bash
docker-compose exec backend python manage.py createsuperuser
```

## Environment Variables

The `docker-compose.yml` file includes default development environment variables:

### Backend Environment
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `SECRET_KEY` - Django secret key (change in production!)
- `DEBUG` - Debug mode (True for development)
- `ALLOWED_HOSTS` - Allowed host headers
- `ENCRYPTION_KEY` - Key for encrypting sensitive data

### Frontend Environment
- `REACT_APP_API_URL` - Backend API URL
- `CHOKIDAR_USEPOLLING` - Enable hot reload in Docker

**⚠️ IMPORTANT**: For production deployment, update all security-related environment variables!

## Features Available

Once running, you can access:

1. **User Management** - Create users with roles (Super Admin, Operator, Viewer)
2. **Kubernetes Cluster Management** - Register and manage K8s clusters
3. **Machine Registry** - Track infrastructure inventory
4. **SSH Terminal** - Web-based SSH access (uses stored credentials)
5. **Dashboard Integration** - Connect Kubernetes Dashboard, ArgoCD, Grafana, etc.
6. **Ansible Automation** - Run playbooks and view execution logs
7. **Terraform Management** - Manage infrastructure as code
8. **Audit Logs** - Complete audit trail of all actions

## Troubleshooting

### Port Already in Use
If you see port conflicts:
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8000

# Kill the process or change ports in docker-compose.yml
```

### Database Connection Issues
```bash
# Ensure PostgreSQL container is healthy
docker-compose ps

# Check database logs
docker-compose logs db

# Restart the database
docker-compose restart db
```

### Frontend Not Loading
```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up --build frontend
```

### Celery Worker Not Processing Tasks
```bash
# Check Celery logs
docker-compose logs celery

# Check Redis connection
docker-compose exec redis redis-cli ping
```

## Data Persistence

Data is persisted in Docker volumes:
- `postgres_data` - Database data
- `ansible_data` - Ansible playbooks and inventories
- `terraform_data` - Terraform projects and state files

To backup data:
```bash
docker run --rm -v devops_platform_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/db-backup.tar.gz -C /data .
```

## Development Workflow

For active development:

1. **Backend changes** - Edit files in `backend/`, Django auto-reloads
2. **Frontend changes** - Edit files in `frontend/`, React hot-reloads
3. **Database changes** - Create migrations:
   ```bash
   docker-compose exec backend python manage.py makemigrations
   docker-compose exec backend python manage.py migrate
   ```

## Production Deployment

For production use:
1. Update `docker-compose.yml` environment variables
2. Set `DEBUG=False`
3. Generate strong `SECRET_KEY` and `ENCRYPTION_KEY`
4. Use a managed PostgreSQL database
5. Use a managed Redis service
6. Set up proper SSL/TLS certificates
7. Configure firewalls and security groups
8. Enable regular database backups

## Security Notes

- Default credentials are for development only
- All credentials are encrypted at rest using Fernet encryption
- JWT tokens are used for authentication
- CORS is configured for localhost by default
- In production, restrict `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`

## Support

For issues or questions:
1. Check the logs: `docker-compose logs`
2. Verify all containers are running: `docker-compose ps`
3. Review the Django logs for backend issues
4. Check browser console for frontend issues

---

**Happy DevOps! 🚀**
