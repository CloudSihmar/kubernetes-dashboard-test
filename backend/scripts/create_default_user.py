import os
import sys
import django

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'devops_platform.settings')
django.setup()

from users.models import User

# Create default admin user
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='dashboard',
        role='super_admin',
        force_password_change=True
    )
    print("Default admin user created: admin/dashboard")
    print("IMPORTANT: Change password on first login!")
else:
    print("Admin user already exists")
