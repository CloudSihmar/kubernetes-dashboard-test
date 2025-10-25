from django.db import models
from django.conf import settings


class TerraformWorkspace(models.Model):
    ENVIRONMENT_CHOICES = [
        ('development', 'Development'),
        ('staging', 'Staging'),
        ('production', 'Production'),
    ]
    
    PROVIDER_CHOICES = [
        ('aws', 'AWS'),
        ('azure', 'Azure'),
        ('gcp', 'Google Cloud'),
        ('kubernetes', 'Kubernetes'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    environment = models.CharField(max_length=50, choices=ENVIRONMENT_CHOICES)
    provider = models.CharField(max_length=50, choices=PROVIDER_CHOICES)
    
    # Terraform configuration
    terraform_version = models.CharField(max_length=20, default='1.6.0')
    working_directory = models.CharField(max_length=500, default='/terraform')
    terraform_code = models.TextField(help_text='Terraform configuration code')
    variables = models.JSONField(default=dict, blank=True, help_text='Terraform variables')
    
    # State management
    state_backend = models.CharField(max_length=50, default='local',
                                     help_text='Backend type: local, s3, azurerm, gcs')
    state_backend_config = models.JSONField(default=dict, blank=True)
    
    # Status
    last_plan_status = models.CharField(max_length=50, blank=True)
    last_apply_status = models.CharField(max_length=50, blank=True)
    resource_count = models.IntegerField(default=0)
    
    # Tracking
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                   null=True, related_name='created_workspaces')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_run_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'terraform_workspaces'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.environment})"


class TerraformRun(models.Model):
    RUN_TYPE_CHOICES = [
        ('PLAN', 'Plan'),
        ('APPLY', 'Apply'),
        ('DESTROY', 'Destroy'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('RUNNING', 'Running'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    workspace = models.ForeignKey(TerraformWorkspace, on_delete=models.CASCADE,
                                  related_name='runs')
    run_type = models.CharField(max_length=20, choices=RUN_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    # Execution details
    triggered_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                     null=True, related_name='terraform_runs')
    variables = models.JSONField(default=dict, blank=True)
    
    # Results
    output = models.TextField(blank=True)
    error_output = models.TextField(blank=True)
    return_code = models.IntegerField(null=True, blank=True)
    plan_output = models.TextField(blank=True, help_text='Terraform plan output')
    resources_to_add = models.IntegerField(default=0)
    resources_to_change = models.IntegerField(default=0)
    resources_to_destroy = models.IntegerField(default=0)
    
    # Timing
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    duration = models.IntegerField(null=True, blank=True, help_text='Duration in seconds')
    
    # Celery task ID
    task_id = models.CharField(max_length=255, blank=True)
    
    class Meta:
        db_table = 'terraform_runs'
        ordering = ['-started_at']
        indexes = [
            models.Index(fields=['-started_at']),
            models.Index(fields=['workspace', '-started_at']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.workspace.name} - {self.run_type} - {self.status}"
