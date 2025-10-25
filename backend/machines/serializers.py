from rest_framework import serializers
from .models import Machine


class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = ['id', 'name', 'hostname', 'ip_address', 'port', 'os_type',
                  'status', 'ssh_username', 'description', 'tags', 
                  'application_name', 'environment', 'created_at', 'updated_at', 'last_checked']
        read_only_fields = ['id', 'status', 'created_at', 'updated_at', 'last_checked']


class MachineCreateSerializer(serializers.ModelSerializer):
    ssh_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    ssh_private_key = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = Machine
        fields = ['name', 'hostname', 'ip_address', 'port', 'os_type',
                  'ssh_username', 'ssh_password', 'ssh_private_key', 
                  'description', 'tags', 'application_name', 'environment']
    
    def create(self, validated_data):
        ssh_password = validated_data.pop('ssh_password', None)
        ssh_private_key = validated_data.pop('ssh_private_key', None)
        
        machine = Machine.objects.create(**validated_data)
        
        if ssh_password:
            machine.set_ssh_password(ssh_password)
        if ssh_private_key:
            machine.set_ssh_private_key(ssh_private_key)
        
        machine.save()
        return machine
    
    def update(self, instance, validated_data):
        ssh_password = validated_data.pop('ssh_password', None)
        ssh_private_key = validated_data.pop('ssh_private_key', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if ssh_password:
            instance.set_ssh_password(ssh_password)
        if ssh_private_key:
            instance.set_ssh_private_key(ssh_private_key)
        
        instance.save()
        return instance
