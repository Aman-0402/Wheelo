from django.db import models


class VehicleView(models.Model):
    vehicle = models.ForeignKey(
        'vehicles.Vehicle', on_delete=models.CASCADE, related_name='views'
    )
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-viewed_at']
