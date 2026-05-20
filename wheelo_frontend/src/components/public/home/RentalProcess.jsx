import { motion } from 'framer-motion'
import SectionHeading from '@/components/public/ui/SectionHeading'

const STEPS = [
  { step: '01', icon: '🔍', title: 'Browse Vehicles', desc: 'Explore our premium fleet and find your perfect ride.' },
  { step: '02', icon: '📝', title: 'Submit Inquiry', desc: 'Fill out a quick form with your dates and requirements.' },
  { step: '03', icon: '📞', title: 'Get Confirmed', desc: 'Our team contacts you and confirms availability.' },
  { step: '04', icon: '🚗', title: 'Hit the Road', desc: 'Pick up your vehicle and enjoy the journey.' },
]

export default function RentalProcess() {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#111111' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <SectionHeading
            tag="How It Works"
            title="Simple Rental Process"
            subtitle="Get on the road in 4 easy steps."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line — desktop only */}
          <div
            className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px"
            style={{ background: 'linear-gradient(to right, transparent, #FF6B00, #FF6B00, transparent)' }}
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col items-center text-center p-6 rounded-2xl"
              style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
            >
              {/* Step number */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 relative z-10"
                style={{ background: '#0F0F0F', border: '2px solid #FF6B00' }}
              >
                {step.icon}
              </div>
              <span
                className="absolute top-4 right-4 text-xs font-bold"
                style={{ color: '#FF6B00', opacity: 0.4 }}
              >
                {step.step}
              </span>
              <h3
                className="text-sm font-semibold text-white mb-2"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: '#B0B0B0' }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
