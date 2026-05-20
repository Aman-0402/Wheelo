from rest_framework import serializers
from .models import Inquiry


class InquiryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = [
            'full_name', 'phone', 'email', 'city',
            'vehicle', 'pickup_date', 'drop_date', 'message',
        ]

    def validate_phone(self, value):
        digits = ''.join(filter(str.isdigit, value))
        if len(digits) != 10:
            raise serializers.ValidationError('Enter a valid 10-digit Indian mobile number.')
        return digits

    def validate(self, data):
        if data.get('drop_date') and data.get('pickup_date'):
            if data['drop_date'] < data['pickup_date']:
                raise serializers.ValidationError({'drop_date': 'Drop date must be on or after pickup date.'})
        return data


class InquiryListSerializer(serializers.ModelSerializer):
    vehicle_name = serializers.CharField(source='vehicle.name', read_only=True)

    class Meta:
        model = Inquiry
        fields = [
            'id', 'full_name', 'phone', 'email', 'city',
            'vehicle', 'vehicle_name', 'pickup_date', 'drop_date',
            'message', 'status', 'submitted_at',
        ]


class InquiryStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = ['status']
