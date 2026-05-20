import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getVehicles } from '@/api/public'
import SectionHeading from '@/components/public/ui/SectionHeading'
import VehicleCard from '@/components/public/ui/VehicleCard'
import { HiArrowRight } from 'react-icons/hi'

function VehicleCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
      <div className="aspect-[16/9]" style={{ background: '#2A2A2A' }} />
      <div className="p-4 space-y-2">
        <div className="h-4 rounded w-3/4" style={{ background: '#2A2A2A' }} />
        <div className="h-3 rounded w-1/2" style={{ background: '#2A2A2A' }} />
        <div className="h-6 rounded w-1/3 mt-3" style={{ background: '#2A2A2A' }} />
      </div>
    </div>
  )
}

export default function FeaturedVehicles() {
  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', 'featured'],
    queryFn: () => getVehicles({ is_featured: true, limit: 6 }).then((r) => r.data.results ?? r.data),
  })

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <SectionHeading
          tag="Our Fleet"
          title="Featured Vehicles"
          subtitle="Choose from our handpicked selection of premium vehicles for any occasion."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <VehicleCardSkeleton key={i} />)
          : data?.map((vehicle, i) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
            ))}
      </div>

      <div className="text-center mt-10">
        <Link
          to="/vehicles"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{ background: '#FF6B00', color: '#fff' }}
        >
          View All Vehicles
          <HiArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}
