import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query'
import { getSettings } from '@/api/public'
import { buildWhatsAppUrl } from '@/utils/whatsapp'

export default function CtaBanner() {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings().then((r) => r.data),
    staleTime: Infinity,
  })

  const whatsappUrl = settings?.whatsapp_number
    ? buildWhatsAppUrl(settings.whatsapp_number)
    : null

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl p-8 md:p-14 text-center"
          style={{
            background: 'linear-gradient(135deg, #1A1A1A 0%, #111 50%, #1a0a00 100%)',
            border: '1px solid rgba(255,107,0,0.2)',
          }}
        >
          {/* Glow */}
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'rgba(255,107,0,0.15)' }}
          />

          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ color: '#FF6B00', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.3)' }}
          >
            Ready to Ride?
          </span>

          <h2
            className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4 relative z-10"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Book Your Dream Vehicle <br className="hidden sm:block" />
            <span style={{ color: '#FF6B00' }}>Today</span>
          </h2>

          <p className="text-sm sm:text-base mb-8 max-w-md mx-auto relative z-10" style={{ color: '#B0B0B0' }}>
            Browse our fleet, submit an inquiry, and we'll confirm your booking within hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
            <Link
              to="/vehicles"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: '#FF6B00' }}
            >
              Browse Vehicles
              <HiArrowRight size={16} />
            </Link>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/10 active:scale-95"
                style={{ color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <FaWhatsapp size={16} style={{ color: '#25D366' }} />
                WhatsApp Us
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
