from rest_framework import serializers
from .models import Category, Vehicle, VehicleImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'order']


class VehicleImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = VehicleImage
        fields = ['id', 'image_url', 'is_primary', 'order']

    def get_image_url(self, obj):
        return obj.image_url


class VehicleListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    images = VehicleImageSerializer(many=True, read_only=True)

    class Meta:
        model = Vehicle
        fields = [
            'id', 'name', 'slug', 'category_name', 'category_slug',
            'price_per_day', 'availability', 'is_featured', 'images',
        ]


class VehicleDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    images = VehicleImageSerializer(many=True, read_only=True)

    class Meta:
        model = Vehicle
        fields = [
            'id', 'name', 'slug', 'category', 'category_name', 'category_slug',
            'description', 'price_per_day', 'availability', 'specs',
            'is_featured', 'images', 'created_at',
        ]


class VehicleWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = [
            'id', 'name', 'category', 'description', 'price_per_day',
            'availability', 'specs', 'is_featured',
        ]


class VehicleImageWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleImage
        fields = ['id', 'vehicle', 'image', 'is_primary', 'order']
