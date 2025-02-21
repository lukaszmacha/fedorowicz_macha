import django_filters
from api.models import Offer

class OfferFilter(django_filters.FilterSet):
    price_from = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_to = django_filters.NumberFilter(field_name='price', lookup_expr='lte')

    year_from = django_filters.NumberFilter(field_name='production_year', lookup_expr='gte')
    year_to = django_filters.NumberFilter(field_name='production_year', lookup_expr='lte')

    brand = django_filters.CharFilter(field_name='brand', lookup_expr='icontains')
    model = django_filters.CharFilter(field_name='model', lookup_expr='icontains')
    condition = django_filters.CharFilter(field_name='condition', lookup_expr='iexact')
    body_type = django_filters.CharFilter(field_name='body_type', lookup_expr='iexact')
    fuel_type = django_filters.CharFilter(field_name='fuel_type', lookup_expr='iexact')

    class Meta:
        model = Offer
        fields = []
