from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import CarViewSet, RegisterView

router = DefaultRouter()
router.register(r'cars', CarViewSet, basename='car')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
]
