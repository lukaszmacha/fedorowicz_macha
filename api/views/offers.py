from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.timezone import now
from django.conf import settings
import stripe
from django.core.files.storage import default_storage
import os
from uuid import uuid4
from datetime import datetime

from api.models import Offer, Auction
from api.serializers import OfferListSerializer, OfferDetailSerializer, OfferSerializer
from api.filters import OfferFilter
from api.views_permissions import ReadOnly
from api.utils.pagination import OfferPagination

stripe.api_key = settings.STRIPE_SECRET_KEY

class OfferViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet tylko do odczytu:
    - list (GET /offers/)
    - retrieve (GET /offers/<id>/)
    """
    queryset = Offer.objects.all()
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = OfferFilter
    pagination_class = OfferPagination

    def get_serializer_class(self):
        if self.action == 'list':
            return OfferListSerializer
        if self.action == 'retrieve':
            return OfferDetailSerializer
        return OfferDetailSerializer
    
    def get_queryset(self):
        """Returns only active offers."""
        return Offer.objects.filter(active_until__isnull=False).filter(active_until__gt=now())

    def get_serializer_context(self):
        context = super().get_serializer_context()
        return context

class CreateOfferView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        try:
            # Get the photos from request.FILES
            photos = request.FILES.getlist('photos')
            photo_urls = []
            
            # Handle photo uploads first
            for photo in photos:
                # Generate unique filename using timestamp and UUID
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                unique_id = str(uuid4())[:8]  # First 8 chars of UUID
                original_name = os.path.splitext(photo.name)[0]  # Get name without extension
                extension = os.path.splitext(photo.name)[1]  # Get file extension
                filename = f"{request.user.id}_{timestamp}_{unique_id}_{original_name}{extension}"
                # Save file and get URL
                file_path = default_storage.save(f'offers/{filename}', photo)
                full_url = request.build_absolute_uri(default_storage.url(file_path))
                full_url = full_url.replace('localhost', 'localhost:1331')
                photo_urls.append(full_url)
            
            # Create new data dictionary instead of copying request.data
            data = {}
            for key in request.data:
                if key != 'photos':  # Skip the photos field
                    data[key] = request.data[key]
            
            # Add the photo URLs to the data
            data['photos'] = photo_urls

            serializer = OfferSerializer(data=data)
            if serializer.is_valid():
                offer = serializer.save(user=request.user)
                Auction.objects.create(
                    offer=offer,
                    current_price=offer.price,
                    has_started=False,
                    auction_end_time=None
                )  
                payment_link = stripe.PaymentLink.create(
                    line_items=[
                        {"price": "price_1QjdWiP4Lupois9HdZ9rAASr", "quantity": 1}
                    ],
                    metadata={"offer_id": offer.pk},
                    after_completion={
                        "type": "redirect",
                        "redirect": {"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
                    }
                )

                return Response({"id": offer.id, "payment_link": payment_link}, status=201)

            else:
                print("Serializer errors:", serializer.errors)
                return Response(serializer.errors, status=400)

        except Exception as e:
            print(f"Error creating offer: {str(e)}")
            return Response(
                {"error": "Failed to create offer"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DeleteOfferView(APIView):
    """
    DELETE /offers/<id>/
    - Cancels Stripe subscription (if any).
    - Sets active_until = timezone.now(), the offer is no longer active.
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            offer = Offer.objects.get(pk=pk, user=request.user)
        except Offer.DoesNotExist:
            return Response({"error": "Offer not found or not authorized."}, status=status.HTTP_404_NOT_FOUND)

        if offer.stripe_subscription_id:
            try:
                stripe.Subscription.delete(offer.stripe_subscription_id)
            except stripe.error.StripeError as e:
                return Response({"error": f"Failed to cancel subscription in Stripe: {str(e)}"},
                                status=status.HTTP_400_BAD_REQUEST)
        offer.active_until = now()
        offer.save()

        return Response({"message": "Offer was deactivated and subscription canceled (if any)."},
                        status=status.HTTP_200_OK)
