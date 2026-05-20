import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// Public layout + pages
import PublicLayout from '@/components/public/layout/PublicLayout'
const Home = lazy(() => import('@/pages/public/Home'))
const Vehicles = lazy(() => import('@/pages/public/Vehicles'))
const VehicleDetail = lazy(() => import('@/pages/public/VehicleDetail'))
const About = lazy(() => import('@/pages/public/About'))
const Gallery = lazy(() => import('@/pages/public/Gallery'))
const Faq = lazy(() => import('@/pages/public/Faq'))
const Contact = lazy(() => import('@/pages/public/Contact'))

// Admin — lazy loaded (separate bundle chunk)
const AdminLayout = lazy(() => import('@/components/admin/layout/AdminLayout'))
const AdminLogin = lazy(() => import('@/pages/admin/Login'))
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminVehicles = lazy(() => import('@/pages/admin/Vehicles'))
const AdminInquiries = lazy(() => import('@/pages/admin/Inquiries'))
const AdminGallery = lazy(() => import('@/pages/admin/Gallery'))
const AdminTestimonials = lazy(() => import('@/pages/admin/Testimonials'))
const AdminFaqs = lazy(() => import('@/pages/admin/Faqs'))
const AdminBanners = lazy(() => import('@/pages/admin/Banners'))
const AdminCms = lazy(() => import('@/pages/admin/Cms'))
const AdminSettings = lazy(() => import('@/pages/admin/Settings'))

function AuthGuard({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#0F0F0F' }}>
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#FF6B00', borderTopColor: 'transparent' }} />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/:slug" element={<VehicleDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AuthGuard><AdminLayout /></AuthGuard>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vehicles" element={<AdminVehicles />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="faqs" element={<AdminFaqs />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="cms" element={<AdminCms />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
