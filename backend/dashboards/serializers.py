from rest_framework import serializers
from .models import Dashboard, DashboardIntegration


class DashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dashboard
        fields = ['id', 'name', 'display_name', 'description', 'category', 'icon',
                  'requires_token', 'requires_username_password', 'requires_api_key',
                  'default_port', 'default_path', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class DashboardIntegrationSerializer(serializers.ModelSerializer):
    dashboard_name = serializers.CharField(source='dashboard.display_name', read_only=True)
    cluster_name = serializers.CharField(source='cluster.name', read_only=True, allow_null=True)
    
    class Meta:
        model = DashboardIntegration
        fields = ['id', 'dashboard', 'dashboard_name', 'cluster', 'cluster_name',
                  'url', 'status', 'auto_login_enabled', 'custom_config',
                  'created_at', 'updated_at', 'last_accessed']
        read_only_fields = ['id', 'status', 'created_at', 'updated_at', 'last_accessed']


class DashboardIntegrationCreateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    token = serializers.CharField(write_only=True, required=False, allow_blank=True)
    api_key = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = DashboardIntegration
        fields = ['dashboard', 'cluster', 'url', 'username', 'password', 'token',
                  'api_key', 'auto_login_enabled', 'custom_config']
    
    def create(self, validated_data):
        username = validated_data.pop('username', None)
        password = validated_data.pop('password', None)
        token = validated_data.pop('token', None)
        api_key = validated_data.pop('api_key', None)
        
        integration = DashboardIntegration.objects.create(**validated_data)
        
        if username:
            integration.set_username(username)
        if password:
            integration.set_password(password)
        if token:
            integration.set_token(token)
        if api_key:
            integration.set_api_key(api_key)
        
        integration.save()
        return integration
    
    def update(self, instance, validated_data):
        username = validated_data.pop('username', None)
        password = validated_data.pop('password', None)
        token = validated_data.pop('token', None)
        api_key = validated_data.pop('api_key', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if username:
            instance.set_username(username)
        if password:
            instance.set_password(password)
        if token:
            instance.set_token(token)
        if api_key:
            instance.set_api_key(api_key)
        
        instance.save()
        return instance
