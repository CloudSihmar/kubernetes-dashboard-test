# DevOps Control Platform - Replit Deployment

## Project Overview
Enterprise-grade DevOps management platform that unifies Kubernetes operations, infrastructure automation, observability tools, and secure access controls in a single web interface.

**Status**: ✅ Running on Replit (Migrated from Docker)

## Tech Stack

### Backend
- **Framework**: Django 5.0.1 with Django REST Framework
- **Database**: PostgreSQL (Replit managed - Neon)
- **Message Broker**: Redis (local instance)
- **WebSockets**: Daphne/Channels for SSH terminals
- **Port**: 8000
- **Authentication**: JWT tokens with role-based access control

### Frontend
- **Primary**: Lightweight HTML/CSS/JS frontend (simple-frontend/)
- **Alternative**: React 18 with MUI (frontend/) - requires local build
- **Alternative**: Next.js 16 (root app/) - development in progress
- **Port**: 5000 (Replit webview port)
- **Package Manager**: pnpm (Next.js), npm (React)

## Default Credentials
- **Username**: `admin`
- **Password**: `admin`
- **Note**: Change this password before deploying to production

## Active Workflows

### 1. Django Backend (Port 8000)
- **Command**: `cd backend && ./start_server.sh`
- **Output**: Console logs
- **Serves**: REST API endpoints, WebSocket connections
- **Startup**: Initializes Redis, collects static files, starts Daphne ASGI server

### 2. Frontend (Port 5000) 
- **Command**: `node simple-frontend/server.js`
- **Output**: Webview (main user interface)
- **Serves**: Lightweight login page and API testing interface
- **Note**: Full React/Next.js frontends available in frontend/ and app/ directories

## Core Features Implemented

### 1. User Management & Security
- ✅ Role-based permissions (Super Admin, Operator, Viewer)
- ✅ Encrypted credential storage for SSH keys and API tokens
- ✅ Comprehensive audit logging
- ✅ JWT token authentication
- ✅ Forced password change on first login

### 2. Kubernetes Cluster Management
- ✅ Cluster creation wizard
- ✅ Bulk script execution across nodes
- ✅ Cluster status dashboard
- ✅ Cluster reconfiguration

### 3. Machine Registry
- ✅ Centralized machine inventory
- ✅ Machine grouping and tagging
- ✅ Connection testing

### 4. Web-Based SSH Terminal
- ✅ xterm.js terminal in browser
- ✅ WebSocket proxy for SSH connections
- ✅ Session recording

### 5. Dashboard Integration Catalog
- ✅ Support for multiple dashboard types (Kubernetes, ArgoCD, Grafana, etc.)
- ✅ Auto-login with stored credentials
- ✅ Dashboard-cluster association

### 6. Automation Engine (Ansible)
- ✅ Ansible playbook management
- ✅ Task scheduling and execution
- ✅ Real-time output streaming

### 7. Infrastructure as Code (Terraform)
- ✅ Terraform project management
- ✅ Plan/Apply/Destroy operations
- ✅ State file management

## Environment Configuration

### Database (PostgreSQL)
Automatically configured by Replit:
- `PGHOST` - Database host
- `PGDATABASE` - Database name  
- `PGUSER` - Database user
- `PGPASSWORD` - Database password
- `PGPORT` - Database port (5432)
- `DATABASE_URL` - Full connection string

### Application Secrets
⚠️ **IMPORTANT**: For production deployment, you MUST set these as Replit secrets:

- `SECRET_KEY` - Django secret for session signing
  - Generate: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
  
- `ENCRYPTION_KEY` - Fernet key for encrypting sensitive credentials in database
  - Generate: `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"`
  
- `DEBUG` - Set to `False` for production

**Current Status**: The application is running with **development defaults** for quick setup. These are:
- ⚠️ Insecure default encryption and secret keys
- ⚠️ DEBUG mode enabled
- ⚠️ Permissive ALLOWED_HOSTS

**Before deploying to production**:
1. Generate unique SECRET_KEY and ENCRYPTION_KEY values (use commands above)
2. Add them as Replit secrets (not environment variables visible in code)
3. Set DEBUG=False as a secret
4. Restart the backend workflow
5. Never commit secret values to version control

### Redis Configuration
- Runs locally on port 6379
- Used for Celery task queue and Channels layer
- Auto-started by backend startup script

## API Endpoints
Base URL: `/api/`

- `/api/auth/` - User authentication and token management
- `/api/auth/login/` - Login endpoint
- `/api/auth/users/me/` - Current user profile
- `/api/kubernetes/` - Kubernetes cluster operations
- `/api/machines/` - Machine registry
- `/api/dashboards/` - Dashboard integrations
- `/api/automation/` - Ansible playbooks
- `/api/terraform/` - Terraform workspaces
- `/api/audit/` - Audit logs

## Security Best Practices

### Development Environment (Current)
- ✅ PostgreSQL database with secure credentials
- ✅ Encrypted credential storage
- ✅ JWT token authentication
- ✅ CORS configured for Replit domains
- ⚠️ DEBUG=True (development mode)
- ⚠️ ALLOWED_HOSTS="*" (permissive for development)

### Production Deployment
Before deploying to production:
1. Set `SECRET_KEY` as a unique, random secret
2. Generate new `ENCRYPTION_KEY` and store as secret
3. Set `DEBUG=False`
4. Configure `ALLOWED_HOSTS` with specific domains
5. Use HTTPS/TLS for all connections
6. Enable rate limiting on API endpoints
7. Configure proper backup strategy for PostgreSQL

## Migration from Docker to Replit

### What Changed
- **Removed**: Docker, Docker Compose, containerization
- **Added**: Native Replit PostgreSQL database integration
- **Added**: Local Redis instance via system packages
- **Updated**: Django settings to use Replit environment variables
- **Updated**: Frontend proxy configuration for localhost backend
- **Created**: Startup scripts for environment configuration

### Benefits
- ✅ Faster startup (no container overhead)
- ✅ Integrated PostgreSQL database
- ✅ Direct access to logs and processes
- ✅ Simplified deployment workflow

## Project Structure
```
/
├── backend/
│   ├── devops_platform/     # Django project settings
│   ├── users/               # User management & authentication
│   ├── k8s_management/      # Kubernetes operations
│   ├── machines/            # Machine registry
│   ├── ssh_terminal/        # WebSocket SSH terminal
│   ├── dashboards/          # Dashboard integrations  
│   ├── automation/          # Ansible automation
│   ├── terraform/           # Terraform management
│   ├── audit/               # Audit logging
│   ├── scripts/             # Utility scripts
│   │   └── create_default_user.py  # Creates admin user
│   ├── start_server.sh      # Backend startup script
│   ├── manage.py            # Django management
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts (Auth, etc.)
│   │   ├── pages/           # Application pages
│   │   ├── App.tsx          # Main app component
│   │   └── index.tsx        # Entry point
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
│
└── replit.md                # This file
```

## Recent Changes (October 2025 Migration from Vercel to Replit)
- ✅ Migrated from Docker/Vercel to native Replit environment
- ✅ Configured PostgreSQL via Replit database service
- ✅ Installed Redis as system dependency (via nix packages)
- ✅ Created backend startup script with environment configuration
- ✅ Enhanced security: start_server.sh now requires secrets in production (fail-fast)
- ✅ Created setup_database.sh script for automated database setup verification
- ✅ Set up dual workflows (Django backend + simple frontend)
- ✅ Created admin user (admin/admin) with automated setup script
- ✅ Ran all database migrations successfully
- ✅ Verified PostgreSQL connection and data persistence
- ✅ Deployed lightweight frontend for memory-constrained environment
- ✅ Configured deployment settings for VM deployment
- ✅ Added .gitignore for Node.js/Python project

## Troubleshooting

### Backend won't start
- Check that Redis is running: `redis-cli ping`
- Verify PostgreSQL environment variables: `env | grep PG`
- Check backend logs in workflow console

### Frontend won't compile
- Ensure dependencies are installed: `cd frontend && npm install`
- Check for TypeScript errors in console
- Verify proxy configuration in package.json

### Database connection issues
- Verify PGHOST and other PG* variables are set
- Check Django settings.py database configuration
- Test connection: `cd backend && python manage.py check --database default`

### API requests failing
- Verify backend is running on port 8000
- Check CORS configuration in backend settings
- Ensure frontend proxy is configured correctly
- Check browser console for errors

## User Preferences
- **Development Mode**: Currently optimized for development with hot reload
- **Security**: Uses development defaults with option to override via secrets
- **Database**: PostgreSQL (production-grade even in development)

## Deployment Instructions

The platform is ready to deploy (publish) on Replit!

### Development Mode (Current)
- Both workflows are running successfully
- Uses safe default values for SECRET_KEY and ENCRYPTION_KEY (with warnings)
- Login with: admin / admin
- Access the app through the Webview

### Production Deployment
Before publishing, configure these Replit secrets:
1. **SECRET_KEY**: Generate with `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
2. **ENCRYPTION_KEY**: Generate with `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"`
3. **DEBUG**: Set to `False`
4. **ALLOWED_HOSTS**: Set to your specific domain(s)

Then click the **Deploy** button in Replit to publish your app!
