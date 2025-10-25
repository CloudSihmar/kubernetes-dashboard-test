from django.db import models
from django.conf import settings
from cryptography.fernet import Fernet


class Machine(models.Model):
    STATUS_CHOICES = [
        ('online', 'Online'),
        ('offline', 'Offline'),
        ('unknown', 'Unknown'),
    ]
    
    OS_TYPE_CHOICES = [
        ('linux', 'Linux'),
        ('windows', 'Windows'),
        ('macos', 'macOS'),
    ]
    
    name = models.CharField(max_length=255)
    hostname = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField()
    port = models.IntegerField(default=22)
    os_type = models.CharField(max_length=20, choices=OS_TYPE_CHOICES, default='linux')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unknown')
    
    # SSH credentials
    ssh_username = models.CharField(max_length=255)
    ssh_password_encrypted = models.BinaryField(null=True, blank=True)
    ssh_private_key_encrypted = models.BinaryField(null=True, blank=True)
    
    # Metadata
    description = models.TextField(blank=True)
    tags = models.JSONField(default=list, blank=True)
    application_name = models.CharField(max_length=255, blank=True)
    environment = models.CharField(max_length=50, blank=True)
    
    # Tracking
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, 
                                   null=True, related_name='created_machines')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_checked = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'machines'
        ordering = ['-created_at']
        unique_together = ['ip_address', 'port']
    
    def __str__(self):
        return f"{self.name} ({self.ip_address})"
    
    def set_ssh_password(self, password: str):
        """Encrypt and store SSH password"""
        if password:
            cipher = Fernet(settings.ENCRYPTION_KEY.encode())
            self.ssh_password_encrypted = cipher.encrypt(password.encode())
    
    def get_ssh_password(self) -> str:
        """Decrypt and return SSH password"""
        if self.ssh_password_encrypted:
            cipher = Fernet(settings.ENCRYPTION_KEY.encode())
            return cipher.decrypt(self.ssh_password_encrypted).decode()
        return ''
    
    def set_ssh_private_key(self, private_key: str):
        """Encrypt and store SSH private key"""
        if private_key:
            cipher = Fernet(settings.ENCRYPTION_KEY.encode())
            self.ssh_private_key_encrypted = cipher.encrypt(private_key.encode())
    
    def get_ssh_private_key(self) -> str:
        """Decrypt and return SSH private key"""
        if self.ssh_private_key_encrypted:
            cipher = Fernet(settings.ENCRYPTION_KEY.encode())
            return cipher.decrypt(self.ssh_private_key_encrypted).decode()
        return ''
