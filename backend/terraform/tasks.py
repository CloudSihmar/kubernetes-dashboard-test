from celery import shared_task
from django.utils import timezone
import subprocess
import tempfile
import os
import re
from .models import TerraformWorkspace, TerraformRun


@shared_task
def execute_terraform_run(run_id):
    """Execute Terraform run asynchronously"""
    try:
        run = TerraformRun.objects.get(id=run_id)
        workspace = run.workspace
        
        run.status = 'RUNNING'
        run.save()
        
        # Create temporary directory for terraform execution
        with tempfile.TemporaryDirectory() as tmpdir:
            # Write terraform code to file
            tf_path = os.path.join(tmpdir, 'main.tf')
            with open(tf_path, 'w') as f:
                f.write(workspace.terraform_code)
            
            # Write variables file
            if workspace.variables:
                import json
                vars_path = os.path.join(tmpdir, 'terraform.tfvars.json')
                with open(vars_path, 'w') as f:
                    json.dump(workspace.variables, f)
            
            # Initialize terraform
            init_result = subprocess.run(
                ['terraform', 'init'],
                cwd=tmpdir,
                capture_output=True,
                text=True
            )
            
            if init_result.returncode != 0:
                raise Exception(f"Terraform init failed: {init_result.stderr}")
            
            # Execute based on run type
            if run.run_type == 'PLAN':
                result = subprocess.run(
                    ['terraform', 'plan', '-no-color'],
                    cwd=tmpdir,
                    capture_output=True,
                    text=True
                )
                run.plan_output = result.stdout
                
                # Parse plan output for resource changes
                plan_text = result.stdout
                add_match = re.search(r'(\d+) to add', plan_text)
                change_match = re.search(r'(\d+) to change', plan_text)
                destroy_match = re.search(r'(\d+) to destroy', plan_text)
                
                run.resources_to_add = int(add_match.group(1)) if add_match else 0
                run.resources_to_change = int(change_match.group(1)) if change_match else 0
                run.resources_to_destroy = int(destroy_match.group(1)) if destroy_match else 0
                
            elif run.run_type == 'APPLY':
                result = subprocess.run(
                    ['terraform', 'apply', '-auto-approve', '-no-color'],
                    cwd=tmpdir,
                    capture_output=True,
                    text=True
                )
                workspace.last_apply_status = 'SUCCESS' if result.returncode == 0 else 'FAILED'
                
            elif run.run_type == 'DESTROY':
                result = subprocess.run(
                    ['terraform', 'destroy', '-auto-approve', '-no-color'],
                    cwd=tmpdir,
                    capture_output=True,
                    text=True
                )
            
            # Update run with results
            run.output = result.stdout
            run.error_output = result.stderr
            run.return_code = result.returncode
            run.status = 'SUCCESS' if result.returncode == 0 else 'FAILED'
            run.completed_at = timezone.now()
            run.duration = (run.completed_at - run.started_at).seconds
            run.save()
            
            # Update workspace
            workspace.last_run_at = timezone.now()
            workspace.save()
            
    except Exception as e:
        run.status = 'FAILED'
        run.error_output = str(e)
        run.completed_at = timezone.now()
        run.save()
