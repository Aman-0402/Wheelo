from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .models import VehicleView
from apps.inquiries.models import Inquiry
from apps.vehicles.models import Vehicle


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)

        total_vehicles = Vehicle.objects.count()
        available_vehicles = Vehicle.objects.filter(availability='available').count()
        total_inquiries = Inquiry.objects.count()
        new_inquiries = Inquiry.objects.filter(status='new').count()
        inquiries_this_month = Inquiry.objects.filter(submitted_at__gte=thirty_days_ago).count()

        inquiry_status_breakdown = {
            status: Inquiry.objects.filter(status=status).count()
            for status, _ in Inquiry.STATUS_CHOICES
        }

        recent_inquiries = Inquiry.objects.select_related('vehicle').order_by('-submitted_at')[:10]
        recent_data = [
            {
                'id': i.id,
                'full_name': i.full_name,
                'phone': i.phone,
                'vehicle_name': i.vehicle.name if i.vehicle else None,
                'status': i.status,
                'submitted_at': i.submitted_at,
            }
            for i in recent_inquiries
        ]

        return Response({
            'total_vehicles': total_vehicles,
            'available_vehicles': available_vehicles,
            'total_inquiries': total_inquiries,
            'new_inquiries': new_inquiries,
            'inquiries_this_month': inquiries_this_month,
            'inquiry_status_breakdown': inquiry_status_breakdown,
            'recent_inquiries': recent_data,
        })
