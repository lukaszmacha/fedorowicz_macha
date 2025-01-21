from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import Offer

class OfferListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = [
            'id',
            'brand',
            'model',
            'description',
            'price',
            'start_time',
            'photos',
        ]

class OfferDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = [
            'id',
            'brand',
            'model',
            'generation',
            'production_year',
            'price',
            'condition',
            'body_type',
            'fuel_type',
            'start_time',
            'description',
            'other_info',
            'place',
            'photos',
        ]


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = [  'id',
            'brand',
            'model',
            'generation',
            'production_year',
            'price',
            'condition',
            'body_type',
            'fuel_type',
            'start_time',
            'description',
            'other_info',
            'place',
            'photos',
            'active_until']
        read_only_fields = ['active_until']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user
