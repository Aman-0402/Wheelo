from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Banner, Testimonial, FAQ, CMSSection, SiteSetting
from .serializers import (
    BannerSerializer, BannerWriteSerializer,
    TestimonialSerializer, TestimonialWriteSerializer,
    FAQSerializer, CMSSectionSerializer,
    SiteSettingSerializer, SiteSettingBulkSerializer,
)


class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.filter(is_active=True)

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Banner.objects.all()
        return Banner.objects.filter(is_active=True)

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return BannerWriteSerializer
        return BannerSerializer


class TestimonialViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Testimonial.objects.all()
        return Testimonial.objects.filter(is_active=True)

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return TestimonialWriteSerializer
        return TestimonialSerializer


class FAQViewSet(viewsets.ModelViewSet):
    serializer_class = FAQSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return FAQ.objects.all()
        return FAQ.objects.filter(is_active=True)

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        return [IsAuthenticated()]


class CMSSectionViewSet(viewsets.ModelViewSet):
    queryset = CMSSection.objects.all()
    serializer_class = CMSSectionSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        return [IsAuthenticated()]


class SiteSettingsView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        settings = SiteSetting.objects.all()
        data = {s.key: s.value for s in settings}
        return Response(data)

    def put(self, request):
        data = request.data
        # Accept both [{key, value}] array and {key: value} dict
        if isinstance(data, list):
            for item in data:
                if 'key' in item:
                    SiteSetting.objects.update_or_create(
                        key=item['key'], defaults={'value': item.get('value', '')}
                    )
        elif isinstance(data, dict):
            for key, value in data.items():
                SiteSetting.objects.update_or_create(key=key, defaults={'value': value or ''})
        return Response({'detail': 'Settings updated.'})


class HomepageView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        sections = CMSSection.objects.all()
        return Response({s.section_key: s.content for s in sections})
