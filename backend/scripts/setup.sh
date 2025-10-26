#!/bin/bash

echo "DevOps Platform Setup Script"
echo "=============================="

# Wait for database to be ready
echo "Waiting for database..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "Database is ready!"

# Run migrations
echo "Running database migrations..."
python manage.py migrate

# Create default admin user
echo "Creating default admin user..."
python scripts/create_default_user.py

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Setup complete!"
echo "Default credentials: admin / admin"
echo "IMPORTANT: Change the password on first login!"
