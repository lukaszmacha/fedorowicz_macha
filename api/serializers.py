from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import Offer
from api.models import Auction, Bid

class AuctionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auction
        fields = ['offer', 'current_price', 'current_winner', 'auction_end_time', 'active', 'created_at']

class AuctionInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auction
        fields = ['id', 'current_price', 'auction_end_time', 'has_started', 'current_winner']

class BidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bid
        fields = ['auction', 'user', 'bid_price', 'bid_time']
        read_only_fields = ['user', 'bid_time']

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
    is_owner = serializers.SerializerMethodField()
    auction = AuctionInfoSerializer(read_only=True)

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
            'auction',
            'description',
            'other_info',
            'place',
            'photos',
            'is_owner'
        ]

    def get_is_owner(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.user == request.user
        return False

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
