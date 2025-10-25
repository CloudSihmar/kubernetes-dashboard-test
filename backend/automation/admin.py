from django.contrib import admin
from .models import AnsiblePlaybook, PlaybookExecution


@admin.register(AnsiblePlaybook)
class AnsiblePlaybookAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'created_by', 'execution_count', 'last_executed']
    list_filter = ['category', 'become', 'check_mode']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at', 'last_executed', 'execution_count']


@admin.register(PlaybookExecution)
class PlaybookExecutionAdmin(admin.ModelAdmin):
    list_display = ['playbook', 'status', 'executed_by', 'started_at', 'duration']
    list_filter = ['status', 'started_at']
    search_fields = ['playbook__name', 'executed_by__username']
    readonly_fields = ['started_at', 'completed_at', 'duration', 'task_id']
