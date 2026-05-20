from django.db import models


class GalleryImage(models.Model):
    image = models.ImageField(upload_to='gallery/')
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    @property
    def image_url(self):
        return self.image.url if self.image else ''

    def __str__(self):
        return self.caption or f'Gallery image {self.pk}'
