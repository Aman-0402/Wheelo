from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/public/', include('apps.vehicles.urls_public')),
    path('api/public/', include('apps.inquiries.urls_public')),
    path('api/public/', include('apps.cms.urls_public')),
    path('api/public/', include('apps.gallery.urls_public')),
    path('api/admin/', include('apps.vehicles.urls_admin')),
    path('api/admin/', include('apps.inquiries.urls_admin')),
    path('api/admin/', include('apps.cms.urls_admin')),
    path('api/admin/', include('apps.gallery.urls_admin')),
    path('api/admin/', include('apps.analytics.urls')),
    path('api/admin/auth/', include('apps.accounts.urls')),
]
