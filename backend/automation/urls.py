from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnsiblePlaybookViewSet, PlaybookExecutionViewSet

router = DefaultRouter()
router.register(r'playbooks', AnsiblePlaybookViewSet)
router.register(r'executions', PlaybookExecutionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
