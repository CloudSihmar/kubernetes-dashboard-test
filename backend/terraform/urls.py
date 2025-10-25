from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TerraformWorkspaceViewSet, TerraformRunViewSet

router = DefaultRouter()
router.register(r'workspaces', TerraformWorkspaceViewSet)
router.register(r'runs', TerraformRunViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
