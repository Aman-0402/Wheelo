import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi'
import { AVAILABILITY } from '@/constants'

export default function VehicleCard({ vehicle, index = 0 }) {
  const availability = AVAILABILITY[vehicle.availability] || AVAILABILITY.available
  const primaryImage = vehicle.images?.find((img) => img.is_primary) || vehicle.images?.[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
    >
      <Link
        to={`/vehicles/${vehicle.slug}`}
        className="group block rounded-2xl overflow-hidden transition-transform duration-300 hover:-translate-y-1"
        style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
      >
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-[#111]">
          {primaryImage ? (
            <img
              src={primaryImage.image_url}
              alt={vehicle.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #111 100%)' }}
            >
              <span className="text-5xl opacity-30">🚗</span>
              <span className="text-xs font-medium" style={{ color: '#3A3A3A' }}>No image</span>
            </div>
          )}

          {/* Availability badge */}
          <span
            className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${availability.color}`}
            style={{ background: 'rgba(0,0,0,0.6)' }}
          >
            {availability.label}
          </span>

          {/* Category badge */}
          {vehicle.category_name && (
            <span
              className="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(255,107,0,0.15)', color: '#FF6B00', border: '1px solid rgba(255,107,0,0.3)' }}
            >
              {vehicle.category_name}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3
            className="text-base font-semibold text-white mb-1 truncate"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            {vehicle.name}
          </h3>

          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-xs" style={{ color: '#B0B0B0' }}>Starting from</span>
              <p className="text-lg font-bold" style={{ color: '#FF6B00', fontFamily: 'Sora, sans-serif' }}>
                ₹{Number(vehicle.price_per_day).toLocaleString('en-IN')}
                <span className="text-xs font-normal text-[#B0B0B0] ml-1">/day</span>
              </p>
            </div>
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors group-hover:bg-[#FF6B00]"
              style={{ background: '#2A2A2A' }}
            >
              <HiArrowRight size={16} className="text-white" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
