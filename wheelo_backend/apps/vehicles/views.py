from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Vehicle, VehicleImage
from .serializers import (
    CategorySerializer, VehicleListSerializer, VehicleDetailSerializer,
    VehicleWriteSerializer, VehicleImageSerializer, VehicleImageWriteSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        return [IsAuthenticated()]


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.select_related('category').prefetch_related('images').all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['availability', 'is_featured', 'category__slug']
    search_fields = ['name', 'description']
    ordering_fields = ['price_per_day', 'created_at', 'name']
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return VehicleDetailSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return VehicleWriteSerializer
        return VehicleListSerializer

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        try:
            from apps.analytics.models import VehicleView
            VehicleView.objects.create(vehicle=self.get_object())
        except Exception:
            pass
        return response


class VehicleImageViewSet(viewsets.ModelViewSet):
    queryset = VehicleImage.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return VehicleImageWriteSerializer
        return VehicleImageSerializer
