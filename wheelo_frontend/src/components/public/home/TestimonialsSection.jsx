import { useQuery } from '@tanstack/react-query'
import { getTestimonials } from '@/api/public'
import { motion } from 'framer-motion'
import { HiStar } from 'react-icons/hi'
import SectionHeading from '@/components/public/ui/SectionHeading'

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <HiStar
          key={i}
          size={14}
          style={{ color: i < rating ? '#FF6B00' : '#2A2A2A' }}
        />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const { data: testimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => getTestimonials().then((r) => r.data.results ?? r.data),
  })

  if (!testimonials?.length) return null

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <SectionHeading
          tag="Testimonials"
          title="What Our Customers Say"
          subtitle="Real experiences from real customers."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="p-6 rounded-2xl flex flex-col gap-4"
            style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
          >
            <StarRating rating={t.rating} />
            <p className="text-sm leading-relaxed flex-1" style={{ color: '#B0B0B0' }}>
              "{t.content}"
            </p>
            <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid #2A2A2A' }}>
              {t.image_url ? (
                <img src={t.image_url} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold"
                  style={{ background: '#FF6B00', color: '#fff' }}
                >
                  {t.name[0]}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-white">{t.name}</p>
                {t.role && <p className="text-xs" style={{ color: '#B0B0B0' }}>{t.role}</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
