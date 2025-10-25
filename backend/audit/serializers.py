from rest_framework import serializers
from .models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = ['id', 'user', 'username', 'action', 'resource_type', 'resource_id',
                  'description', 'ip_address', 'user_agent', 'request_data',
                  'response_status', 'timestamp']
        read_only_fields = ['id', 'timestamp']
