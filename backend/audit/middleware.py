from .models import AuditLog


class AuditMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # Log API requests
        if request.path.startswith('/api/') and request.user.is_authenticated:
            action = self._get_action_from_method(request.method)
            if action:
                self._create_audit_log(request, response, action)
        
        return response
    
    def _get_action_from_method(self, method):
        method_map = {
            'POST': 'create',
            'GET': 'read',
            'PUT': 'update',
            'PATCH': 'update',
            'DELETE': 'delete',
        }
        return method_map.get(method)
    
    def _create_audit_log(self, request, response, action):
        try:
            resource_type = request.path.split('/')[2] if len(request.path.split('/')) > 2 else 'unknown'
            
            AuditLog.objects.create(
                user=request.user,
                action=action,
                resource_type=resource_type,
                description=f"{action.title()} {resource_type}",
                ip_address=self._get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                response_status=response.status_code
            )
        except Exception:
            pass  # Don't break the request if audit logging fails
    
    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')
