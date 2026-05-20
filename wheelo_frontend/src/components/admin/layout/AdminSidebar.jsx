import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiViewGrid, HiTruck, HiMail, HiPhotograph, HiStar,
  HiQuestionMarkCircle, HiCollection, HiCog, HiLogout,
  HiX, HiSpeakerphone,
} from 'react-icons/hi'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import { cn } from '@/utils/cn'

const NAV = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: HiViewGrid },
  { label: 'Vehicles', to: '/admin/vehicles', icon: HiTruck },
  { label: 'Inquiries', to: '/admin/inquiries', icon: HiMail },
  { label: 'Banners', to: '/admin/banners', icon: HiSpeakerphone },
  { label: 'Gallery', to: '/admin/gallery', icon: HiPhotograph },
  { label: 'Testimonials', to: '/admin/testimonials', icon: HiStar },
  { label: 'FAQs', to: '/admin/faqs', icon: HiQuestionMarkCircle },
  { label: 'CMS Sections', to: '/admin/cms', icon: HiCollection },
  { label: 'Settings', to: '/admin/settings', icon: HiCog },
]

function SidebarContent({ onClose }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
    toast.success('Logged out.')
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#111111' }}>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 shrink-0" style={{ borderBottom: '1px solid #2A2A2A' }}>
        <span className="text-xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
          <span className="text-white">Whee</span>
          <span style={{ color: '#FF6B00' }}>lo</span>
          <span className="text-xs font-normal ml-1.5" style={{ color: '#B0B0B0' }}>Admin</span>
        </span>
        {onClose && (
          <button onClick={onClose} className="p-1 text-[#B0B0B0] hover:text-white lg:hidden">
            <HiX size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'text-white'
                  : 'hover:text-white hover:bg-white/5'
              )
            }
            style={({ isActive }) =>
              isActive
                ? { background: 'rgba(255,107,0,0.12)', color: '#FF6B00' }
                : { color: '#B0B0B0' }
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 shrink-0" style={{ borderTop: '1px solid #2A2A2A', paddingTop: '12px' }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-red-500/10"
          style={{ color: '#B0B0B0' }}
        >
          <HiLogout size={18} />
          Logout
        </button>
      </div>
    </div>
  )
}

export default function AdminSidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-56 shrink-0 h-screen sticky top-0"
        style={{ borderRight: '1px solid #2A2A2A' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.7)' }}
            />
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-56 lg:hidden"
            >
              <SidebarContent onClose={onClose} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
