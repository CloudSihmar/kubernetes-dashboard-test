from django.db import models
from django.conf import settings
from cryptography.fernet import Fernet


class Cluster(models.Model):
    STATUS_CHOICES = [
        ('healthy', 'Healthy'),
        ('warning', 'Warning'),
        ('critical', 'Critical'),
        ('offline', 'Offline'),
    ]
    
    ENVIRONMENT_CHOICES = [
        ('development', 'Development'),
        ('staging', 'Staging'),
        ('production', 'Production'),
    ]
    
    PROVIDER_CHOICES = [
        ('aws', 'AWS EKS'),
        ('azure', 'Azure AKS'),
        ('gcp', 'Google GKE'),
        ('on-premise', 'On-Premise'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    environment = models.CharField(max_length=50, choices=ENVIRONMENT_CHOICES, default='development')
    provider = models.CharField(max_length=50, choices=PROVIDER_CHOICES, default='on-premise')
    region = models.CharField(max_length=100, blank=True)
    
    api_server_url = models.URLField()
    encrypted_kubeconfig = models.BinaryField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='offline')
    version = models.CharField(max_length=50, blank=True)
    node_count = models.IntegerField(default=0)
    pod_count = models.IntegerField(default=0)
    namespace_count = models.IntegerField(default=0)
    
    # Dashboard links
    kubernetes_dashboard_url = models.URLField(blank=True, null=True)
    kiali_dashboard_url = models.URLField(blank=True, null=True)
    argocd_dashboard_url = models.URLField(blank=True, null=True)
    
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, 
                                   null=True, related_name='created_clusters')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_synced = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'kubernetes_clusters'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.status})"
    
    def set_kubeconfig(self, kubeconfig: str):
        """Encrypt and store kubeconfig"""
        cipher = Fernet(settings.ENCRYPTION_KEY.encode())
        self.encrypted_kubeconfig = cipher.encrypt(kubeconfig.encode())
    
    def get_kubeconfig(self) -> str:
        """Decrypt and return kubeconfig"""
        cipher = Fernet(settings.ENCRYPTION_KEY.encode())
        return cipher.decrypt(self.encrypted_kubeconfig).decode()


class Node(models.Model):
    STATUS_CHOICES = [
        ('Ready', 'Ready'),
        ('NotReady', 'Not Ready'),
        ('Unknown', 'Unknown'),
    ]
    
    ROLE_CHOICES = [
        ('master', 'Master'),
        ('worker', 'Worker'),
    ]
    
    cluster = models.ForeignKey(Cluster, on_delete=models.CASCADE, related_name='nodes')
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Unknown')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='worker')
    version = models.CharField(max_length=50, blank=True)
    os = models.CharField(max_length=100, blank=True)
    
    # Capacity
    cpu_capacity = models.CharField(max_length=50, blank=True)
    memory_capacity = models.CharField(max_length=50, blank=True)
    
    # Usage
    cpu_usage = models.FloatField(null=True, blank=True, help_text='CPU usage percentage')
    memory_usage = models.FloatField(null=True, blank=True, help_text='Memory usage percentage')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'kubernetes_nodes'
        ordering = ['cluster', 'name']
        unique_together = ['cluster', 'name']
    
    def __str__(self):
        return f"{self.cluster.name} - {self.name}"


class Pod(models.Model):
    STATUS_CHOICES = [
        ('Running', 'Running'),
        ('Pending', 'Pending'),
        ('Succeeded', 'Succeeded'),
        ('Failed', 'Failed'),
        ('Unknown', 'Unknown'),
    ]
    
    cluster = models.ForeignKey(Cluster, on_delete=models.CASCADE, related_name='pods')
    name = models.CharField(max_length=255)
    namespace = models.CharField(max_length=255, default='default')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Unknown')
    node = models.CharField(max_length=255, blank=True)
    ip = models.GenericIPAddressField(null=True, blank=True)
    
    # Resource usage
    cpu_usage = models.CharField(max_length=50, blank=True)
    memory_usage = models.CharField(max_length=50, blank=True)
    restarts = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'kubernetes_pods'
        ordering = ['cluster', 'namespace', 'name']
        unique_together = ['cluster', 'namespace', 'name']
    
    def __str__(self):
        return f"{self.cluster.name} - {self.namespace}/{self.name}"


class Deployment(models.Model):
    cluster = models.ForeignKey(Cluster, on_delete=models.CASCADE, related_name='deployments')
    name = models.CharField(max_length=255)
    namespace = models.CharField(max_length=255, default='default')
    replicas = models.IntegerField(default=1)
    ready_replicas = models.IntegerField(default=0)
    available_replicas = models.IntegerField(default=0)
    image = models.CharField(max_length=500, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'kubernetes_deployments'
        ordering = ['cluster', 'namespace', 'name']
        unique_together = ['cluster', 'namespace', 'name']
    
    def __str__(self):
        return f"{self.cluster.name} - {self.namespace}/{self.name}"


class Service(models.Model):
    SERVICE_TYPE_CHOICES = [
        ('ClusterIP', 'ClusterIP'),
        ('NodePort', 'NodePort'),
        ('LoadBalancer', 'LoadBalancer'),
        ('ExternalName', 'ExternalName'),
    ]
    
    cluster = models.ForeignKey(Cluster, on_delete=models.CASCADE, related_name='services')
    name = models.CharField(max_length=255)
    namespace = models.CharField(max_length=255, default='default')
    service_type = models.CharField(max_length=50, choices=SERVICE_TYPE_CHOICES, default='ClusterIP')
    cluster_ip = models.GenericIPAddressField(null=True, blank=True)
    external_ip = models.CharField(max_length=255, blank=True)
    ports = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'kubernetes_services'
        ordering = ['cluster', 'namespace', 'name']
        unique_together = ['cluster', 'namespace', 'name']
    
    def __str__(self):
        return f"{self.cluster.name} - {self.namespace}/{self.name}"
