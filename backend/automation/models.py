from django.db import models
from django.conf import settings


class AnsiblePlaybook(models.Model):
    CATEGORY_CHOICES = [
        ('deployment', 'Deployment'),
        ('configuration', 'Configuration'),
        ('maintenance', 'Maintenance'),
        ('security', 'Security'),
        ('monitoring', 'Monitoring'),
    ]
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='deployment')
    playbook_content = models.TextField(help_text='YAML content of the playbook')
    inventory_content = models.TextField(blank=True, help_text='Inventory file content')
    variables = models.JSONField(default=dict, blank=True, help_text='Default variables')
    tags = models.JSONField(default=list, blank=True)
    
    # Execution settings
    timeout = models.IntegerField(default=3600, help_text='Timeout in seconds')
    become = models.BooleanField(default=False, help_text='Run with sudo')
    check_mode = models.BooleanField(default=False, help_text='Dry run mode')
    
    # Tracking
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                   null=True, related_name='created_playbooks')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_executed = models.DateTimeField(null=True, blank=True)
    execution_count = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'ansible_playbooks'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.category})"


class PlaybookExecution(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('RUNNING', 'Running'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    playbook = models.ForeignKey(AnsiblePlaybook, on_delete=models.CASCADE,
                                 related_name='executions')
    executed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                    null=True, related_name='playbook_executions')
    
    # Execution details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    target_hosts = models.JSONField(default=list, help_text='List of target host IPs')
    variables = models.JSONField(default=dict, blank=True, help_text='Runtime variables')
    
    # Results
    output = models.TextField(blank=True)
    error_output = models.TextField(blank=True)
    return_code = models.IntegerField(null=True, blank=True)
    
    # Timing
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    duration = models.IntegerField(null=True, blank=True, help_text='Duration in seconds')
    
    # Celery task ID
    task_id = models.CharField(max_length=255, blank=True)
    
    class Meta:
        db_table = 'playbook_executions'
        ordering = ['-started_at']
        indexes = [
            models.Index(fields=['-started_at']),
            models.Index(fields=['playbook', '-started_at']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.playbook.name} - {self.status} - {self.started_at}"
