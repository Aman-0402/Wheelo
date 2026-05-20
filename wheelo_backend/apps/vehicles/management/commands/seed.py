from django.core.management.base import BaseCommand
from apps.vehicles.models import Category, Vehicle
from apps.cms.models import SiteSetting, FAQ, Testimonial, Banner


class Command(BaseCommand):
    help = 'Seed initial data for Wheelo'

    def handle(self, *args, **options):
        self._seed_settings()
        self._seed_categories()
        self._seed_vehicles()
        self._seed_faqs()
        self._seed_testimonials()
        self.stdout.write(self.style.SUCCESS('Seed complete.'))

    def _seed_settings(self):
        defaults = {
            'site_name': 'Wheelo',
            'tagline': 'Your Ride, Anytime',
            'phone': '+91 98765 43210',
            'email': 'hello@wheelo.in',
            'whatsapp_number': '919876543210',
            'address': 'Vadodara, Gujarat, India',
        }
        for key, value in defaults.items():
            SiteSetting.objects.get_or_create(key=key, defaults={'value': value})
        self.stdout.write('  Settings seeded.')

    def _seed_categories(self):
        cats = [
            ('Luxury Cars', 'luxury-cars', '🏎️'),
            ('SUVs', 'suvs', '🚙'),
            ('Sedans', 'sedans', '🚗'),
            ('Bikes & Scooters', 'bikes-scooters', '🏍️'),
            ('Vans', 'vans', '🚐'),
            ('Buses', 'buses', '🚌'),
        ]
        for name, slug, icon in cats:
            Category.objects.get_or_create(slug=slug, defaults={'name': name, 'icon': icon})
        self.stdout.write('  Categories seeded.')

    def _seed_vehicles(self):
        cat = Category.objects.filter(slug='suvs').first()
        vehicles = [
            {
                'name': 'Toyota Innova Crysta',
                'description': 'The most popular SUV for family trips and corporate travel. Spacious, comfortable, and reliable.',
                'price_per_day': 3500,
                'availability': 'available',
                'is_featured': True,
                'specs': {'Fuel': 'Diesel', 'Seats': '7', 'Transmission': 'Manual', 'AC': 'Yes'},
            },
            {
                'name': 'Toyota Fortuner',
                'description': 'Powerful and luxurious SUV perfect for long journeys and off-road adventures.',
                'price_per_day': 6000,
                'availability': 'available',
                'is_featured': True,
                'specs': {'Fuel': 'Diesel', 'Seats': '7', 'Transmission': 'Automatic', 'AC': 'Yes'},
            },
            {
                'name': 'Honda City',
                'description': 'Elegant sedan ideal for city commutes and business travel.',
                'price_per_day': 2000,
                'availability': 'available',
                'is_featured': True,
                'specs': {'Fuel': 'Petrol', 'Seats': '5', 'Transmission': 'Automatic', 'AC': 'Yes'},
            },
        ]
        sedan_cat = Category.objects.filter(slug='sedans').first()
        for i, v in enumerate(vehicles):
            use_cat = cat if i < 2 else sedan_cat
            Vehicle.objects.get_or_create(
                name=v['name'],
                defaults={**v, 'category': use_cat}
            )
        self.stdout.write('  Vehicles seeded.')

    def _seed_faqs(self):
        faqs = [
            ('What documents are required to rent a vehicle?', 'You need a valid driving licence, Aadhaar card or passport, and one recent passport-size photograph.', 1),
            ('Is there a security deposit?', 'Yes, a refundable security deposit is required. The amount varies by vehicle and is returned after the rental period.', 2),
            ('Do you provide a driver?', 'Yes, we offer both self-drive and chauffeur-driven options. Driver charges apply for chauffeur service.', 3),
            ('What is the fuel policy?', 'Vehicles are provided with a full tank. You are required to return the vehicle with the same fuel level.', 4),
            ('Can I rent for outstation trips?', 'Absolutely! We cover Vadodara and all surrounding cities. Outstation charges apply per km beyond city limits.', 5),
        ]
        for question, answer, order in faqs:
            FAQ.objects.get_or_create(
                question=question,
                defaults={'answer': answer, 'order': order, 'is_active': True}
            )
        self.stdout.write('  FAQs seeded.')

    def _seed_testimonials(self):
        testimonials = [
            ('Rajesh Kumar', 'Vadodara', 5, 'Excellent service! The Innova Crysta was spotless and the staff was very professional. Will definitely rent again.'),
            ('Priya Shah', 'Anand', 5, 'Best vehicle rental in Vadodara. Quick confirmation, great vehicle condition. Highly recommended!'),
            ('Amit Patel', 'Surat', 4, 'Had a wonderful experience renting the Fortuner for our family trip. Very smooth process from inquiry to delivery.'),
        ]
        for name, role, rating, content in testimonials:
            Testimonial.objects.get_or_create(
                name=name,
                defaults={'role': role, 'rating': rating, 'content': content, 'is_active': True}
            )
        self.stdout.write('  Testimonials seeded.')
