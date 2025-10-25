from django.db import models
from django.conf import settings
from cryptography.fernet import Fernet
from k8s_management.models import Cluster


class Dashboard(models.Model):
    CATEGORY_CHOICES = [
        ('kubernetes', 'Kubernetes'),
        ('monitoring', 'Monitoring'),
        ('logging', 'Logging'),
        ('cicd', 'CI/CD'),
        ('security', 'Security'),
    ]
    
    name = models.CharField(max_length=255, unique=True)
    display_name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    icon = models.CharField(max_length=50, blank=True)
    
    # Authentication requirements
    requires_token = models.BooleanField(default=False)
    requires_username_password = models.BooleanField(default=False)
    requires_api_key = models.BooleanField(default=False)
    
    # Default configuration
    default_port = models.IntegerField(null=True, blank=True)
    default_path = models.CharField(max_length=255, default='/')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'dashboards'
        ordering = ['category', 'name']
    
    def __str__(self):
        return f"{self.display_name} ({self.category})"


class DashboardIntegration(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('error', 'Error'),
    ]
    
    dashboard = models.ForeignKey(Dashboard, on_delete=models.CASCADE,
                                  related_name='integrations')
    cluster = models.ForeignKey(Cluster, on_delete=models.CASCADE,
                                related_name='dashboard_integrations', null=True, blank=True)
    
    # Connection details
    url = models.URLField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='inactive')
    
    # Encrypted credentials
    username_encrypted = models.BinaryField(null=True, blank=True)
    password_encrypted = models.BinaryField(null=True, blank=True)
    token_encrypted = models.BinaryField(null=True, blank=True)
    api_key_encrypted = models.BinaryField(null=True, blank=True)
    
    # Configuration
    custom_config = models.JSONField(default=dict, blank=True)
    auto_login_enabled = models.BooleanField(default=True)
    
    # Tracking
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                   null=True, related_name='created_integrations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_accessed = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'dashboard_integrations'
        ordering = ['-created_at']
        unique_together = ['dashboard', 'cluster']
    
    def __str__(self):
        cluster_name = self.cluster.name if self.cluster else 'Global'
        return f"{self.dashboard.display_name} - {cluster_name}"
    
    def set_username(self, username: str):
        """Encrypt and store username"""
        if username:
            cipher = Fernet(settings.ENCRYPTION_KEY.encode())
            self.username_encrypted = cipher.encrypt(username.encode())
    
    def get_username(self) -> str:
        """Decrypt and return username"""
        if self.username_encrypted:
            cipher = Fernet(settings.ENCRYPTION_KEY.encode())
            return cipher.decrypt(self.username_encrypted).decode()
        return ''
    
    def set_password(self, password: str):
        """Encrypt and store password"""
        if password:
            cipher = Fernet(settings.ENCRYPTION_KEY.encode())
            self.password_encrypted = cipher.encrypt(password.encode())
    
    def get_password(self) -> str:
        """Decrypt and return password"""
        if self.password_encrypted:
            cipher = Fernet(settings.ENCRYPTION_KEY.encode())
            return cipher.decrypt(self.password_encrypted).decode()
        return ''
    
    def set_token(self, token: str):
        """Encrypt and store token"""
        if token:
            cipher = Fernet(settings.ENCRYPTION_KEY.encode())
            self.token_encrypted = cipher.encrypt(token.encode())
    
    def get_token(self) -> str:
        """Decrypt and return token"""
        if self.token_encrypted:
            cipher = Fernet(settings.ENCRYPTION_KEY.encode())
            return cipher.decrypt(self.token_encrypted).decode()
        return ''
    
    def set_api_key(self, api_key: str):
        """Encrypt and store API key"""
        if api_key:
            cipher = Fernet(settings.ENCRYPTION_KEY.encode())
            self.api_key_encrypted = cipher.encrypt(api_key.encode())
    
    def get_api_key(self) -> str:
        """Decrypt and return API key"""
        if self.api_key_encrypted:
            cipher = Fernet(settings.ENCRYPTION_KEY.encode())
            return cipher.decrypt(self.api_key_encrypted).decode()
        return ''
