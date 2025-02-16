from datetime import timedelta
from decimal import Decimal
from django.utils import timezone
from django.db import transaction
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from api.models import Offer, Auction, Bid

class PlaceBidView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, offer_id):
        bid_amount = request.data.get('bid_amount')
        try:
            bid_amount = Decimal(bid_amount)
        except Exception:
            return Response(
                {"error": "Kwota bidu jest nieprawidłowa."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Pobierz ofertę
        try:
            offer = Offer.objects.get(id=offer_id)
        except Offer.DoesNotExist:
            return Response(
                {"error": "Oferta nie znaleziona."},
                status=status.HTTP_404_NOT_FOUND
            )

        now_time = timezone.now()
        if now_time < offer.start_time:
            return Response(
                {"error": "Aukcja jeszcze się nie rozpoczęła."},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            # Pobieramy istniejącą aukcję – ona powinna być już utworzona
            auction = offer.auction

            # Jeśli aukcja jeszcze nie wystartowała (pierwszy bid)
            if not auction.has_started and not auction.auction_end_time:
                required_minimum = offer.price + Decimal('100.00')
                if bid_amount < required_minimum:
                    return Response(
                        {"error": "Kwota bidu musi być większa od ceny wywoławczej o co najmniej 100 zł."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                # Rozpoczynamy aukcję
                auction.current_price = bid_amount
                auction.current_winner = request.user
                auction.auction_end_time = now_time + timedelta(seconds=60)
                auction.has_started = True
                auction.save()
                Bid.objects.create(auction=auction, user=request.user, bid_price=bid_amount)
            else:
                # Aukcja już wystartowała – sprawdzamy, czy nie upłynął czas
                if now_time > auction.auction_end_time:
                    # Możesz tutaj również zakończyć aukcję
                    auction.save()
                    return Response(
                        {"error": "Aukcja się zakończyła."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                required_minimum = auction.current_price + Decimal('100.00')
                if bid_amount < required_minimum:
                    return Response(
                        {"error": "Kwota bidu musi być większa od aktualnej ceny o co najmniej 100 zł."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                auction.current_price = bid_amount
                auction.current_winner = request.user
                auction.auction_end_time = now_time + timedelta(seconds=10)
                auction.save()
                Bid.objects.create(auction=auction, user=request.user, bid_price=bid_amount)

        # Wysyłamy aktualizację przez WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'auction_{auction.id}',
            {
                'type': 'auction_update',
                'data': {
                    'current_price': str(auction.current_price),
                    'auction_end_time': auction.auction_end_time.isoformat() if auction.auction_end_time else None,
                    'current_winner': request.user.username,
                    'has_started': auction.has_started,
                }
            }
        )

        return Response({
            "message": "Bid zaakceptowany.",
            "current_price": str(auction.current_price),
            "auction_end_time": auction.auction_end_time
        }, status=status.HTTP_200_OK)
