from django.shortcuts import render
from rest_framework import viewsets, permissions
from api.models import Car
from api.serializers import CarSerializer

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = [permissions.IsAuthenticated]
