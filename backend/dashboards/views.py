from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Dashboard, DashboardIntegration
from .serializers import (DashboardSerializer, DashboardIntegrationSerializer,
                          DashboardIntegrationCreateSerializer)
from audit.utils import log_audit


class DashboardViewSet(viewsets.ModelViewSet):
    queryset = Dashboard.objects.all()
    serializer_class = DashboardSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['category']
    search_fields = ['name', 'description']


class DashboardIntegrationViewSet(viewsets.ModelViewSet):
    queryset = DashboardIntegration.objects.all()
    permission_classes = [IsAuthenticated]
    filterset_fields = ['dashboard', 'cluster', 'status']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return DashboardIntegrationCreateSerializer
        return DashboardIntegrationSerializer
    
    def perform_create(self, serializer):
        integration = serializer.save(created_by=self.request.user)
        log_audit(self.request.user, 'CREATE', 'DashboardIntegration', integration.id,
                  f'Created dashboard integration: {integration.dashboard.name}')
    
    def perform_update(self, serializer):
        integration = serializer.save()
        log_audit(self.request.user, 'UPDATE', 'DashboardIntegration', integration.id,
                  f'Updated dashboard integration: {integration.dashboard.name}')
    
    def perform_destroy(self, instance):
        log_audit(self.request.user, 'DELETE', 'DashboardIntegration', instance.id,
                  f'Deleted dashboard integration: {instance.dashboard.name}')
        instance.delete()
    
    @action(detail=True, methods=['post'])
    def test_connection(self, request, pk=None):
        """Test connection to dashboard"""
        integration = self.get_object()
        # TODO: Implement connection test
        log_audit(request.user, 'TEST', 'DashboardIntegration', integration.id,
                  f'Tested connection to: {integration.dashboard.name}')
        return Response({'status': 'connected'})
    
    @action(detail=True, methods=['post'])
    def generate_login_token(self, request, pk=None):
        """Generate auto-login token for dashboard"""
        integration = self.get_object()
        # TODO: Implement token generation
        return Response({'token': 'sample-token', 'expires_in': 3600})
