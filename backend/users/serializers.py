from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, EncryptedCredential


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 
                  'force_password_change', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 
                  'password_confirm', 'role']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        return attrs


class EncryptedCredentialSerializer(serializers.ModelSerializer):
    value = serializers.CharField(write_only=True)
    
    class Meta:
        model = EncryptedCredential
        fields = ['id', 'name', 'credential_type', 'description', 'value', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        value = validated_data.pop('value')
        credential = EncryptedCredential.objects.create(**validated_data)
        credential.set_value(value)
        credential.save()
        return credential
    
    def update(self, instance, validated_data):
        value = validated_data.pop('value', None)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        if value:
            instance.set_value(value)
        instance.save()
        return instance
