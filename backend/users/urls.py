from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, EncryptedCredentialViewSet, CustomTokenObtainPairView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'credentials', EncryptedCredentialViewSet, basename='credential')

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('', include(router.urls)),
]
