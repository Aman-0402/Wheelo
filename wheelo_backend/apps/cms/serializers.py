from rest_framework import serializers
from .models import Banner, Testimonial, FAQ, CMSSection, SiteSetting


class BannerSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Banner
        fields = ['id', 'title', 'subtitle', 'image_url', 'cta_text', 'cta_link', 'is_active', 'order']

    def get_image_url(self, obj):
        return obj.image_url


class BannerWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ['id', 'title', 'subtitle', 'image', 'cta_text', 'cta_link', 'is_active', 'order']


class TestimonialSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = ['id', 'name', 'role', 'content', 'rating', 'image_url', 'is_active', 'order']

    def get_image_url(self, obj):
        return obj.image_url


class TestimonialWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'name', 'role', 'content', 'rating', 'image', 'is_active', 'order']


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'order', 'is_active']


class CMSSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CMSSection
        fields = ['id', 'section_key', 'content', 'updated_at']


class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = ['key', 'value']


class SiteSettingBulkSerializer(serializers.Serializer):
    settings = serializers.DictField(child=serializers.CharField(allow_blank=True))

    def update_settings(self):
        data = self.validated_data['settings']
        for key, value in data.items():
            SiteSetting.objects.update_or_create(key=key, defaults={'value': value})
        return data
