from rest_framework import serializers
from .models import GalleryImage


class GalleryImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = GalleryImage
        fields = ['id', 'image_url', 'caption', 'order', 'created_at']

    def get_image_url(self, obj):
        return obj.image_url


class GalleryImageWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ['id', 'image', 'caption', 'order']
