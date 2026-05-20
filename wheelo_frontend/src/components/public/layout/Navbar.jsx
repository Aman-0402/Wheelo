import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { cn } from '@/utils/cn'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Vehicles', to: '/vehicles' },
  { label: 'About', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false) }, [location.pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'glass-dark shadow-lg' : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1 shrink-0">
              <span
                className="text-2xl md:text-3xl font-bold"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <span className="text-white">Whee</span>
                <span style={{ color: '#FF6B00' }}>lo</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'text-sm font-medium transition-colors duration-200',
                      isActive
                        ? 'text-[#FF6B00]'
                        : 'text-[#B0B0B0] hover:text-white'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Desktop CTA */}
            <Link
              to="/vehicles"
              className="hidden md:inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: '#FF6B00' }}
            >
              Get a Ride
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setDrawerOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-white"
              aria-label="Toggle menu"
            >
              {drawerOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 md:hidden"
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col md:hidden"
              style={{ background: '#1A1A1A', borderLeft: '1px solid #2A2A2A' }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 h-16">
                <span
                  className="text-2xl font-bold"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  <span className="text-white">Whee</span>
                  <span style={{ color: '#FF6B00' }}>lo</span>
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 text-[#B0B0B0] hover:text-white"
                  aria-label="Close menu"
                >
                  <HiX size={22} />
                </button>
              </div>

              <div className="h-px mx-6" style={{ background: '#2A2A2A' }} />

              {/* Drawer links */}
              <nav className="flex flex-col gap-1 px-4 pt-4 flex-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center px-4 py-3.5 rounded-xl text-base font-medium transition-colors',
                          isActive
                            ? 'text-[#FF6B00] bg-[#FF6B00]/10'
                            : 'text-[#B0B0B0] hover:text-white hover:bg-white/5'
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer CTA */}
              <div className="p-6">
                <Link
                  to="/vehicles"
                  className="flex items-center justify-center w-full py-3.5 rounded-xl text-base font-semibold text-white"
                  style={{ background: '#FF6B00' }}
                >
                  Get a Ride
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
