# Wheelo — System Design Spec
**Date:** 2026-05-20  
**Status:** Approved  
**Tagline:** "Your Ride, Anytime"  
**Type:** Admin-Controlled Vehicle Rental Inquiry Platform

---

## 1. Business Logic

- Customers do NOT create accounts
- Customers browse vehicles and submit inquiry forms only
- Admin manually manages all rentals
- No online booking, no online payment, no customer dashboard
- Inquiry auto-captures: submitted_at (datetime), status="New"
- All frontend content dynamically controlled from admin panel

---

## 2. Geography & Locale

- Market: India (Vadodara, Gujarat)
- Currency: INR (₹)
- Timezone: Asia/Kolkata (IST, UTC+5:30)
- Language: English

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion |
| HTTP | Axios |
| Routing | React Router DOM v6 |
| State | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| SEO | react-helmet-async |
| Backend | Django 5.x + Django REST Framework |
| Auth | JWT via djangorestframework-simplejwt |
| Database | MySQL 8 |
| Media | Cloudinary |
| Deploy Frontend | Vercel |
| Deploy Backend | VPS or Render |

---

## 4. System Architecture

```
Public Website (React SPA)  ──── GET /api/public/*  ────┐
Admin Panel (React, /admin)  ─── /api/admin/* + JWT ────┤
                                                         ▼
                                          Django REST Framework
                                                    │
                              ┌─────────────────────┼──────────────┐
                              ▼                     ▼              ▼
                           MySQL              Cloudinary        wa.me link
```

### Admin Panel Approach
- Same React app, `/admin/*` routes lazy-loaded behind `<AuthGuard>`
- Same Tailwind dark design system
- Admin bundle only loads on `/admin` route hit

---

## 5. Public Pages

| Route | Page |
|---|---|
| `/` | Home |
| `/vehicles` | Vehicle Listing |
| `/vehicles/:slug` | Vehicle Detail |
| `/about` | About |
| `/gallery` | Gallery |
| `/faq` | FAQ |
| `/contact` | Contact |

### Home Page Sections
1. Hero Banner (fullscreen, Swiper slider)
2. Featured Vehicles
3. Vehicle Categories
4. Why Choose Us
5. Rental Process (steps)
6. Testimonials
7. FAQ (accordion)
8. CTA Banner
9. Footer

### Vehicle Detail Page
- Image gallery (react-image-gallery)
- Specifications table
- Availability badge
- Rental price (₹/day)
- Inquiry form
- Similar vehicles section

---

## 6. Admin Panel Modules

| Module | Operations |
|---|---|
| Dashboard | Stats: inquiry count, vehicle count, recent inquiries, views |
| Vehicle Management | CRUD vehicles, categories, images, availability toggle |
| Inquiry Management | List/filter by status, update status (New → Reviewed → Contacted → Closed) |
| CMS Sections | Edit homepage text sections (Why Choose Us, Rental Process, etc.) |
| Banner Management | CRUD hero banners and CTA banners |
| Gallery Management | Upload/reorder/delete gallery images |
| Testimonials | CRUD testimonials |
| FAQ Management | CRUD FAQs with drag-to-reorder |
| Settings | Site name, phone, email, WhatsApp number, Maps embed URL, social links, GA4 ID |
| Auth | Login, logout, JWT refresh |

---

## 7. Inquiry System

### Form Fields
- Full Name (required)
- Phone Number (required, Indian mobile validation)
- Email (optional)
- City (required)
- Vehicle (auto-filled if from vehicle detail page, else dropdown)
- Pickup Date (required)
- Drop Date (required)
- Message (optional)

### Auto-Captured Fields
- `submitted_at`: server-side datetime (IST)
- `status`: "New" (default)

### Post-Submit Flow
1. POST to `/api/public/inquiries/`
2. Success response returned
3. Frontend shows success message
4. "Continue on WhatsApp" button appears with pre-filled wa.me link

### WhatsApp Message Template
```
Hi Wheelo! I just submitted an inquiry.

Name: {name}
Phone: {phone}
Vehicle: {vehicle_name}
Pickup: {pickup_date}
Drop: {drop_date}
City: {city}
```

WhatsApp number stored in `SiteSettings` — admin-configurable.

---

## 8. API Namespace

### Public (no auth)
```
GET  /api/public/vehicles/
GET  /api/public/vehicles/{slug}/
GET  /api/public/categories/
POST /api/public/inquiries/
GET  /api/public/homepage/
GET  /api/public/testimonials/
GET  /api/public/faqs/
GET  /api/public/gallery/
GET  /api/public/settings/
GET  /api/public/banners/
```

### Admin (JWT required)
```
POST   /api/admin/auth/login/
POST   /api/admin/auth/refresh/
POST   /api/admin/auth/logout/

CRUD   /api/admin/vehicles/
CRUD   /api/admin/categories/
CRUD   /api/admin/vehicle-images/

GET    /api/admin/inquiries/
PATCH  /api/admin/inquiries/{id}/

CRUD   /api/admin/banners/
CRUD   /api/admin/gallery/
CRUD   /api/admin/testimonials/
CRUD   /api/admin/faqs/
CRUD   /api/admin/cms-sections/

GET    /api/admin/settings/
PUT    /api/admin/settings/

GET    /api/admin/analytics/dashboard/
```

---

## 9. Database Models (Summary)

| Model | Key Fields |
|---|---|
| `Category` | id, name, slug, icon, order |
| `Vehicle` | id, name, slug, category_id, description, price_per_day, availability (choices: available/rented/maintenance), specs (JSON), is_featured, created_at |
| `VehicleImage` | id, vehicle_id, image_url, is_primary, order |
| `Inquiry` | id, full_name, phone, email, city, vehicle_id (nullable), pickup_date, drop_date, message, status, submitted_at |
| `Banner` | id, title, subtitle, image_url, cta_text, cta_link, is_active, order |
| `Testimonial` | id, name, role, content, rating, image_url, is_active, order |
| `FAQ` | id, question, answer, order, is_active |
| `GalleryImage` | id, image_url, caption, order |
| `CMSSection` | id, section_key, content (JSON), updated_at |
| `SiteSetting` | id, key, value, updated_at — known keys: `site_name`, `phone`, `email`, `whatsapp_number`, `maps_embed_url`, `ga4_id`, `instagram_url`, `facebook_url`, `address` |

---

## 10. Design System

| Token | Value |
|---|---|
| Background | `#0F0F0F` (Matte Black) |
| Surface | `#1A1A1A` (Dark Gray) |
| Accent | `#FF6B00` (Orange) |
| Text Primary | `#FFFFFF` |
| Text Muted | `#B0B0B0` (Soft Gray) |
| Font Headings | Sora |
| Font Body | Inter |
| Feel | Luxury Dark, Glassmorphism, Cinematic, Minimal-Bold |

---

## 11. Mobile-First Requirements

- Design mobile layouts first, desktop enhancement second
- Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Hero: Swiper slider, touch-swipeable
- Vehicle cards: compact on mobile, grid on desktop
- Navigation: hamburger drawer on mobile, sticky header
- Forms: `inputmode="tel"` for phone, `type="date"` for dates, large tap targets
- Images: Cloudinary responsive URLs + lazy loading
- Animations: `transform` + `opacity` only (GPU compositing, no layout thrash)
- WhatsApp float: fixed bottom-right, visible on all pages

---

## 12. WhatsApp Integration

- Floating button: `wa.me/{number}` — always visible
- Post-inquiry redirect: `wa.me/{number}?text={encoded_message}`
- Number stored in `SiteSettings.whatsapp_number`
- No WhatsApp Business API required

---

## 13. Analytics

- **GA4**: embed GA4 tracking ID in frontend (ID from `SiteSettings.ga4_id`)
- **Custom**: admin dashboard shows inquiry stats, vehicle view counts, inquiry status breakdown

---

## 14. Google Maps

- Embed URL stored in `SiteSettings.maps_embed_url`
- Rendered as `<iframe>` on Contact page
- Admin can update URL without redeploy

---

## 15. Security

| Concern | Mitigation |
|---|---|
| Admin access | JWT on all `/api/admin/*` |
| Brute force | Rate limit on auth/login/ |
| CORS | `CORS_ALLOWED_ORIGINS` = Vercel domain only |
| SQL injection | Django ORM parameterized queries |
| XSS | DRF serializer validation |
| Secrets | `.env` + Vercel env vars |
| Media abuse | Cloudinary image-type restriction |
| CSRF | JWT = stateless = no CSRF needed |

---

## 16. Future Scalability

| Feature | Supported By |
|---|---|
| Online payments | Add `bookings` + `payments` app, Razorpay |
| Customer accounts | Add `users` app, separate auth |
| Mobile app | Same REST API, React Native |
| Multi-vendor | Add `vendors` FK to vehicles |
| Multi-city | Add `cities` FK to vehicles/settings |
| GPS tracking | Django Channels (WebSocket) |

---

## 17. Key Libraries

### Frontend
`react`, `vite`, `react-router-dom`, `tailwindcss`, `framer-motion`, `axios`, `@tanstack/react-query`, `react-hook-form`, `zod`, `react-helmet-async`, `swiper`, `react-image-gallery`, `react-hot-toast`, `date-fns`, `react-icons`, `clsx`, `tailwind-merge`

### Backend
`django`, `djangorestframework`, `djangorestframework-simplejwt`, `django-cors-headers`, `cloudinary`, `django-cloudinary-storage`, `django-environ`, `django-filter`, `django-ratelimit`, `mysqlclient`, `Pillow`, `gunicorn`
