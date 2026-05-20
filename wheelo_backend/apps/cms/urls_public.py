from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import BannerViewSet, TestimonialViewSet, FAQViewSet, CMSSectionViewSet, SiteSettingsView, HomepageView

router = DefaultRouter()
router.register('banners', BannerViewSet, basename='public-banner')
router.register('testimonials', TestimonialViewSet, basename='public-testimonial')
router.register('faqs', FAQViewSet, basename='public-faq')
router.register('cms-sections', CMSSectionViewSet, basename='public-cms')

urlpatterns = router.urls + [
    path('settings/', SiteSettingsView.as_view(), name='public-settings'),
    path('homepage/', HomepageView.as_view(), name='public-homepage'),
]
