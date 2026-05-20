from rest_framework.routers import DefaultRouter
from .views import PublicInquiryViewSet

router = DefaultRouter()
router.register('inquiries', PublicInquiryViewSet, basename='public-inquiry')

urlpatterns = router.urls
