from django.contrib.auth.models import AbstractUser
from django.db import models
from cryptography.fernet import Fernet
from django.conf import settings


class User(AbstractUser):
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('operator', 'Operator'),
        ('viewer', 'Viewer'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='viewer')
    force_password_change = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    def has_write_permission(self):
        return self.role in ['super_admin', 'operator']
    
    def has_admin_permission(self):
        return self.role == 'super_admin'


class EncryptedCredential(models.Model):
    CREDENTIAL_TYPES = [
        ('ssh_key', 'SSH Key'),
        ('password', 'Password'),
        ('api_token', 'API Token'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='credentials')
    name = models.CharField(max_length=255)
    credential_type = models.CharField(max_length=20, choices=CREDENTIAL_TYPES)
    encrypted_value = models.BinaryField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'encrypted_credentials'
        ordering = ['-created_at']
        unique_together = ['user', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.get_credential_type_display()}) - {self.user.username}"
    
    def set_value(self, value: str):
        """Encrypt and store the credential value"""
        cipher = Fernet(settings.ENCRYPTION_KEY.encode())
        self.encrypted_value = cipher.encrypt(value.encode())
    
    def get_value(self) -> str:
        """Decrypt and return the credential value"""
        cipher = Fernet(settings.ENCRYPTION_KEY.encode())
        return cipher.decrypt(self.encrypted_value).decode()
