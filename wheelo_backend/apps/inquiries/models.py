from django.db import models
from django.utils import timezone


class Inquiry(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('reviewed', 'Reviewed'),
        ('contacted', 'Contacted'),
        ('closed', 'Closed'),
    ]

    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True)
    city = models.CharField(max_length=100)
    vehicle = models.ForeignKey(
        'vehicles.Vehicle', on_delete=models.SET_NULL, null=True, blank=True, related_name='inquiries'
    )
    pickup_date = models.DateField()
    drop_date = models.DateField()
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new', db_index=True)
    submitted_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-submitted_at']
        verbose_name_plural = 'inquiries'

    def __str__(self):
        return f'{self.full_name} — {self.phone} ({self.status})'
