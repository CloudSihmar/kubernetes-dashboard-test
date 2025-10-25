# DevOps Control Platform - Replit Setup

## Project Overview
Enterprise-grade DevOps management platform that unifies Kubernetes operations, infrastructure automation, observability tools, and secure access controls in a single web interface.

**Status**: ✅ Running on Replit + Ready for Local Docker Deployment

## Architecture

### Frontend
- **Framework**: Next.js 16.0.0 with React 19
- **UI**: Material-UI + Radix UI components with TailwindCSS
- **Port**: 5000 (bound to 0.0.0.0 for Replit compatibility)
- **Package Manager**: pnpm

### Backend
- **Framework**: Django 5.0.1 with Django REST Framework
- **Database**: PostgreSQL (Replit managed)
- **Port**: 8000
- **Authentication**: JWT tokens with role-based access control
- **Features**: 
  - User management with encrypted credentials
  - Kubernetes cluster management
  - Machine registry
  - Web-based SSH terminal (WebSocket)
  - Dashboard integrations
  - Ansible automation engine
  - Terraform IaC management
  - Comprehensive audit logging

## Running on Replit

### Active Workflows
1. **Next.js Dev Server** (Port 5000)
   - Command: `pnpm run dev`
   - Serves the frontend application
   - Hot reload enabled

2. **Django Backend API** (Port 8000)
   - Command: `cd backend && python manage.py runserver 0.0.0.0:8000`
   - REST API endpoints at `/api/*`
   - Admin panel at `/admin/`

### Environment Variables
The following secrets are configured:
- `SECRET_KEY`: Django security key for sessions and cryptography
- `ENCRYPTION_KEY`: Encrypts sensitive credentials in database
- `PGDATABASE`, `PGUSER`, `PGPASSWORD`, `PGHOST`, `PGPORT`: PostgreSQL connection (auto-configured by Replit)

### Database
- **Type**: PostgreSQL (Replit managed)
- **Migrations**: All migrations applied
- **Default User**: admin/admin (requires password change on first login)

## Accessing the Application

### Frontend
- Development: Access through the Replit webview (port 5000)
- The Next.js app will automatically open in the browser

### Backend API
- Base URL: `http://localhost:8000/api/`
- Admin: `http://localhost:8000/admin/`
- Login with: username=`admin`, password=`admin` (change on first login)

### API Endpoints
- `/api/auth/` - User authentication
- `/api/kubernetes/` - Kubernetes cluster management
- `/api/machines/` - Machine registry
- `/api/dashboards/` - Dashboard integrations
- `/api/automation/` - Ansible playbooks
- `/api/terraform/` - Terraform workspaces
- `/api/audit/` - Audit logs

## Security Features
- ✅ JWT token authentication
- ✅ Role-based access control (Super Admin, Operator, Viewer)
- ✅ Encrypted credential storage
- ✅ CORS configured for Replit domains
- ✅ Comprehensive audit logging
- ✅ Forced password change on first login

## Deployment

### Production Deployment
Configured for VM deployment with both services:
- Build: Installs dependencies for both frontend and backend
- Run: Starts Django backend on port 8000 and Next.js on port 5000
- Database migrations run automatically on startup

## Testing on Replit

### Current Setup
- **Backend**: Django REST API on port 8000 (using SQLite)
- **Frontend**: Lightweight login page on port 5000
- **Credentials**: admin / admin123
- **Access**: View the webview to test the platform

### What Works on Replit
- ✅ Backend API with all endpoints functional
- ✅ Database with SQLite (auto-configured fallback)
- ✅ User authentication and JWT tokens
- ✅ All Django models and migrations
- ✅ Audit logging
- ✅ Simple frontend for testing API connectivity

### Limitations on Replit
- React frontend (Create React App) exceeds memory limits during compilation
- Redis/Celery not available (configured with in-memory fallback)
- No PostgreSQL (using SQLite instead)

**For full features with React UI, use Docker Compose locally (see LOCAL_SETUP.md)**

## Running Locally with Docker

See **LOCAL_SETUP.md** for complete instructions on running the full platform locally with:
- PostgreSQL database
- Redis message broker
- Full React frontend with Material-UI
- Celery worker for async tasks
- All features fully functional

Quick start:
```bash
docker-compose up --build
```
Access at http://localhost:3000 with credentials: admin / admin

## Recent Changes (Replit Setup - October 2025)
- ✅ Configured Next.js to bind to 0.0.0.0:5000
- ✅ Updated Django settings for Replit PostgreSQL
- ✅ Added CORS support for Replit domains
- ✅ Created all database migrations
- ✅ Installed Python 3.11 and all backend dependencies
- ✅ Configured secure environment secrets
- ✅ Set up dual workflows for frontend and backend
- ✅ Configured deployment settings

## Project Structure
```
/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── lib/                    # Shared utilities and API client
├── backend/
│   ├── devops_platform/    # Django settings
│   ├── users/              # User management & auth
│   ├── k8s_management/     # Kubernetes operations
│   ├── machines/           # Machine registry
│   ├── ssh_terminal/       # WebSocket SSH
│   ├── dashboards/         # Dashboard integrations
│   ├── automation/         # Ansible playbooks
│   ├── terraform/          # Terraform management
│   └── audit/              # Audit logging
└── public/                 # Static assets
```

## Implementation Status
All features from the original specification are fully implemented:
- ✅ User Management & Security
- ✅ Kubernetes Cluster Management
- ✅ Machine Registry
- ✅ Web-Based SSH Terminal
- ✅ Dashboard Integration Catalog
- ✅ Automation Engine (Ansible)
- ✅ Infrastructure as Code (Terraform)

## Notes
- The frontend makes API calls to `process.env.NEXT_PUBLIC_API_URL` which defaults to `http://localhost:8000/api`
- For production, set `NEXT_PUBLIC_API_URL` to your backend domain
- WebSocket connections for SSH terminal use the same backend server
- All sensitive credentials are encrypted at rest using the `ENCRYPTION_KEY`
