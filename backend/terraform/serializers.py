from rest_framework import serializers
from .models import TerraformWorkspace, TerraformRun


class TerraformWorkspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TerraformWorkspace
        fields = ['id', 'name', 'description', 'environment', 'provider',
                  'terraform_version', 'working_directory', 'terraform_code',
                  'variables', 'state_backend', 'state_backend_config',
                  'last_plan_status', 'last_apply_status', 'resource_count',
                  'last_run_at', 'created_at', 'updated_at']
        read_only_fields = ['id', 'last_plan_status', 'last_apply_status', 
                            'resource_count', 'last_run_at', 'created_at', 'updated_at']


class TerraformRunSerializer(serializers.ModelSerializer):
    workspace_name = serializers.CharField(source='workspace.name', read_only=True)
    triggered_by_username = serializers.CharField(source='triggered_by.username', read_only=True)
    
    class Meta:
        model = TerraformRun
        fields = ['id', 'workspace', 'workspace_name', 'run_type', 'status',
                  'triggered_by', 'triggered_by_username', 'variables',
                  'output', 'error_output', 'return_code', 'plan_output',
                  'resources_to_add', 'resources_to_change', 'resources_to_destroy',
                  'started_at', 'completed_at', 'duration', 'task_id']
        read_only_fields = ['id', 'triggered_by', 'status', 'output', 'error_output',
                            'return_code', 'plan_output', 'resources_to_add',
                            'resources_to_change', 'resources_to_destroy',
                            'started_at', 'completed_at', 'duration', 'task_id']


class TerraformRunCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TerraformRun
        fields = ['workspace', 'run_type', 'variables']
