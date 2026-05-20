import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { getGallery } from '@/api/public'
import SectionHeading from '@/components/public/ui/SectionHeading'

function Lightbox({ images, index, onClose }) {
  const [current, setCurrent] = useState(index)

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length)
  const next = () => setCurrent((c) => (c + 1) % images.length)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.95)' }}
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10"
        onClick={onClose}
        aria-label="Close"
      >
        <HiX size={22} />
      </button>

      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white hover:bg-white/10"
        onClick={(e) => { e.stopPropagation(); prev() }}
        aria-label="Previous"
      >
        <HiChevronLeft size={26} />
      </button>

      <motion.img
        key={current}
        src={images[current].image_url}
        alt={images[current].caption || `Gallery image ${current + 1}`}
        className="max-w-full max-h-[85vh] rounded-xl object-contain"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      />

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white hover:bg-white/10"
        onClick={(e) => { e.stopPropagation(); next() }}
        aria-label="Next"
      >
        <HiChevronRight size={26} />
      </button>

      <div className="absolute bottom-4 text-sm" style={{ color: '#B0B0B0' }}>
        {current + 1} / {images.length}
        {images[current].caption && (
          <span className="ml-3 text-white">{images[current].caption}</span>
        )}
      </div>
    </motion.div>
  )
}

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null)

  const { data: images, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => getGallery().then((r) => r.data.results ?? r.data),
  })

  return (
    <>
      <Helmet>
        <title>Gallery — Wheelo | Vehicle Rental Vadodara</title>
        <meta name="description" content="Explore Wheelo's vehicle gallery. See our premium fleet of cars, SUVs, bikes and more." />
      </Helmet>

      <div className="py-12 md:py-16 px-4 sm:px-6 lg:px-8" style={{ background: '#111111', borderBottom: '1px solid #2A2A2A' }}>
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            tag="Gallery"
            title="Our Fleet in Action"
            subtitle="A glimpse of the premium vehicles available for rent."
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="w-full rounded-xl animate-pulse break-inside-avoid"
                style={{
                  height: `${180 + (i % 3) * 60}px`,
                  background: '#1A1A1A',
                  border: '1px solid #2A2A2A',
                }}
              />
            ))}
          </div>
        ) : !images?.length ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4">📸</span>
            <p className="text-lg font-semibold text-white mb-2">Gallery coming soon</p>
            <p className="text-sm" style={{ color: '#B0B0B0' }}>Check back later for photos of our fleet.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {images.map((img, i) => (
              <motion.button
                key={img.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.07 }}
                onClick={() => setLightbox(i)}
                className="group w-full break-inside-avoid overflow-hidden rounded-xl block"
                style={{ border: '1px solid #2A2A2A' }}
              >
                <img
                  src={img.image_url}
                  alt={img.caption || `Gallery ${i + 1}`}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox !== null && images && (
          <Lightbox
            images={images}
            index={lightbox}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
