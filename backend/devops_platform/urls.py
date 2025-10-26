from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/auth/', include('users.urls')),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/audit/', include('audit.urls')),
    path('api/kubernetes/', include('k8s_management.urls')),
    path('api/machines/', include('machines.urls')),
    path('api/dashboards/', include('dashboards.urls')),
    path('api/automation/', include('automation.urls')),
    path('api/terraform/', include('terraform.urls')),
]
