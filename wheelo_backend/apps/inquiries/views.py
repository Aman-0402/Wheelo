from rest_framework import viewsets, mixins, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import Inquiry
from .serializers import InquiryCreateSerializer, InquiryListSerializer, InquiryStatusSerializer


class PublicInquiryViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Inquiry.objects.all()
    serializer_class = InquiryCreateSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Inquiry submitted successfully.'}, status=status.HTTP_201_CREATED)


class AdminInquiryViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
                          mixins.UpdateModelMixin, viewsets.GenericViewSet):
    queryset = Inquiry.objects.select_related('vehicle').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['full_name', 'phone', 'email', 'city']
    ordering_fields = ['submitted_at', 'status']

    def get_serializer_class(self):
        if self.action in ('update', 'partial_update'):
            return InquiryStatusSerializer
        return InquiryListSerializer
