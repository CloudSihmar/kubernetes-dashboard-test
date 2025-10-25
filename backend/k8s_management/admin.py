from django.contrib import admin
from .models import Cluster, Node, Pod, Deployment, Service


@admin.register(Cluster)
class ClusterAdmin(admin.ModelAdmin):
    list_display = ['name', 'environment', 'provider', 'status', 'version', 'node_count', 'pod_count']
    list_filter = ['status', 'environment', 'provider']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at', 'last_synced']


@admin.register(Node)
class NodeAdmin(admin.ModelAdmin):
    list_display = ['name', 'cluster', 'status', 'role', 'cpu_capacity', 'memory_capacity']
    list_filter = ['status', 'role', 'cluster']
    search_fields = ['name', 'cluster__name']


@admin.register(Pod)
class PodAdmin(admin.ModelAdmin):
    list_display = ['name', 'cluster', 'namespace', 'status', 'node', 'restarts']
    list_filter = ['status', 'namespace', 'cluster']
    search_fields = ['name', 'namespace', 'cluster__name']


@admin.register(Deployment)
class DeploymentAdmin(admin.ModelAdmin):
    list_display = ['name', 'cluster', 'namespace', 'replicas', 'ready_replicas', 'available_replicas']
    list_filter = ['cluster', 'namespace']
    search_fields = ['name', 'namespace', 'cluster__name']


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'cluster', 'namespace', 'service_type', 'cluster_ip']
    list_filter = ['service_type', 'cluster', 'namespace']
    search_fields = ['name', 'namespace', 'cluster__name']
