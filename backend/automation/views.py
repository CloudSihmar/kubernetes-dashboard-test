from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import AnsiblePlaybook, PlaybookExecution
from .serializers import (AnsiblePlaybookSerializer, PlaybookExecutionSerializer,
                          PlaybookExecutionCreateSerializer)
from audit.utils import log_audit


class AnsiblePlaybookViewSet(viewsets.ModelViewSet):
    queryset = AnsiblePlaybook.objects.all()
    serializer_class = AnsiblePlaybookSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['category']
    search_fields = ['name', 'description', 'tags']
    
    def perform_create(self, serializer):
        playbook = serializer.save(created_by=self.request.user)
        log_audit(self.request.user, 'CREATE', 'AnsiblePlaybook', playbook.id,
                  f'Created playbook: {playbook.name}')
    
    def perform_update(self, serializer):
        playbook = serializer.save()
        log_audit(self.request.user, 'UPDATE', 'AnsiblePlaybook', playbook.id,
                  f'Updated playbook: {playbook.name}')
    
    def perform_destroy(self, instance):
        log_audit(self.request.user, 'DELETE', 'AnsiblePlaybook', instance.id,
                  f'Deleted playbook: {instance.name}')
        instance.delete()
    
    @action(detail=True, methods=['post'])
    def execute(self, request, pk=None):
        """Execute Ansible playbook"""
        playbook = self.get_object()
        target_hosts = request.data.get('target_hosts', [])
        
        execution = PlaybookExecution.objects.create(
            playbook=playbook,
            executed_by=request.user,
            target_hosts=target_hosts,
            status='PENDING'
        )
        
        # TODO: Queue Celery task to execute playbook
        log_audit(request.user, 'EXECUTE', 'AnsiblePlaybook', playbook.id,
                  f'Executed playbook: {playbook.name}')
        
        return Response(PlaybookExecutionSerializer(execution).data)


class PlaybookExecutionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PlaybookExecution.objects.all()
    serializer_class = PlaybookExecutionSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['playbook', 'status', 'executed_by']
    ordering = ['-started_at']
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel running playbook execution"""
        execution = self.get_object()
        if execution.status in ['PENDING', 'RUNNING']:
            execution.status = 'CANCELLED'
            execution.save()
            log_audit(request.user, 'CANCEL', 'PlaybookExecution', execution.id,
                      f'Cancelled execution: {execution.id}')
            return Response({'status': 'cancelled'})
        return Response({'error': 'Cannot cancel completed execution'}, 
                        status=status.HTTP_400_BAD_REQUEST)
