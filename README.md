# DevOps Control Platform

Enterprise-grade DevOps management platform that unifies Kubernetes operations, infrastructure automation, observability tools, and secure access controls in a single web interface.

## Features

### 1. User Management & Security
- Default superuser (admin/admin) with forced password change on first login
- Role-based permissions: Super Admin, Operator (read/write), Viewer (read-only)
- Encrypted credential storage for SSH keys, passwords, and API tokens
- Comprehensive audit logging of all user actions

### 2. Kubernetes Cluster Management
- Cluster creation wizard with HAProxy and node configuration
- Bulk script execution across all cluster nodes
- Cluster status dashboard with health monitoring
- Reconfiguration capability for existing clusters

### 3. Machine Registry
- Centralized machine inventory with IP, hostname, and application name
- Machine grouping and tagging capabilities
- Connection testing and validation features

### 4. Web-Based SSH Terminal
- Integrated xterm.js terminal in the browser
- Secure WebSocket proxy for SSH connections
- Session recording and logging

### 5. Dashboard Integration Catalog
- Support for multiple dashboard types (Kubernetes Dashboard, ArgoCD, Kiali, Grafana, Prometheus, Alertmanager, Kibana)
- Auto-login functionality using stored credentials
- Dashboard-cluster association for context

### 6. Automation Engine (Ansible)
- Complete Ansible playbook management interface
- Playbook storage and versioning
- Task scheduling and execution
- Real-time task output streaming

### 7. Infrastructure as Code (Terraform)
- Terraform project management interface
- Plan/Apply/Destroy operations via UI
- State file management
- Real-time execution logs

## Technology Stack

- **Backend**: Python with Django and Django REST Framework
- **Frontend**: React with TypeScript and Material-UI components
- **Database**: PostgreSQL
- **Message Broker**: Redis for Celery tasks
- **Containerization**: Docker and Docker Compose
- **Authentication**: JWT tokens with role-based access control

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- At least 4GB RAM available
- Ports 3000, 8000, 5432, 6379 available

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd devops-platform
\`\`\`

2. Generate encryption key (optional - default key provided for development):
\`\`\`bash
cd backend
python scripts/generate_encryption_key.py
\`\`\`

3. Update environment variables in `docker-compose.yml` if needed (especially for production):
   - `SECRET_KEY`: Django secret key
   - `ENCRYPTION_KEY`: Fernet encryption key for credentials
   - `POSTGRES_PASSWORD`: Database password

4. Start all services:
\`\`\`bash
docker-compose up -d
\`\`\`

5. Wait for services to be ready (about 30-60 seconds):
\`\`\`bash
docker-compose logs -f backend
\`\`\`

6. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/admin

### Default Credentials
- Username: `admin`
- Password: `admin`
- **IMPORTANT**: You will be forced to change the password on first login

## Development

### Backend Development

\`\`\`bash
# Enter backend container
docker-compose exec backend bash

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
python manage.py test
\`\`\`

### Frontend Development

\`\`\`bash
# Enter frontend container
docker-compose exec frontend sh

# Install new dependencies
npm install <package-name>

# Run tests
npm test
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/login/` - Login with username/password
- `POST /api/auth/refresh/` - Refresh JWT token
- `GET /api/auth/users/me/` - Get current user info

### Kubernetes
- `GET /api/kubernetes/clusters/` - List all clusters
- `POST /api/kubernetes/clusters/` - Create new cluster
- `GET /api/kubernetes/clusters/{id}/` - Get cluster details
- `POST /api/kubernetes/clusters/{id}/sync/` - Sync cluster data

### Machines
- `GET /api/machines/` - List all machines
- `POST /api/machines/` - Register new machine
- `POST /api/machines/{id}/test-connection/` - Test SSH connection

### Dashboards
- `GET /api/dashboards/integrations/` - List dashboard integrations
- `POST /api/dashboards/integrations/` - Add new dashboard integration

### Automation
- `GET /api/automation/playbooks/` - List Ansible playbooks
- `POST /api/automation/playbooks/` - Create new playbook
- `POST /api/automation/playbooks/{id}/execute/` - Execute playbook

### Terraform
- `GET /api/terraform/workspaces/` - List Terraform workspaces
- `POST /api/terraform/workspaces/` - Create new workspace
- `POST /api/terraform/workspaces/{id}/plan/` - Run terraform plan
- `POST /api/terraform/workspaces/{id}/apply/` - Run terraform apply

### Audit
- `GET /api/audit/logs/` - List audit logs (admin only)

## Architecture

\`\`\`
┌─────────────────┐
│   Frontend      │
│  (React + MUI)  │
│   Port: 3000    │
└────────┬────────┘
         │
         │ HTTP/WebSocket
         │
┌────────▼────────┐
│   Backend       │
│  (Django + DRF) │
│   Port: 8000    │
└────┬───────┬────┘
     │       │
     │       └──────────┐
     │                  │
┌────▼─────┐    ┌──────▼──────┐
│PostgreSQL│    │    Redis    │
│Port: 5432│    │  Port: 6379 │
└──────────┘    └──────┬──────┘
                       │
                ┌──────▼──────┐
                │   Celery    │
                │   Worker    │
                └─────────────┘
\`\`\`

## Security Considerations

### Production Deployment

1. **Change all default credentials**:
   - Database password
   - Django SECRET_KEY
   - ENCRYPTION_KEY
   - Default admin password

2. **Set DEBUG=False** in production

3. **Configure ALLOWED_HOSTS** properly

4. **Use HTTPS** with proper SSL certificates

5. **Enable firewall** and restrict access to necessary ports only

6. **Regular backups** of PostgreSQL database

7. **Rotate encryption keys** periodically

8. **Enable audit logging** and monitor regularly

## Troubleshooting

### Database Connection Issues
\`\`\`bash
# Check if database is ready
docker-compose exec db pg_isready -U devops

# View database logs
docker-compose logs db
\`\`\`

### Backend Not Starting
\`\`\`bash
# View backend logs
docker-compose logs backend

# Check migrations
docker-compose exec backend python manage.py showmigrations
\`\`\`

### Frontend Build Issues
\`\`\`bash
# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
\`\`\`

### WebSocket Connection Issues
- Ensure Redis is running: `docker-compose ps redis`
- Check CORS settings in backend settings.py
- Verify WebSocket URL in frontend configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review API documentation at `/admin`
