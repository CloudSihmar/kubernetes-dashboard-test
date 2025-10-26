from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
import paramiko
import socket
from .models import Machine
from .serializers import MachineSerializer, MachineCreateSerializer
from audit.utils import log_audit


class MachineViewSet(viewsets.ModelViewSet):
    queryset = Machine.objects.all()
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'os_type', 'environment']
    search_fields = ['name', 'hostname', 'ip_address', 'tags', 'application_name']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return MachineCreateSerializer
        return MachineSerializer
    
    def perform_create(self, serializer):
        machine = serializer.save(created_by=self.request.user)
        log_audit(self.request.user, 'create', 'Machine', machine.id,
                  f'Created machine: {machine.name}')
    
    def perform_update(self, serializer):
        machine = serializer.save()
        log_audit(self.request.user, 'update', 'Machine', machine.id,
                  f'Updated machine: {machine.name}')
    
    def perform_destroy(self, instance):
        log_audit(self.request.user, 'delete', 'Machine', instance.id,
                  f'Deleted machine: {instance.name}')
        instance.delete()
    
    @action(detail=True, methods=['post'])
    def test_connection(self, request, pk=None):
        """Test SSH connection to machine"""
        machine = self.get_object()
        
        try:
            # Test basic network connectivity
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(5)
            result = sock.connect_ex((machine.ip_address, machine.port))
            sock.close()
            
            if result != 0:
                machine.status = 'offline'
                machine.save()
                return Response({
                    'status': 'failed',
                    'message': f'Cannot reach {machine.ip_address}:{machine.port}'
                }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            
            # Test SSH authentication
            ssh_client = paramiko.SSHClient()
            ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            
            password = machine.get_ssh_password()
            private_key_str = machine.get_ssh_private_key()
            
            if private_key_str:
                import io
                key_file = io.StringIO(private_key_str)
                try:
                    private_key = paramiko.RSAKey.from_private_key(key_file)
                except:
                    try:
                        key_file.seek(0)
                        private_key = paramiko.Ed25519Key.from_private_key(key_file)
                    except:
                        key_file.seek(0)
                        private_key = paramiko.ECDSAKey.from_private_key(key_file)
                
                ssh_client.connect(
                    hostname=machine.ip_address,
                    port=machine.port,
                    username=machine.ssh_username,
                    pkey=private_key,
                    timeout=10
                )
            elif password:
                ssh_client.connect(
                    hostname=machine.ip_address,
                    port=machine.port,
                    username=machine.ssh_username,
                    password=password,
                    timeout=10
                )
            else:
                return Response({
                    'status': 'failed',
                    'message': 'No SSH credentials configured'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Execute test command
            stdin, stdout, stderr = ssh_client.exec_command('echo "Connection test successful"')
            output = stdout.read().decode('utf-8').strip()
            
            ssh_client.close()
            
            # Update machine status
            machine.status = 'online'
            machine.last_checked = timezone.now()
            machine.save()
            
            log_audit(request.user, 'execute', 'Machine', machine.id,
                      f'Tested connection to machine: {machine.name}')
            
            return Response({
                'status': 'success',
                'message': output
            })
            
        except Exception as e:
            machine.status = 'offline'
            machine.save()
            return Response({
                'status': 'failed',
                'message': str(e)
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
