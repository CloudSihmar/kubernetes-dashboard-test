from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DashboardViewSet, DashboardIntegrationViewSet

router = DefaultRouter()
router.register(r'dashboards', DashboardViewSet)
router.register(r'integrations', DashboardIntegrationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
