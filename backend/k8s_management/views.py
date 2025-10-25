from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Cluster, Node, Pod, Deployment, Service
from .serializers import (ClusterSerializer, NodeSerializer, PodSerializer,
                          DeploymentSerializer, ServiceSerializer)
from .k8s_client import KubernetesClient
from audit.utils import log_audit


class ClusterViewSet(viewsets.ModelViewSet):
    queryset = Cluster.objects.all()
    serializer_class = ClusterSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        cluster = serializer.save(created_by=self.request.user)
        log_audit(self.request.user, 'CREATE', 'Cluster', cluster.id, 
                  f'Created cluster: {cluster.name}')
    
    def perform_update(self, serializer):
        cluster = serializer.save()
        log_audit(self.request.user, 'UPDATE', 'Cluster', cluster.id,
                  f'Updated cluster: {cluster.name}')
    
    def perform_destroy(self, instance):
        log_audit(self.request.user, 'DELETE', 'Cluster', instance.id,
                  f'Deleted cluster: {instance.name}')
        instance.delete()
    
    @action(detail=True, methods=['post'])
    def sync(self, request, pk=None):
        """Sync cluster data from Kubernetes API"""
        cluster = self.get_object()
        
        try:
            k8s_client = KubernetesClient(cluster)
            
            # Test connection
            if not k8s_client.test_connection():
                return Response(
                    {'error': 'Failed to connect to cluster'},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            
            # Get cluster metrics
            metrics = k8s_client.get_cluster_metrics()
            version = k8s_client.get_cluster_version()
            
            # Update cluster
            cluster.version = version
            cluster.node_count = metrics['node_count']
            cluster.pod_count = metrics['pod_count']
            cluster.namespace_count = metrics['namespace_count']
            cluster.status = 'healthy'
            cluster.last_synced = timezone.now()
            cluster.save()
            
            # Sync nodes
            nodes_data = k8s_client.list_nodes()
            for node_data in nodes_data:
                Node.objects.update_or_create(
                    cluster=cluster,
                    name=node_data['name'],
                    defaults={
                        'status': node_data['status'],
                        'role': node_data['role'],
                        'version': node_data['version'],
                        'os': node_data['os'],
                        'cpu_capacity': node_data['cpu_capacity'],
                        'memory_capacity': node_data['memory_capacity'],
                    }
                )
            
            # Sync pods
            pods_data = k8s_client.list_pods()
            for pod_data in pods_data:
                Pod.objects.update_or_create(
                    cluster=cluster,
                    name=pod_data['name'],
                    namespace=pod_data['namespace'],
                    defaults={
                        'status': pod_data['status'],
                        'node': pod_data['node'],
                        'ip': pod_data['ip'],
                        'restarts': pod_data['restarts'],
                    }
                )
            
            # Sync deployments
            deployments_data = k8s_client.list_deployments()
            for deploy_data in deployments_data:
                Deployment.objects.update_or_create(
                    cluster=cluster,
                    name=deploy_data['name'],
                    namespace=deploy_data['namespace'],
                    defaults={
                        'replicas': deploy_data['replicas'],
                        'ready_replicas': deploy_data['ready_replicas'],
                        'available_replicas': deploy_data['available_replicas'],
                    }
                )
            
            log_audit(request.user, 'SYNC', 'Cluster', cluster.id,
                      f'Synced cluster: {cluster.name}')
            
            return Response({
                'status': 'synced',
                'metrics': metrics,
                'version': version
            })
            
        except Exception as e:
            cluster.status = 'offline'
            cluster.save()
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'])
    def nodes(self, request, pk=None):
        """Get nodes for a specific cluster"""
        cluster = self.get_object()
        nodes = Node.objects.filter(cluster=cluster)
        serializer = NodeSerializer(nodes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def pods(self, request, pk=None):
        """Get pods for a specific cluster"""
        cluster = self.get_object()
        pods = Pod.objects.filter(cluster=cluster)
        serializer = PodSerializer(pods, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def deployments(self, request, pk=None):
        """Get deployments for a specific cluster"""
        cluster = self.get_object()
        deployments = Deployment.objects.filter(cluster=cluster)
        serializer = DeploymentSerializer(deployments, many=True)
        return Response(serializer.data)


class NodeViewSet(viewsets.ModelViewSet):
    queryset = Node.objects.all()
    serializer_class = NodeSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['cluster', 'status', 'role']


class PodViewSet(viewsets.ModelViewSet):
    queryset = Pod.objects.all()
    serializer_class = PodSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['cluster', 'namespace', 'status']


class DeploymentViewSet(viewsets.ModelViewSet):
    queryset = Deployment.objects.all()
    serializer_class = DeploymentSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['cluster', 'namespace']


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['cluster', 'namespace', 'service_type']
