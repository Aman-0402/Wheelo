from django.db import models


class Banner(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.TextField(blank=True)
    image = models.ImageField(upload_to='banners/')
    cta_text = models.CharField(max_length=100, blank=True, default='Explore Vehicles')
    cta_link = models.CharField(max_length=200, blank=True, default='/vehicles')
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    @property
    def image_url(self):
        return self.image.url if self.image else ''

    def __str__(self):
        return self.title


class Testimonial(models.Model):
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=200, blank=True)
    content = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    image = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    @property
    def image_url(self):
        return self.image.url if self.image else ''

    def __str__(self):
        return self.name


class FAQ(models.Model):
    question = models.CharField(max_length=500)
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'

    def __str__(self):
        return self.question[:80]


class CMSSection(models.Model):
    section_key = models.CharField(max_length=100, unique=True)
    content = models.JSONField(default=dict)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.section_key


class SiteSetting(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    KNOWN_KEYS = [
        'site_name', 'tagline', 'phone', 'email', 'whatsapp_number',
        'address', 'maps_embed_url', 'ga4_id',
        'instagram_url', 'facebook_url',
    ]

    def __str__(self):
        return f'{self.key}: {self.value[:50]}'
