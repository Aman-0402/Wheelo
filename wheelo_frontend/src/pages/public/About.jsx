import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SectionHeading from '@/components/public/ui/SectionHeading'
import { HiArrowRight } from 'react-icons/hi'

const STATS = [
  { value: '500+', label: 'Happy Customers' },
  { value: '50+', label: 'Premium Vehicles' },
  { value: '5+', label: 'Years Experience' },
  { value: '24/7', label: 'Support Available' },
]

const VALUES = [
  { icon: '🏆', title: 'Excellence', desc: 'Every vehicle is handpicked and maintained to the highest standards.' },
  { icon: '🤝', title: 'Trust', desc: 'Transparent pricing, no hidden fees, honest service every time.' },
  { icon: '🛡️', title: 'Safety', desc: 'All vehicles fully insured and regularly serviced for your safety.' },
  { icon: '💫', title: 'Experience', desc: 'We don\'t just rent vehicles — we craft memorable journeys.' },
]

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us — Wheelo | Premium Vehicle Rental Vadodara</title>
        <meta name="description" content="Learn about Wheelo — Vadodara's premium vehicle rental company. Our story, mission, and commitment to excellence." />
      </Helmet>

      {/* Hero */}
      <div className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ background: '#111111' }}>
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #FF6B00 0%, transparent 60%)' }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1.5 rounded-full"
              style={{ color: '#FF6B00', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)' }}
            >
              Our Story
            </span>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Vadodara's Most Trusted{' '}
              <span style={{ color: '#FF6B00' }}>Vehicle Rental</span>
            </h1>
            <p className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: '#B0B0B0' }}>
              Wheelo was born from a simple belief — that everyone deserves access to a premium, reliable vehicle without the hassle. Since day one, we've been committed to delivering exceptional rental experiences across Vadodara.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-12 px-4 sm:px-6 lg:px-8" style={{ background: '#0F0F0F', borderBottom: '1px solid #2A2A2A' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <p
                className="text-3xl sm:text-4xl font-bold mb-1"
                style={{ color: '#FF6B00', fontFamily: 'Sora, sans-serif' }}
              >
                {stat.value}
              </p>
              <p className="text-sm" style={{ color: '#B0B0B0' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeading tag="Our Mission" title="Driving Excellence, Every Day" center={false} />
            <p className="text-sm sm:text-base leading-relaxed mt-4 mb-6" style={{ color: '#B0B0B0' }}>
              At Wheelo, we believe that the journey matters as much as the destination. Our mission is to provide Vadodara with access to premium, well-maintained vehicles at transparent prices — backed by honest, prompt service.
            </p>
            <p className="text-sm sm:text-base leading-relaxed mb-8" style={{ color: '#B0B0B0' }}>
              Whether you need a luxury car for a special occasion, an SUV for a family trip, or a bike for your daily commute, we have the right vehicle for you.
            </p>
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: '#FF6B00' }}
            >
              Explore Our Fleet
              <HiArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {VALUES.map((v, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl"
                style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
              >
                <span className="text-2xl mb-3 block">{v.icon}</span>
                <h4 className="text-sm font-semibold text-white mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {v.title}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: '#B0B0B0' }}>{v.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 mb-8" style={{ background: '#111111' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
            Ready to ride with us?
          </h2>
          <p className="text-sm mb-6" style={{ color: '#B0B0B0' }}>
            Browse our fleet or contact us directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/vehicles"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white text-center"
              style={{ background: '#FF6B00' }}
            >
              Browse Vehicles
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-center transition-colors hover:bg-white/10"
              style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
