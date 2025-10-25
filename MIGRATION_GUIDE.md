# Migration Guide: Kubernetes App Renamed to k8s_management

## What Changed

The Django app `kubernetes` has been renamed to `k8s_management` to avoid naming conflicts with the Python `kubernetes` package.

## Required Steps

### 1. Database Migration

Since the database table names remain the same (e.g., `kubernetes_clusters`), no database migration is needed. However, you need to run migrations to register the new app:

\`\`\`bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
\`\`\`

### 2. Restart Services

After the changes, restart all services:

\`\`\`bash
docker-compose down
docker-compose up -d
\`\`\`

### 3. Verify

Check that all services are running:

\`\`\`bash
docker-compose ps
docker logs devopsplatform-v1-backend-1
docker logs devopsplatform-v1-celery-1
docker logs devopsplatform-v1-frontend-1
\`\`\`

## What Was Updated

1. **Backend App Renamed**: `backend/kubernetes/` → `backend/k8s_management/`
2. **Settings Updated**: `INSTALLED_APPS` now includes `'k8s_management'`
3. **URL Configuration**: Updated to use `k8s_management.urls`
4. **Import Statements**: All imports updated in `dashboards/models.py`
5. **Database Tables**: Remain unchanged (backward compatible)

## API Endpoints

All API endpoints remain the same:
- `/api/kubernetes/clusters/`
- `/api/kubernetes/nodes/`
- `/api/kubernetes/pods/`
- etc.

No frontend changes are required.
