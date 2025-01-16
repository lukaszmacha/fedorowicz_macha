import django_filters
from api.models import Offer

class OfferFilter(django_filters.FilterSet):
    cena_od = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    cena_do = django_filters.NumberFilter(field_name='price', lookup_expr='lte')

    rok_produkcji_od = django_filters.NumberFilter(field_name='production_year', lookup_expr='gte')
    rok_produkcji_do = django_filters.NumberFilter(field_name='production_year', lookup_expr='lte')

    marka = django_filters.CharFilter(field_name='brand', lookup_expr='icontains')
    model = django_filters.CharFilter(field_name='model', lookup_expr='icontains')
    stan = django_filters.CharFilter(field_name='condition', lookup_expr='iexact')
    typ_nadwozia = django_filters.CharFilter(field_name='body_type', lookup_expr='iexact')
    rodzaj_paliwa = django_filters.CharFilter(field_name='fuel_type', lookup_expr='iexact')

    class Meta:
        model = Offer
        fields = []
