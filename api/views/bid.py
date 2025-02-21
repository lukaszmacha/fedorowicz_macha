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
                {"error": "Bid amount is invalid."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            offer = Offer.objects.get(id=offer_id)
        except Offer.DoesNotExist:
            return Response(
                {"error": "Offer not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        now_time = timezone.now()
        if now_time < offer.start_time:
            return Response(
                {"error": "Auction has not started yet."},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            auction = offer.auction

            if not auction.has_started and not auction.auction_end_time:
                required_minimum = offer.price + Decimal('100.00')
                if bid_amount < required_minimum:
                    return Response(
                        {"error": "Bid must be at least 100 USD or higher than starting price."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                auction.current_price = bid_amount
                auction.current_winner = request.user
                auction.auction_end_time = now_time + timedelta(seconds=60)
                auction.has_started = True
                auction.save()
                Bid.objects.create(auction=auction, user=request.user, bid_price=bid_amount)
            else:
                if now_time > auction.auction_end_time:
                    auction.save()
                    return Response(
                        {"error": "Auction has ended."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                required_minimum = auction.current_price + Decimal('100.00')
                if bid_amount < required_minimum:
                    return Response(
                        {"error": "Bid must be at least 100 USD or higher than current price."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                auction.current_price = bid_amount
                auction.current_winner = request.user
                if auction.auction_end_time + timedelta(seconds=10) > now_time + timedelta(minutes=1):
                    auction.auction_end_time = now_time + timedelta(minutes=1)
                else:
                    auction.auction_end_time += timedelta(seconds=10)
                auction.save()
                Bid.objects.create(auction=auction, user=request.user, bid_price=bid_amount)

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
