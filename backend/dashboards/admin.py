from django.contrib import admin
from .models import Dashboard, DashboardIntegration


@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'name', 'category', 'created_at']
    list_filter = ['category']
    search_fields = ['name', 'display_name', 'description']


@admin.register(DashboardIntegration)
class DashboardIntegrationAdmin(admin.ModelAdmin):
    list_display = ['dashboard', 'cluster', 'status', 'url', 'created_at']
    list_filter = ['status', 'dashboard__category']
    search_fields = ['dashboard__name', 'cluster__name', 'url']
    readonly_fields = ['created_at', 'updated_at', 'last_accessed']
