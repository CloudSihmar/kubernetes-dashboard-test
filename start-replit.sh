#!/bin/bash
set -e

echo "🚀 Starting DevOps Platform on Replit..."
echo "========================================="

# Start backend on port 8000
cd backend
echo "📦 Running database migrations..."
python manage.py migrate

echo "👤 Creating admin user..."
DJANGO_SUPERUSER_PASSWORD=admin123 python manage.py createsuperuser --noinput --username admin --email admin@example.com 2>/dev/null || echo "Admin user already exists"

echo "🔧 Starting Django backend on port 8000..."
daphne -b 0.0.0.0 -p 8000 devops_platform.asgi:application &
BACKEND_PID=$!

# Start simple frontend on port 5000
cd ../simple-frontend
echo "🌐 Starting frontend on port 5000..."
node server.js &
FRONTEND_PID=$!

echo "========================================="
echo "✓ Backend API: http://localhost:8000"
echo "✓ Frontend: http://localhost:5000"
echo "✓ Default login: admin / admin123"
echo "========================================="

# Wait for frontend (it's the main service)
wait $FRONTEND_PID

# If frontend exits, kill backend
kill $BACKEND_PID 2>/dev/null
