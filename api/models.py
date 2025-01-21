from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.utils.timezone import now

CONDITION_CHOICES = (
    ('NOWY', 'Nowy'),
    ('UZYWANY', 'Używany'),
)

BODY_TYPE_CHOICES = (
    ('SEDAN', 'Sedan'),
    ('HATCHBACK', 'Hatchback'),
    ('SUV', 'SUV'),
    ('COMBI', 'Kombi'),
)

FUEL_TYPE_CHOICES = (
    ('BENZYNA', 'Benzyna'),
    ('DIESEL', 'Diesel'),
    ('HYBRYDA', 'Hybryda'),
    ('ELEKTRYCZNY', 'Elektryczny'),
)
User = get_user_model()

class Offer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    brand = models.CharField(max_length=100) 
    model = models.CharField(max_length=100)
    generation = models.CharField(max_length=100, blank=True, null=True)
    production_year = models.PositiveIntegerField(blank=True, null=True)
    
    price = models.DecimalField(max_digits=10, decimal_places=2)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='UZYWANY')
    body_type = models.CharField(max_length=20, choices=BODY_TYPE_CHOICES, blank=True, null=True)
    fuel_type = models.CharField(max_length=20, choices=FUEL_TYPE_CHOICES, blank=True, null=True)
    start_time = models.DateTimeField(default=timezone.now)
    description = models.TextField(blank=True)
    other_info = models.TextField(blank=True)
    place = models.CharField(max_length=100, blank=True, null=True)
    stripe_subscription_id = models.CharField(max_length=255, blank=True, null=True)
    active_until = models.DateTimeField(blank=True, null=True) 
    photos = ArrayField(
        base_field=models.URLField(max_length=300),
        default=list,
        blank=True,
        size=10 # max 10 links
    )

    def __str__(self):
        return f"{self.brand} {self.model} ({self.price} PLN)"
