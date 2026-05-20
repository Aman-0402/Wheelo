from rest_framework.routers import DefaultRouter
from .views import AdminInquiryViewSet

router = DefaultRouter()
router.register('inquiries', AdminInquiryViewSet, basename='admin-inquiry')

urlpatterns = router.urls
