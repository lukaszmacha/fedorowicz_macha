# Generated by Django 5.1.5 on 2025-01-16 18:38

import django.contrib.postgres.fields
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Offer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('brand', models.CharField(max_length=100)),
                ('model', models.CharField(max_length=100)),
                ('generation', models.CharField(blank=True, max_length=100, null=True)),
                ('production_year', models.PositiveIntegerField(blank=True, null=True)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('condition', models.CharField(choices=[('NOWY', 'Nowy'), ('UZYWANY', 'Używany')], default='UZYWANY', max_length=20)),
                ('body_type', models.CharField(blank=True, choices=[('SEDAN', 'Sedan'), ('HATCHBACK', 'Hatchback'), ('SUV', 'SUV'), ('COMBI', 'Kombi')], max_length=20, null=True)),
                ('fuel_type', models.CharField(blank=True, choices=[('BENZYNA', 'Benzyna'), ('DIESEL', 'Diesel'), ('HYBRYDA', 'Hybryda'), ('ELEKTRYCZNY', 'Elektryczny')], max_length=20, null=True)),
                ('start_time', models.DateTimeField(default=django.utils.timezone.now)),
                ('description', models.TextField(blank=True)),
                ('other_info', models.TextField(blank=True)),
                ('place', models.CharField(blank=True, max_length=100, null=True)),
                ('stripe_subscription_id', models.CharField(blank=True, max_length=255, null=True)),
                ('active_until', models.DateTimeField(blank=True, null=True)),
                ('photos', django.contrib.postgres.fields.ArrayField(base_field=models.URLField(max_length=300), blank=True, default=list, size=10)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
