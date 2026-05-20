import { motion } from 'framer-motion'

export default function SectionHeading({ tag, title, subtitle, center = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className={center ? 'text-center' : ''}
    >
      {tag && (
        <span
          className="inline-block text-xs font-semibold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
          style={{ color: '#FF6B00', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)' }}
        >
          {tag}
        </span>
      )}
      <h2
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4"
        style={{ fontFamily: 'Sora, sans-serif' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base max-w-xl leading-relaxed" style={{ color: '#B0B0B0', margin: center ? '0 auto' : undefined }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
