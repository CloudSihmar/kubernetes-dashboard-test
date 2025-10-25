from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/ssh/<int:machine_id>/', consumers.SSHConsumer.as_asgi()),
]
