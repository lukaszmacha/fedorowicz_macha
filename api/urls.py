from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import  RegisterView, OfferViewSet, CreateOfferView, stripe_webhook, DeleteOfferView

router = DefaultRouter()
router.register(r'offers', OfferViewSet, basename='offer')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path("offer/create/", CreateOfferView.as_view(), name="create-offer"),
    path('stripe/webhook/', stripe_webhook, name='stripe-webhook'),
    path("offer/<int:pk>/", DeleteOfferView.as_view(), name="delete-offer"),
]
