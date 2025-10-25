from django.contrib import admin
from .models import Machine


@admin.register(Machine)
class MachineAdmin(admin.ModelAdmin):
    list_display = ['name', 'hostname', 'ip_address', 'status', 'os_type', 'created_at']
    list_filter = ['status', 'os_type', 'environment']
    search_fields = ['name', 'hostname', 'ip_address', 'application_name']
    readonly_fields = ['created_at', 'updated_at', 'last_checked']
