import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { HiSearch, HiX, HiFilter } from 'react-icons/hi'
import { getVehicles, getCategories } from '@/api/public'
import VehicleCard from '@/components/public/ui/VehicleCard'

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

function FilterSidebar({ categories, categoryParam, availabilityParam, setFilter, clearAll, hasFilters }) {
  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#FF6B00' }}>
          Category
        </p>
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => setFilter('category', '')}
            className="text-left px-3 py-2 rounded-lg text-sm transition-all font-medium"
            style={{
              color: !categoryParam ? '#FF6B00' : '#B0B0B0',
              background: !categoryParam ? 'rgba(255,107,0,0.12)' : 'transparent',
            }}
          >
            All Vehicles
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter('category', cat.slug)}
              className="text-left px-3 py-2 rounded-lg text-sm transition-all"
              style={{
                color: categoryParam === cat.slug ? '#FF6B00' : '#B0B0B0',
                background: categoryParam === cat.slug ? 'rgba(255,107,0,0.12)' : 'transparent',
                fontWeight: categoryParam === cat.slug ? 600 : 400,
              }}
            >
              <span className="mr-2">{cat.icon}</span>{cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: '#2A2A2A' }} />

      {/* Availability */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#FF6B00' }}>
          Availability
        </p>
        <div className="flex flex-col gap-0.5">
          {AVAILABILITY_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter('availability', f.value)}
              className="text-left px-3 py-2 rounded-lg text-sm transition-all"
              style={{
                color: availabilityParam === f.value ? '#FF6B00' : '#B0B0B0',
                background: availabilityParam === f.value ? 'rgba(255,107,0,0.12)' : 'transparent',
                fontWeight: availabilityParam === f.value ? 600 : 400,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <>
          <div style={{ height: 1, background: '#2A2A2A' }} />
          <button
            onClick={clearAll}
            className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:opacity-80"
            style={{ color: '#B0B0B0', border: '1px solid #2A2A2A' }}
          >
            <HiX size={14} /> Clear Filters
          </button>
        </>
      )}
    </div>
  )
}

export default function Vehicles() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const categoryParam = searchParams.get('category') || ''
  const availabilityParam = searchParams.get('availability') || ''

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then((r) => r.data.results ?? r.data),
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

  const clearAll = () => { setSearchParams({}); setSearch('') }
  const hasFilters = categoryParam || availabilityParam || search

  return (
    <>
      <Helmet>
        <title>Vehicles — Wheelo | Premium Vehicle Rental Vadodara</title>
        <meta name="description" content="Browse Wheelo's premium vehicle fleet. Cars, SUVs, bikes, vans and more available for rental in Vadodara." />
      </Helmet>

      {/* Page hero — static, no whileInView to avoid navbar overlap */}
      <div
        className="px-4 sm:px-6 lg:px-8 py-10 md:py-14"
        style={{
          background: 'linear-gradient(180deg, #111111 0%, #0F0F0F 100%)',
          borderBottom: '1px solid #1E1E1E',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
            style={{ color: '#FF6B00', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)' }}
          >
            Our Fleet
          </span>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            All Vehicles
          </h1>
          <p className="text-sm sm:text-base max-w-lg" style={{ color: '#B0B0B0' }}>
            Browse our complete collection of premium vehicles. Filter by type or availability.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top bar: search + mobile filter toggle */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2" size={17} style={{ color: '#B0B0B0' }} />
            <input
              type="search"
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-[#FF6B00] transition-all"
              style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#B0B0B0' }}
              >
                <HiX size={16} />
              </button>
            )}
          </div>

          {/* Mobile filter button */}
          <button
            onClick={() => setShowMobileFilters((v) => !v)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium relative"
            style={{ background: '#1A1A1A', border: `1px solid ${hasFilters ? '#FF6B00' : '#2A2A2A'}`, color: hasFilters ? '#FF6B00' : '#B0B0B0' }}
          >
            <HiFilter size={17} />
            <span className="hidden sm:inline">Filters</span>
            {hasFilters && (
              <span
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                style={{ background: '#FF6B00' }}
              >
                {(categoryParam ? 1 : 0) + (availabilityParam ? 1 : 0) + (search ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-5">
            {categoryParam && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'rgba(255,107,0,0.15)', color: '#FF6B00', border: '1px solid rgba(255,107,0,0.3)' }}
              >
                {categories?.find((c) => c.slug === categoryParam)?.name || categoryParam}
                <button onClick={() => setFilter('category', '')}><HiX size={11} /></button>
              </span>
            )}
            {availabilityParam && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'rgba(255,107,0,0.15)', color: '#FF6B00', border: '1px solid rgba(255,107,0,0.3)' }}
              >
                {AVAILABILITY_FILTERS.find((f) => f.value === availabilityParam)?.label}
                <button onClick={() => setFilter('availability', '')}><HiX size={11} /></button>
              </span>
            )}
            {search && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'rgba(255,107,0,0.15)', color: '#FF6B00', border: '1px solid rgba(255,107,0,0.3)' }}
              >
                "{search}"
                <button onClick={() => setSearch('')}><HiX size={11} /></button>
              </span>
            )}
          </div>
        )}

        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside
            className="hidden lg:block w-52 shrink-0"
          >
            <div
              className="sticky top-24 p-5 rounded-2xl"
              style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
            >
              <FilterSidebar
                categories={categories}
                categoryParam={categoryParam}
                availabilityParam={availabilityParam}
                setFilter={setFilter}
                clearAll={clearAll}
                hasFilters={!!hasFilters}
              />
            </div>
          </aside>

          {/* Mobile filter panel */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="lg:hidden fixed inset-0 z-40 flex items-end"
                style={{ background: 'rgba(0,0,0,0.7)' }}
                onClick={() => setShowMobileFilters(false)}
              >
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="w-full rounded-t-2xl p-6"
                  style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', maxHeight: '80vh', overflowY: 'auto' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-5">
                    <p className="font-semibold text-white">Filters</p>
                    <button onClick={() => setShowMobileFilters(false)} style={{ color: '#B0B0B0' }}>
                      <HiX size={20} />
                    </button>
                  </div>
                  <FilterSidebar
                    categories={categories}
                    categoryParam={categoryParam}
                    availabilityParam={availabilityParam}
                    setFilter={(k, v) => { setFilter(k, v); setShowMobileFilters(false) }}
                    clearAll={() => { clearAll(); setShowMobileFilters(false) }}
                    hasFilters={!!hasFilters}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vehicle grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <VehicleCardSkeleton key={i} />)}
              </div>
            ) : !data?.length ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-5"
                  style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
                >
                  🚗
                </div>
                <p className="text-lg font-semibold text-white mb-2">No vehicles found</p>
                <p className="text-sm mb-6" style={{ color: '#B0B0B0' }}>
                  Try adjusting your filters or search term.
                </p>
                <button
                  onClick={clearAll}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: '#FF6B00' }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm mb-5" style={{ color: '#B0B0B0' }}>
                  Showing <span className="text-white font-semibold">{data.length}</span> {data.length === 1 ? 'vehicle' : 'vehicles'}
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
