import tempfile
import os
from kubernetes import client, config
from kubernetes.client.rest import ApiException
from typing import Dict, List, Optional
from .models import Cluster


class KubernetesClient:
    """Wrapper for Kubernetes Python client"""
    
    def __init__(self, cluster: Cluster):
        self.cluster = cluster
        self.api_client = None
        self.core_v1 = None
        self.apps_v1 = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize Kubernetes client with cluster kubeconfig"""
        try:
            kubeconfig_content = self.cluster.get_kubeconfig()
            
            # Write kubeconfig to temporary file
            with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.yaml') as f:
                f.write(kubeconfig_content)
                kubeconfig_path = f.name
            
            # Load kubeconfig
            config.load_kube_config(config_file=kubeconfig_path)
            
            # Initialize API clients
            self.api_client = client.ApiClient()
            self.core_v1 = client.CoreV1Api(self.api_client)
            self.apps_v1 = client.AppsV1Api(self.api_client)
            
            # Clean up temp file
            os.unlink(kubeconfig_path)
            
        except Exception as e:
            raise Exception(f"Failed to initialize Kubernetes client: {str(e)}")
    
    def get_cluster_version(self) -> str:
        """Get Kubernetes cluster version"""
        try:
            version_api = client.VersionApi(self.api_client)
            version_info = version_api.get_code()
            return f"v{version_info.major}.{version_info.minor}"
        except ApiException as e:
            raise Exception(f"Failed to get cluster version: {str(e)}")
    
    def list_nodes(self) -> List[Dict]:
        """List all nodes in the cluster"""
        try:
            nodes = self.core_v1.list_node()
            node_list = []
            
            for node in nodes.items:
                # Get node status
                conditions = {c.type: c.status for c in node.status.conditions}
                is_ready = conditions.get('Ready', 'Unknown') == 'True'
                
                # Get node role
                labels = node.metadata.labels or {}
                role = 'worker'
                if 'node-role.kubernetes.io/master' in labels or 'node-role.kubernetes.io/control-plane' in labels:
                    role = 'master'
                
                # Get resource capacity and usage
                capacity = node.status.capacity
                allocatable = node.status.allocatable
                
                node_list.append({
                    'name': node.metadata.name,
                    'status': 'ready' if is_ready else 'not_ready',
                    'role': role,
                    'version': node.status.node_info.kubelet_version,
                    'os': node.status.node_info.os_image,
                    'cpu_capacity': capacity.get('cpu', '0'),
                    'memory_capacity': capacity.get('memory', '0'),
                    'cpu_allocatable': allocatable.get('cpu', '0'),
                    'memory_allocatable': allocatable.get('memory', '0'),
                    'created_at': node.metadata.creation_timestamp,
                })
            
            return node_list
        except ApiException as e:
            raise Exception(f"Failed to list nodes: {str(e)}")
    
    def list_pods(self, namespace: Optional[str] = None) -> List[Dict]:
        """List pods in cluster or specific namespace"""
        try:
            if namespace:
                pods = self.core_v1.list_namespaced_pod(namespace)
            else:
                pods = self.core_v1.list_pod_for_all_namespaces()
            
            pod_list = []
            for pod in pods.items:
                # Get pod status
                phase = pod.status.phase.lower()
                
                # Count containers
                containers = len(pod.spec.containers)
                ready_containers = sum(1 for c in pod.status.container_statuses or [] if c.ready)
                
                pod_list.append({
                    'name': pod.metadata.name,
                    'namespace': pod.metadata.namespace,
                    'status': phase,
                    'node': pod.spec.node_name,
                    'containers': f"{ready_containers}/{containers}",
                    'restarts': sum(c.restart_count for c in pod.status.container_statuses or []),
                    'age': pod.metadata.creation_timestamp,
                    'ip': pod.status.pod_ip,
                })
            
            return pod_list
        except ApiException as e:
            raise Exception(f"Failed to list pods: {str(e)}")
    
    def list_deployments(self, namespace: Optional[str] = None) -> List[Dict]:
        """List deployments in cluster or specific namespace"""
        try:
            if namespace:
                deployments = self.apps_v1.list_namespaced_deployment(namespace)
            else:
                deployments = self.apps_v1.list_deployment_for_all_namespaces()
            
            deployment_list = []
            for deployment in deployments.items:
                deployment_list.append({
                    'name': deployment.metadata.name,
                    'namespace': deployment.metadata.namespace,
                    'replicas': deployment.spec.replicas,
                    'ready_replicas': deployment.status.ready_replicas or 0,
                    'available_replicas': deployment.status.available_replicas or 0,
                    'updated_replicas': deployment.status.updated_replicas or 0,
                    'created_at': deployment.metadata.creation_timestamp,
                })
            
            return deployment_list
        except ApiException as e:
            raise Exception(f"Failed to list deployments: {str(e)}")
    
    def list_services(self, namespace: Optional[str] = None) -> List[Dict]:
        """List services in cluster or specific namespace"""
        try:
            if namespace:
                services = self.core_v1.list_namespaced_service(namespace)
            else:
                services = self.core_v1.list_service_for_all_namespaces()
            
            service_list = []
            for service in services.items:
                service_list.append({
                    'name': service.metadata.name,
                    'namespace': service.metadata.namespace,
                    'type': service.spec.type,
                    'cluster_ip': service.spec.cluster_ip,
                    'external_ip': ','.join(service.status.load_balancer.ingress or []) if service.status.load_balancer else None,
                    'ports': [f"{p.port}/{p.protocol}" for p in service.spec.ports or []],
                    'created_at': service.metadata.creation_timestamp,
                })
            
            return service_list
        except ApiException as e:
            raise Exception(f"Failed to list services: {str(e)}")
    
    def get_cluster_metrics(self) -> Dict:
        """Get cluster-level metrics"""
        try:
            nodes = self.core_v1.list_node()
            pods = self.core_v1.list_pod_for_all_namespaces()
            namespaces = self.core_v1.list_namespace()
            
            return {
                'node_count': len(nodes.items),
                'pod_count': len(pods.items),
                'namespace_count': len(namespaces.items),
                'running_pods': sum(1 for p in pods.items if p.status.phase == 'Running'),
                'pending_pods': sum(1 for p in pods.items if p.status.phase == 'Pending'),
                'failed_pods': sum(1 for p in pods.items if p.status.phase == 'Failed'),
            }
        except ApiException as e:
            raise Exception(f"Failed to get cluster metrics: {str(e)}")
    
    def test_connection(self) -> bool:
        """Test connection to Kubernetes cluster"""
        try:
            self.core_v1.list_namespace(limit=1)
            return True
        except Exception:
            return False
