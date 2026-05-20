from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, VehicleViewSet

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='public-category')
router.register('vehicles', VehicleViewSet, basename='public-vehicle')

urlpatterns = router.urls
