from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import  RegisterView, OfferViewSet

router = DefaultRouter()
router.register(r'offers', OfferViewSet, basename='offer')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
]
