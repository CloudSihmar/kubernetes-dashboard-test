#!/bin/bash

# Database setup script for DevOps Control Platform
# This script runs migrations and creates the default admin user

set -e  # Exit on any error

echo "========================================="
echo "DevOps Platform - Database Setup"
echo "========================================="

# Check if we're in the backend directory
if [ ! -f "manage.py" ]; then
    echo "Error: manage.py not found. Please run this script from the backend directory."
    exit 1
fi

# Check database connection
echo "1. Testing database connection..."
python manage.py check --database default
if [ $? -ne 0 ]; then
    echo "❌ Database connection failed!"
    exit 1
fi
echo "✅ Database connection successful"

# Run migrations
echo ""
echo "2. Running database migrations..."
python manage.py migrate --noinput
if [ $? -ne 0 ]; then
    echo "❌ Database migrations failed!"
    exit 1
fi
echo "✅ Database migrations completed"

# Create default superuser if it doesn't exist
echo ""
echo "3. Creating default admin user (admin/admin)..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    print('✅ Admin user created successfully')
    print('   Username: admin')
    print('   Password: admin')
    print('   ⚠️  Please change this password on first login!')
else:
    print('✅ Admin user already exists')
"

if [ $? -ne 0 ]; then
    echo "❌ Failed to create admin user!"
    exit 1
fi

# Collect static files
echo ""
echo "4. Collecting static files..."
python manage.py collectstatic --noinput
if [ $? -ne 0 ]; then
    echo "❌ Failed to collect static files!"
    exit 1
fi
echo "✅ Static files collected"

echo ""
echo "========================================="
echo "✅ Database setup completed successfully!"
echo "========================================="
echo ""
echo "You can now start the server with: bash start_server.sh"
echo ""
