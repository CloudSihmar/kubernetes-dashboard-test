import json
import asyncio
import paramiko
import io
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from machines.models import Machine


class SSHConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.machine_id = self.scope['url_route']['kwargs']['machine_id']
        self.ssh_client = None
        self.ssh_channel = None
        self.read_task = None
        
        # Verify user is authenticated
        if not self.scope['user'].is_authenticated:
            await self.close()
            return
        
        await self.accept()
        
        # Get machine and establish SSH connection
        try:
            machine = await self.get_machine()
            await self.establish_ssh_connection(machine)
            
            await self.send(text_data=json.dumps({
                'type': 'connection',
                'status': 'connected',
                'message': f'Connected to {machine.name}'
            }))
            
            # Start reading from SSH channel
            self.read_task = asyncio.create_task(self.read_ssh_output())
            
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'Connection failed: {str(e)}'
            }))
            await self.close()
    
    async def disconnect(self, close_code):
        # Cancel read task
        if self.read_task:
            self.read_task.cancel()
        
        # Close SSH connection
        if self.ssh_channel:
            self.ssh_channel.close()
        if self.ssh_client:
            self.ssh_client.close()
    
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            
            if data.get('type') == 'command':
                command = data.get('data', '')
                await self.send_ssh_command(command)
            elif data.get('type') == 'resize':
                # Handle terminal resize
                cols = data.get('cols', 80)
                rows = data.get('rows', 24)
                if self.ssh_channel:
                    self.ssh_channel.resize_pty(width=cols, height=rows)
            
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': str(e)
            }))
    
    async def establish_ssh_connection(self, machine):
        """Establish SSH connection to the machine"""
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, self._connect_ssh, machine)
    
    def _connect_ssh(self, machine):
        """Synchronous SSH connection (runs in executor)"""
        self.ssh_client = paramiko.SSHClient()
        self.ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        # Get decrypted credentials
        username = machine.ssh_username
        password = machine.get_ssh_password()
        private_key_str = machine.get_ssh_private_key()
        
        # Connect using password or key
        if private_key_str:
            # Parse private key from string
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
            
            self.ssh_client.connect(
                hostname=machine.ip_address,
                port=machine.port,
                username=username,
                pkey=private_key,
                timeout=10
            )
        elif password:
            self.ssh_client.connect(
                hostname=machine.ip_address,
                port=machine.port,
                username=username,
                password=password,
                timeout=10
            )
        else:
            raise Exception("No SSH credentials configured for this machine")
        
        # Open interactive shell
        self.ssh_channel = self.ssh_client.invoke_shell(term='xterm-256color')
        self.ssh_channel.settimeout(0.1)
    
    async def send_ssh_command(self, command):
        """Send command to SSH channel"""
        if self.ssh_channel:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, self.ssh_channel.send, command.encode('utf-8'))
    
    async def read_ssh_output(self):
        """Continuously read output from SSH channel"""
        loop = asyncio.get_event_loop()
        
        while True:
            try:
                if self.ssh_channel and self.ssh_channel.recv_ready():
                    output = await loop.run_in_executor(None, self.ssh_channel.recv, 4096)
                    if output:
                        await self.send(text_data=json.dumps({
                            'type': 'output',
                            'data': output.decode('utf-8', errors='ignore')
                        }))
                
                await asyncio.sleep(0.05)  # Small delay to prevent busy loop
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': f'Read error: {str(e)}'
                }))
                break
    
    @database_sync_to_async
    def get_machine(self):
        return Machine.objects.get(id=self.machine_id)
