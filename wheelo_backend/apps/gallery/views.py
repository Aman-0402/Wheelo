from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import GalleryImage
from .serializers import GalleryImageSerializer, GalleryImageWriteSerializer


class GalleryImageViewSet(viewsets.ModelViewSet):
    queryset = GalleryImage.objects.all()

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return GalleryImageWriteSerializer
        return GalleryImageSerializer
