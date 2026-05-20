import { motion } from 'framer-motion'

export default function StatCard({ label, value, icon, color = '#FF6B00', index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="p-5 rounded-2xl flex items-center gap-4"
      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
        style={{ background: `${color}15`, color }}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
          {value ?? '—'}
        </p>
        <p className="text-xs" style={{ color: '#B0B0B0' }}>{label}</p>
      </div>
    </motion.div>
  )
}
