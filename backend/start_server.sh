#!/bin/bash

# Start Redis if not running
redis-cli ping > /dev/null 2>&1 || redis-server --daemonize yes --port 6379

# Export Replit PostgreSQL credentials (already available as env vars)
# These are: PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT, DATABASE_URL

# Set Redis environment variables
export REDIS_HOST="127.0.0.1"
export REDIS_URL="redis://127.0.0.1:6379/0"

# Use persistent secrets or set defaults for development
# WARNING: For production, these MUST be set as Replit secrets!
if [ -z "$ENCRYPTION_KEY" ]; then
    echo "⚠️  WARNING: Using default ENCRYPTION_KEY. Set as Replit secret for production!"
    export ENCRYPTION_KEY="INSECURE-DEV-KEY-CHANGE-ME-IN-PRODUCTION-12345678901234567890123="
fi

if [ -z "$SECRET_KEY" ]; then
    echo "⚠️  WARNING: Using default SECRET_KEY. Set as Replit secret for production!"
    export SECRET_KEY="django-insecure-dev-key-please-set-SECRET_KEY-secret-in-production"
fi

if [ -z "$DEBUG" ]; then
    echo "⚠️  WARNING: DEBUG mode enabled. Set DEBUG=False for production!"
    export DEBUG="True"
fi

# Set ALLOWED_HOSTS only if not already configured
# For production, set this as a Replit secret with your specific domains
if [ -z "$ALLOWED_HOSTS" ]; then
    echo "⚠️  WARNING: ALLOWED_HOSTS='*' (permissive). Set specific domains for production!"
    export ALLOWED_HOSTS="*"
fi

# Collect static files
python manage.py collectstatic --noinput

# Start Daphne server
exec daphne -b 0.0.0.0 -p 8000 devops_platform.asgi:application
