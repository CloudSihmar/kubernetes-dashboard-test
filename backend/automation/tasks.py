from celery import shared_task
from django.utils import timezone
import subprocess
import tempfile
import os
from .models import AnsiblePlaybook, PlaybookExecution


@shared_task
def execute_ansible_playbook(execution_id):
    """Execute Ansible playbook asynchronously"""
    try:
        execution = PlaybookExecution.objects.get(id=execution_id)
        playbook = execution.playbook
        
        execution.status = 'RUNNING'
        execution.save()
        
        # Create temporary directory for playbook execution
        with tempfile.TemporaryDirectory() as tmpdir:
            # Write playbook content to file
            playbook_path = os.path.join(tmpdir, 'playbook.yml')
            with open(playbook_path, 'w') as f:
                f.write(playbook.playbook_content)
            
            # Write inventory if provided
            inventory_path = os.path.join(tmpdir, 'inventory.ini')
            if playbook.inventory_content:
                with open(inventory_path, 'w') as f:
                    f.write(playbook.inventory_content)
            else:
                # Create inventory from target hosts
                with open(inventory_path, 'w') as f:
                    f.write('[targets]\n')
                    for host in execution.target_hosts:
                        f.write(f"{host}\n")
            
            # Build ansible-playbook command
            cmd = [
                'ansible-playbook',
                playbook_path,
                '-i', inventory_path,
            ]
            
            # Add extra vars
            if execution.variables:
                import json
                cmd.extend(['--extra-vars', json.dumps(execution.variables)])
            
            if playbook.become:
                cmd.append('--become')
            
            if playbook.check_mode:
                cmd.append('--check')
            
            # Execute playbook
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=playbook.timeout
            )
            
            # Update execution with results
            execution.output = result.stdout
            execution.error_output = result.stderr
            execution.return_code = result.returncode
            execution.status = 'SUCCESS' if result.returncode == 0 else 'FAILED'
            execution.completed_at = timezone.now()
            execution.duration = (execution.completed_at - execution.started_at).seconds
            execution.save()
            
            # Update playbook stats
            playbook.execution_count += 1
            playbook.last_executed = timezone.now()
            playbook.save()
            
    except Exception as e:
        execution.status = 'FAILED'
        execution.error_output = str(e)
        execution.completed_at = timezone.now()
        execution.save()
