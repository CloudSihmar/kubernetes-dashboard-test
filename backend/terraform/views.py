from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import TerraformWorkspace, TerraformRun
from .serializers import (TerraformWorkspaceSerializer, TerraformRunSerializer,
                          TerraformRunCreateSerializer)
from audit.utils import log_audit
from .tasks import execute_terraform_run


class TerraformWorkspaceViewSet(viewsets.ModelViewSet):
    queryset = TerraformWorkspace.objects.all()
    serializer_class = TerraformWorkspaceSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['environment', 'provider']
    search_fields = ['name', 'description']
    
    def perform_create(self, serializer):
        workspace = serializer.save(created_by=self.request.user)
        log_audit(self.request.user, 'CREATE', 'TerraformWorkspace', workspace.id,
                  f'Created workspace: {workspace.name}')
    
    def perform_update(self, serializer):
        workspace = serializer.save()
        log_audit(self.request.user, 'UPDATE', 'TerraformWorkspace', workspace.id,
                  f'Updated workspace: {workspace.name}')
    
    def perform_destroy(self, instance):
        log_audit(self.request.user, 'DELETE', 'TerraformWorkspace', instance.id,
                  f'Deleted workspace: {instance.name}')
        instance.delete()
    
    @action(detail=True, methods=['post'])
    def plan(self, request, pk=None):
        """Run terraform plan"""
        workspace = self.get_object()
        
        run = TerraformRun.objects.create(
            workspace=workspace,
            run_type='PLAN',
            triggered_by=request.user,
            status='PENDING'
        )
        
        task = execute_terraform_run.delay(run.id)
        run.task_id = task.id
        run.save()
        
        log_audit(request.user, 'PLAN', 'TerraformWorkspace', workspace.id,
                  f'Planned workspace: {workspace.name}')
        
        return Response(TerraformRunSerializer(run).data)
    
    @action(detail=True, methods=['post'])
    def apply(self, request, pk=None):
        """Run terraform apply"""
        workspace = self.get_object()
        
        run = TerraformRun.objects.create(
            workspace=workspace,
            run_type='APPLY',
            triggered_by=request.user,
            status='PENDING'
        )
        
        task = execute_terraform_run.delay(run.id)
        run.task_id = task.id
        run.save()
        
        log_audit(request.user, 'APPLY', 'TerraformWorkspace', workspace.id,
                  f'Applied workspace: {workspace.name}')
        
        return Response(TerraformRunSerializer(run).data)
    
    @action(detail=True, methods=['post'])
    def destroy_infrastructure(self, request, pk=None):
        """Run terraform destroy"""
        workspace = self.get_object()
        
        run = TerraformRun.objects.create(
            workspace=workspace,
            run_type='DESTROY',
            triggered_by=request.user,
            status='PENDING'
        )
        
        task = execute_terraform_run.delay(run.id)
        run.task_id = task.id
        run.save()
        
        log_audit(request.user, 'DESTROY', 'TerraformWorkspace', workspace.id,
                  f'Destroyed workspace: {workspace.name}')
        
        return Response(TerraformRunSerializer(run).data)


class TerraformRunViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TerraformRun.objects.all()
    serializer_class = TerraformRunSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['workspace', 'run_type', 'status', 'triggered_by']
    ordering = ['-started_at']
