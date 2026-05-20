import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/api/public'
import SectionHeading from '@/components/public/ui/SectionHeading'

export default function CategoriesSection() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then((r) => r.data),
  })

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#111111' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <SectionHeading
            tag="Browse by Type"
            title="Vehicle Categories"
            subtitle="Find the perfect vehicle for your journey, whatever the occasion."
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl p-6 animate-pulse" style={{ background: '#1A1A1A' }}>
                  <div className="w-10 h-10 rounded-lg mb-3" style={{ background: '#2A2A2A' }} />
                  <div className="h-3 rounded w-3/4" style={{ background: '#2A2A2A' }} />
                </div>
              ))
            : categories?.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    to={`/vehicles?category=${cat.slug}`}
                    className="group flex flex-col items-center text-center p-5 rounded-2xl transition-all duration-300 hover:border-[#FF6B00]/50"
                    style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
                  >
                    <span className="text-3xl mb-3">{cat.icon || '🚗'}</span>
                    <span className="text-sm font-medium text-white group-hover:text-[#FF6B00] transition-colors">
                      {cat.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  )
}
