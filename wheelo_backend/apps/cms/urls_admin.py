from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import BannerViewSet, TestimonialViewSet, FAQViewSet, CMSSectionViewSet, SiteSettingsView

router = DefaultRouter()
router.register('banners', BannerViewSet, basename='admin-banner')
router.register('testimonials', TestimonialViewSet, basename='admin-testimonial')
router.register('faqs', FAQViewSet, basename='admin-faq')
router.register('cms-sections', CMSSectionViewSet, basename='admin-cms')

urlpatterns = router.urls + [
    path('settings/', SiteSettingsView.as_view(), name='admin-settings'),
]
