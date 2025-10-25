from .models import AuditLog


def log_audit(user, action, resource_type, resource_id, details=''):
    """
    Helper function to create audit log entries
    
    Args:
        user: User object who performed the action
        action: Action type (CREATE, UPDATE, DELETE, etc.)
        resource_type: Type of resource (Cluster, Machine, etc.)
        resource_id: ID of the resource
        details: Additional details about the action
    """
    return AuditLog.objects.create(
        user=user,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        ip_address=getattr(user, 'last_ip', ''),
        user_agent=getattr(user, 'last_user_agent', ''),
        details=details
    )
