import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { getBanners } from '@/api/public'
import { HiArrowRight, HiChevronLeft, HiChevronRight } from 'react-icons/hi'

const FALLBACK = [
  {
    id: 1,
    title: 'Your Ride,\nAnytime.',
    subtitle: 'Premium vehicle rentals in Vadodara. Luxury, comfort, and freedom on every road.',
    image_url: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1920&q=80',
    cta_text: 'Explore Vehicles',
    cta_link: '/vehicles',
  },
]

export default function HeroSection() {
  const { data: banners } = useQuery({
    queryKey: ['banners'],
    queryFn: () => getBanners().then((r) => r.data),
  })

  const slides = banners?.length ? banners : FALLBACK
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [slides.length])

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length)
  const next = () => setCurrent((c) => (c + 1) % slides.length)

  const slide = slides[current]

  return (
    <section className="relative h-[100svh] min-h-[600px] overflow-hidden">
      {/* Background image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={slide.image_url}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to right, rgba(15,15,15,0.85) 0%, rgba(15,15,15,0.4) 60%, rgba(15,15,15,0.2) 100%)'
          }} />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, rgba(15,15,15,0.7) 0%, transparent 50%)'
          }} />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-2xl"
          >
            {/* Tag */}
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1.5 rounded-full"
              style={{ color: '#FF6B00', background: 'rgba(255,107,0,0.12)', border: '1px solid rgba(255,107,0,0.3)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              Premium Vehicle Rental · Vadodara
            </motion.span>

            <h1
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-4"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              {slide.title.split('\n').map((line, i) => (
                <span key={i} className="block">
                  {i === 1
                    ? <span style={{ color: '#FF6B00' }}>{line}</span>
                    : line}
                </span>
              ))}
            </h1>

            <p className="text-base sm:text-lg mb-8 max-w-lg leading-relaxed" style={{ color: '#B0B0B0' }}>
              {slide.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={slide.cta_link || '/vehicles'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: '#FF6B00' }}
              >
                {slide.cta_text || 'Explore Vehicles'}
                <HiArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold transition-all hover:bg-white/10 active:scale-95"
                style={{ color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide controls */}
        {slides.length > 1 && (
          <div className="absolute bottom-8 left-4 sm:left-8 lg:left-16 flex items-center gap-3 z-20">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
              aria-label="Previous"
            >
              <HiChevronLeft size={20} />
            </button>
            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? '24px' : '8px',
                    background: i === current ? '#FF6B00' : 'rgba(255,255,255,0.3)',
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
              aria-label="Next"
            >
              <HiChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
