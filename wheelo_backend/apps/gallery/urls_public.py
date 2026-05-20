from rest_framework.routers import DefaultRouter
from .views import GalleryImageViewSet

router = DefaultRouter()
router.register('gallery', GalleryImageViewSet, basename='public-gallery')

urlpatterns = router.urls
