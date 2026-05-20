import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiSearch, HiAdjustments, HiX } from 'react-icons/hi'
import { getVehicles, getCategories } from '@/api/public'
import VehicleCard from '@/components/public/ui/VehicleCard'
import SectionHeading from '@/components/public/ui/SectionHeading'

const AVAILABILITY_FILTERS = [
  { value: '', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'rented', label: 'Rented Out' },
  { value: 'maintenance', label: 'Maintenance' },
]

function VehicleCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
      <div className="aspect-[16/9]" style={{ background: '#2A2A2A' }} />
      <div className="p-4 space-y-3">
        <div className="h-4 rounded w-3/4" style={{ background: '#2A2A2A' }} />
        <div className="h-3 rounded w-1/2" style={{ background: '#2A2A2A' }} />
        <div className="h-6 rounded w-1/3 mt-2" style={{ background: '#2A2A2A' }} />
      </div>
    </div>
  )
}

export default function Vehicles() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const categoryParam = searchParams.get('category') || ''
  const availabilityParam = searchParams.get('availability') || ''

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then((r) => r.data),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', categoryParam, availabilityParam, search],
    queryFn: () =>
      getVehicles({
        ...(categoryParam && { category: categoryParam }),
        ...(availabilityParam && { availability: availabilityParam }),
        ...(search && { search }),
      }).then((r) => r.data.results ?? r.data),
    keepPreviousData: true,
  })

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  const clearAll = () => setSearchParams({})

  const hasFilters = categoryParam || availabilityParam || search

  return (
    <>
      <Helmet>
        <title>Vehicles — Wheelo | Premium Vehicle Rental Vadodara</title>
        <meta name="description" content="Browse Wheelo's premium vehicle fleet. Cars, SUVs, bikes, vans and more available for rental in Vadodara." />
      </Helmet>

      {/* Page header */}
      <div className="py-12 md:py-16 px-4 sm:px-6 lg:px-8" style={{ background: '#111111', borderBottom: '1px solid #2A2A2A' }}>
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            tag="Our Fleet"
            title="All Vehicles"
            subtitle="Browse our complete collection of premium vehicles. Filter by type or availability."
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]" size={18} />
            <input
              type="search"
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-[#B0B0B0] outline-none focus:ring-1 focus:ring-[#FF6B00]"
              style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
            />
          </div>

          {/* Filter toggle — mobile */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="sm:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white"
            style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
          >
            <HiAdjustments size={18} />
            Filters
            {hasFilters && (
              <span className="w-2 h-2 rounded-full" style={{ background: '#FF6B00' }} />
            )}
          </button>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={clearAll}
              className="hidden sm:flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:text-white"
              style={{ color: '#B0B0B0', border: '1px solid #2A2A2A' }}
            >
              <HiX size={16} />
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar filters — desktop always visible, mobile togglable */}
          <motion.aside
            initial={false}
            animate={{ height: showFilters || window.innerWidth >= 1024 ? 'auto' : 0 }}
            className="lg:w-56 shrink-0 overflow-hidden lg:overflow-visible"
          >
            <div
              className="p-4 rounded-2xl space-y-6 sm:block"
              style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
            >
              {/* Category filter */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#FF6B00' }}>
                  Category
                </p>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setFilter('category', '')}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${!categoryParam ? 'text-white font-medium' : 'hover:text-white'}`}
                    style={{
                      color: !categoryParam ? '#FF6B00' : '#B0B0B0',
                      background: !categoryParam ? 'rgba(255,107,0,0.1)' : 'transparent',
                    }}
                  >
                    All
                  </button>
                  {categories?.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFilter('category', cat.slug)}
                      className="text-left px-3 py-2 rounded-lg text-sm transition-colors"
                      style={{
                        color: categoryParam === cat.slug ? '#FF6B00' : '#B0B0B0',
                        background: categoryParam === cat.slug ? 'rgba(255,107,0,0.1)' : 'transparent',
                      }}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability filter */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#FF6B00' }}>
                  Availability
                </p>
                <div className="flex flex-col gap-1">
                  {AVAILABILITY_FILTERS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFilter('availability', f.value)}
                      className="text-left px-3 py-2 rounded-lg text-sm transition-colors"
                      style={{
                        color: availabilityParam === f.value ? '#FF6B00' : '#B0B0B0',
                        background: availabilityParam === f.value ? 'rgba(255,107,0,0.1)' : 'transparent',
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile clear */}
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="lg:hidden w-full py-2 rounded-lg text-sm font-medium text-center transition-colors hover:text-white"
                  style={{ color: '#B0B0B0', border: '1px solid #2A2A2A' }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </motion.aside>

          {/* Vehicle grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <VehicleCardSkeleton key={i} />)}
              </div>
            ) : !data?.length ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="text-5xl mb-4">🚗</span>
                <p className="text-lg font-semibold text-white mb-2">No vehicles found</p>
                <p className="text-sm mb-6" style={{ color: '#B0B0B0' }}>
                  Try adjusting your filters or search term.
                </p>
                <button
                  onClick={clearAll}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: '#FF6B00' }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm mb-5" style={{ color: '#B0B0B0' }}>
                  Showing <span className="text-white font-medium">{data.length}</span> vehicles
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {data.map((vehicle, i) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
