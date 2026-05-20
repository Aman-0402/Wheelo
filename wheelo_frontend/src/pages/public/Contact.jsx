import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { FaWhatsapp, FaInstagram, FaFacebookF } from 'react-icons/fa'
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi'
import { getSettings } from '@/api/public'
import SectionHeading from '@/components/public/ui/SectionHeading'
import InquiryForm from '@/components/public/vehicles/InquiryForm'
import { buildWhatsAppUrl } from '@/utils/whatsapp'

const EMBED_FALLBACK = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d210.89915097075723!2d73.2822366636386!3d22.291758353433863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fdbec39b20cad%3A0x7168f9906b9109d9!2sStanza%20Living%20Auckland%20House%20%7C%20PG%20in%20Waghodia%20Road!5e1!3m2!1sen!2sin!4v1779280434462!5m2!1sen!2sin`

export default function Contact() {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings().then((r) => r.data),
    staleTime: Infinity,
  })

  const s = settings || {}
  const whatsappUrl = s.whatsapp_number ? buildWhatsAppUrl(s.whatsapp_number) : null
  const mapsUrl = s.maps_embed_url || EMBED_FALLBACK

  const contactItems = [
    s.phone && { icon: <HiPhone size={18} />, label: 'Phone', value: s.phone, href: `tel:${s.phone}` },
    s.email && { icon: <HiMail size={18} />, label: 'Email', value: s.email, href: `mailto:${s.email}` },
    s.address && { icon: <HiLocationMarker size={18} />, label: 'Address', value: s.address, href: null },
  ].filter(Boolean)

  const socialItems = [
    s.whatsapp_number && { icon: <FaWhatsapp size={18} />, label: 'WhatsApp', href: whatsappUrl, color: '#25D366' },
    s.instagram_url && { icon: <FaInstagram size={18} />, label: 'Instagram', href: s.instagram_url, color: '#E1306C' },
    s.facebook_url && { icon: <FaFacebookF size={18} />, label: 'Facebook', href: s.facebook_url, color: '#1877F2' },
  ].filter(Boolean)

  return (
    <>
      <Helmet>
        <title>Contact Us — Wheelo | Vehicle Rental Vadodara</title>
        <meta name="description" content="Get in touch with Wheelo for premium vehicle rental in Vadodara. Call, WhatsApp, or send an inquiry." />
      </Helmet>

      <div className="py-12 md:py-16 px-4 sm:px-6 lg:px-8" style={{ background: '#111111', borderBottom: '1px solid #2A2A2A' }}>
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            tag="Get in Touch"
            title="Contact Wheelo"
            subtitle="Have a question or ready to book? Reach out — we respond fast."
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left — contact info + map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Contact info cards */}
            {contactItems.length > 0 && (
              <div className="space-y-3">
                {contactItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl"
                    style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(255,107,0,0.1)', color: '#FF6B00' }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-0.5" style={{ color: '#B0B0B0' }}>{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm font-medium text-white hover:text-[#FF6B00] transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-white leading-relaxed">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Social links */}
            {socialItems.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#FF6B00' }}>
                  Find Us On
                </p>
                <div className="flex gap-3">
                  {socialItems.map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-80"
                      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
                    >
                      <span style={{ color: s.color }}>{s.icon}</span>
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Google Maps embed */}
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #2A2A2A' }}>
              <iframe
                src={mapsUrl}
                width="100%"
                height="280"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Wheelo Location"
              />
            </div>
          </motion.div>

          {/* Right — inquiry form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <InquiryForm />
          </motion.div>
        </div>
      </div>
    </>
  )
}
