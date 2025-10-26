from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClusterViewSet, NodeViewSet, PodViewSet, DeploymentViewSet, ServiceViewSet

router = DefaultRouter()
router.register(r'clusters', ClusterViewSet)
router.register(r'nodes', NodeViewSet)
router.register(r'pods', PodViewSet)
router.register(r'deployments', DeploymentViewSet)
router.register(r'services', ServiceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
