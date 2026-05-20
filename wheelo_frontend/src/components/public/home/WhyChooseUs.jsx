import { motion } from 'framer-motion'
import SectionHeading from '@/components/public/ui/SectionHeading'

const DEFAULT_ITEMS = [
  { icon: '🏆', title: 'Premium Fleet', desc: 'Handpicked luxury vehicles maintained to the highest standards.' },
  { icon: '⚡', title: 'Instant Response', desc: 'Quick inquiry processing and same-day confirmation.' },
  { icon: '🛡️', title: 'Fully Insured', desc: 'All vehicles are comprehensively insured for your peace of mind.' },
  { icon: '💰', title: 'Best Rates', desc: 'Transparent pricing with no hidden charges. Value for money.' },
  { icon: '🗺️', title: 'Pan-City Service', desc: 'Available across Vadodara and surrounding areas.' },
  { icon: '🤝', title: 'Trusted by 500+', desc: 'Hundreds of happy customers across corporate and personal needs.' },
]

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-14">
        <SectionHeading
          tag="Why Wheelo"
          title="Why Choose Us?"
          subtitle="We deliver more than just a vehicle — we deliver an experience."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {DEFAULT_ITEMS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: i * 0.07 }}
            className="group p-6 rounded-2xl transition-all duration-300 hover:border-[#FF6B00]/30"
            style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-colors group-hover:bg-[#FF6B00]/20"
              style={{ background: '#2A2A2A' }}
            >
              {item.icon}
            </div>
            <h3
              className="text-base font-semibold text-white mb-2"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: '#B0B0B0' }}>
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
