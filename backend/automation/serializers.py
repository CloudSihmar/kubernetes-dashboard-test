from rest_framework import serializers
from .models import AnsiblePlaybook, PlaybookExecution


class AnsiblePlaybookSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnsiblePlaybook
        fields = ['id', 'name', 'description', 'category', 'playbook_content',
                  'inventory_content', 'variables', 'tags', 'timeout', 'become', 
                  'check_mode', 'execution_count', 'last_executed',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'execution_count', 'last_executed', 'created_at', 'updated_at']


class PlaybookExecutionSerializer(serializers.ModelSerializer):
    playbook_name = serializers.CharField(source='playbook.name', read_only=True)
    executed_by_username = serializers.CharField(source='executed_by.username', read_only=True)
    
    class Meta:
        model = PlaybookExecution
        fields = ['id', 'playbook', 'playbook_name', 'executed_by', 
                  'executed_by_username', 'target_hosts', 'variables', 'status', 
                  'output', 'error_output', 'return_code', 'started_at', 
                  'completed_at', 'duration', 'task_id']
        read_only_fields = ['id', 'executed_by', 'status', 'output', 
                            'error_output', 'return_code', 'started_at', 
                            'completed_at', 'duration', 'task_id']


class PlaybookExecutionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaybookExecution
        fields = ['playbook', 'target_hosts', 'variables']
