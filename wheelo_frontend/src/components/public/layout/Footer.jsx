import { Link } from 'react-router-dom'
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query'
import { getSettings } from '@/api/public'

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Vehicles', to: '/vehicles' },
  { label: 'About Us', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
]

export default function Footer() {
  const { data } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings().then((r) => r.data),
    staleTime: Infinity,
  })

  const s = data || {}
  const whatsappUrl = s.whatsapp_number
    ? `https://wa.me/${s.whatsapp_number.replace(/\D/g, '')}`
    : '#'

  return (
    <footer style={{ background: '#111111', borderTop: '1px solid #2A2A2A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span
                className="text-3xl font-bold"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <span className="text-white">Whee</span>
                <span style={{ color: '#FF6B00' }}>lo</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5" style={{ color: '#B0B0B0' }}>
              {s.tagline || 'Your Ride, Anytime. Premium vehicle rentals in Vadodara.'}
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {s.instagram_url && (
                <a
                  href={s.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-[#FF6B00]"
                  style={{ background: '#2A2A2A' }}
                  aria-label="Instagram"
                >
                  <FaInstagram size={16} />
                </a>
              )}
              {s.facebook_url && (
                <a
                  href={s.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-[#FF6B00]"
                  style={{ background: '#2A2A2A' }}
                  aria-label="Facebook"
                >
                  <FaFacebookF size={16} />
                </a>
              )}
              {s.whatsapp_number && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-[#25D366]"
                  style={{ background: '#2A2A2A' }}
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-widest mb-5"
              style={{ color: '#FF6B00' }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: '#B0B0B0' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vehicle Types */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-widest mb-5"
              style={{ color: '#FF6B00' }}
            >
              Our Vehicles
            </h4>
            <ul className="space-y-3">
              {['Luxury Cars', 'SUVs', 'Sedans', 'Bikes & Scooters', 'Vans', 'Buses'].map((v) => (
                <li key={v}>
                  <Link
                    to="/vehicles"
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: '#B0B0B0' }}
                  >
                    {v}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-widest mb-5"
              style={{ color: '#FF6B00' }}
            >
              Contact
            </h4>
            <ul className="space-y-3 text-sm" style={{ color: '#B0B0B0' }}>
              {s.address && <li className="leading-relaxed">{s.address}</li>}
              {s.phone && (
                <li>
                  <a
                    href={`tel:${s.phone}`}
                    className="hover:text-white transition-colors"
                  >
                    {s.phone}
                  </a>
                </li>
              )}
              {s.email && (
                <li>
                  <a
                    href={`mailto:${s.email}`}
                    className="hover:text-white transition-colors"
                  >
                    {s.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderTop: '1px solid #2A2A2A', color: '#B0B0B0' }}
        >
          <p>© {new Date().getFullYear()} Wheelo. All rights reserved.</p>
          <p>Made with passion in Vadodara 🇮🇳</p>
        </div>
      </div>
    </footer>
  )
}
