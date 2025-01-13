from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend

from api.models import Offer
from api.serializers import OfferListSerializer, OfferDetailSerializer
from api.filters import OfferFilter
from api.views_permissions import ReadOnly
from api.utils.pagination import OfferPagination

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
