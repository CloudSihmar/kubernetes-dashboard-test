from rest_framework import serializers
from .models import Cluster, Node, Pod, Deployment, Service


class ClusterSerializer(serializers.ModelSerializer):
    nodes_count = serializers.SerializerMethodField()
    pods_count = serializers.SerializerMethodField()
    kubeconfig = serializers.CharField(write_only=True)
    
    class Meta:
        model = Cluster
        fields = ['id', 'name', 'description', 'environment', 'provider', 'region',
                  'api_server_url', 'kubeconfig', 'status', 'version',
                  'node_count', 'pod_count', 'namespace_count', 'nodes_count', 'pods_count',
                  'kubernetes_dashboard_url', 'kiali_dashboard_url', 'argocd_dashboard_url',
                  'created_at', 'updated_at', 'last_synced']
        read_only_fields = ['id', 'status', 'version', 'node_count', 'pod_count', 
                           'namespace_count', 'created_at', 'updated_at', 'last_synced']
    
    def get_nodes_count(self, obj):
        return obj.nodes.count()
    
    def get_pods_count(self, obj):
        return obj.pods.count()
    
    def create(self, validated_data):
        kubeconfig = validated_data.pop('kubeconfig')
        cluster = Cluster(**validated_data)
        cluster.set_kubeconfig(kubeconfig)
        cluster.save()
        return cluster
    
    def update(self, instance, validated_data):
        kubeconfig = validated_data.pop('kubeconfig', None)
        if kubeconfig:
            instance.set_kubeconfig(kubeconfig)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class NodeSerializer(serializers.ModelSerializer):
    cluster_name = serializers.CharField(source='cluster.name', read_only=True)
    
    class Meta:
        model = Node
        fields = ['id', 'cluster', 'cluster_name', 'name', 'status', 'role', 'version', 'os',
                  'cpu_capacity', 'memory_capacity', 'cpu_usage', 'memory_usage',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class PodSerializer(serializers.ModelSerializer):
    cluster_name = serializers.CharField(source='cluster.name', read_only=True)
    
    class Meta:
        model = Pod
        fields = ['id', 'cluster', 'cluster_name', 'name', 'namespace', 'status', 
                  'node', 'ip', 'cpu_usage', 'memory_usage', 'restarts',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class DeploymentSerializer(serializers.ModelSerializer):
    cluster_name = serializers.CharField(source='cluster.name', read_only=True)
    
    class Meta:
        model = Deployment
        fields = ['id', 'cluster', 'cluster_name', 'name', 'namespace', 
                  'replicas', 'ready_replicas', 'available_replicas', 'image',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ServiceSerializer(serializers.ModelSerializer):
    cluster_name = serializers.CharField(source='cluster.name', read_only=True)
    
    class Meta:
        model = Service
        fields = ['id', 'cluster', 'cluster_name', 'name', 'namespace', 'service_type',
                  'cluster_ip', 'external_ip', 'ports',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
