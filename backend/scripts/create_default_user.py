import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'devops_platform.settings')
django.setup()

from users.models import User

# Create default admin user
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='admin',
        role='super_admin',
        force_password_change=True
    )
    print("Default admin user created: admin/admin")
    print("IMPORTANT: Change password on first login!")
else:
    print("Admin user already exists")
