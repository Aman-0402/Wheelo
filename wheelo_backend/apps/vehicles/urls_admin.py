from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, VehicleViewSet, VehicleImageViewSet

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='admin-category')
router.register('vehicles', VehicleViewSet, basename='admin-vehicle')
router.register('vehicle-images', VehicleImageViewSet, basename='admin-vehicle-image')

urlpatterns = router.urls
