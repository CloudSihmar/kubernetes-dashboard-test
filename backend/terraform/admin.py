from django.contrib import admin
from .models import TerraformWorkspace, TerraformRun


@admin.register(TerraformWorkspace)
class TerraformWorkspaceAdmin(admin.ModelAdmin):
    list_display = ['name', 'environment', 'provider', 'resource_count', 'last_run_at']
    list_filter = ['environment', 'provider']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at', 'last_run_at']


@admin.register(TerraformRun)
class TerraformRunAdmin(admin.ModelAdmin):
    list_display = ['workspace', 'run_type', 'status', 'triggered_by', 'started_at', 'duration']
    list_filter = ['run_type', 'status', 'started_at']
    search_fields = ['workspace__name', 'triggered_by__username']
    readonly_fields = ['started_at', 'completed_at', 'duration', 'task_id']
