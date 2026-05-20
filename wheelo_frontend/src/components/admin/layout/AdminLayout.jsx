import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

const PAGE_TITLES = {
  '/admin/dashboard': 'Dashboard',
  '/admin/vehicles': 'Vehicles',
  '/admin/inquiries': 'Inquiries',
  '/admin/banners': 'Banners',
  '/admin/gallery': 'Gallery',
  '/admin/testimonials': 'Testimonials',
  '/admin/faqs': 'FAQs',
  '/admin/cms': 'CMS Sections',
  '/admin/settings': 'Settings',
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] || 'Admin'

  return (
    <div className="flex min-h-screen" style={{ background: '#0F0F0F' }}>
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0">
        <AdminHeader onMenuClick={() => setMobileOpen(true)} title={title} />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
