import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiArrowLeft, HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { getVehicle, getVehicles } from '@/api/public'
import InquiryForm from '@/components/public/vehicles/InquiryForm'
import VehicleCard from '@/components/public/ui/VehicleCard'
import SectionHeading from '@/components/public/ui/SectionHeading'
import { AVAILABILITY } from '@/constants'

function ImageGallery({ images, name }) {
  const [active, setActive] = useState(0)

  if (!images?.length) {
    return (
      <div className="aspect-[16/9] rounded-2xl flex items-center justify-center text-6xl" style={{ background: '#1A1A1A' }}>
        🚗
      </div>
    )
  }

  const prev = () => setActive((a) => (a - 1 + images.length) % images.length)
  const next = () => setActive((a) => (a + 1) % images.length)

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden" style={{ background: '#1A1A1A' }}>
        <motion.img
          key={active}
          src={images[active].image_url}
          alt={`${name} - image ${active + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          loading="eager"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-black/60"
              style={{ background: 'rgba(0,0,0,0.4)' }}
            >
              <HiChevronLeft size={20} className="text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-black/60"
              style={{ background: 'rgba(0,0,0,0.4)' }}
            >
              <HiChevronRight size={20} className="text-white" />
            </button>
            <span
              className="absolute bottom-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}
            >
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className="shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all"
              style={{
                border: i === active ? '2px solid #FF6B00' : '2px solid transparent',
                opacity: i === active ? 1 : 0.5,
              }}
            >
              <img src={img.image_url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SpecItem({ label, value }) {
  if (!value) return null
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #2A2A2A' }}>
      <span className="text-sm" style={{ color: '#B0B0B0' }}>{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="animate-pulse max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-4 rounded w-32 mb-8" style={{ background: '#2A2A2A' }} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-[16/9] rounded-2xl" style={{ background: '#1A1A1A' }} />
        <div className="space-y-4">
          <div className="h-8 rounded w-3/4" style={{ background: '#2A2A2A' }} />
          <div className="h-4 rounded w-1/2" style={{ background: '#2A2A2A' }} />
          <div className="h-20 rounded" style={{ background: '#2A2A2A' }} />
        </div>
      </div>
    </div>
  )
}

export default function VehicleDetail() {
  const { slug } = useParams()

  const { data: vehicle, isLoading, isError } = useQuery({
    queryKey: ['vehicle', slug],
    queryFn: () => getVehicle(slug).then((r) => r.data),
  })

  const { data: similar } = useQuery({
    queryKey: ['vehicles', 'similar', vehicle?.category],
    queryFn: () =>
      getVehicles({ category: vehicle.category_slug, limit: 3 }).then((r) =>
        (r.data.results ?? r.data).filter((v) => v.slug !== slug)
      ),
    enabled: !!vehicle?.category_slug,
  })

  if (isLoading) return <DetailSkeleton />

  if (isError || !vehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <span className="text-5xl mb-4">🚗</span>
        <h2 className="text-xl font-bold text-white mb-2">Vehicle not found</h2>
        <Link
          to="/vehicles"
          className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: '#FF6B00' }}
        >
          Browse All Vehicles
        </Link>
      </div>
    )
  }

  const availability = AVAILABILITY[vehicle.availability] || AVAILABILITY.available
  const specs = vehicle.specs || {}

  return (
    <>
      <Helmet>
        <title>{vehicle.name} — Wheelo Vehicle Rental Vadodara</title>
        <meta name="description" content={`Rent ${vehicle.name} in Vadodara. ₹${vehicle.price_per_day}/day. ${vehicle.description?.slice(0, 120)}`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Back */}
        <Link
          to="/vehicles"
          className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors hover:text-white"
          style={{ color: '#B0B0B0' }}
        >
          <HiArrowLeft size={16} />
          Back to Vehicles
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left — gallery */}
          <div>
            <ImageGallery images={vehicle.images} name={vehicle.name} />
          </div>

          {/* Right — info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-5"
          >
            {/* Category + availability */}
            <div className="flex items-center gap-2 flex-wrap">
              {vehicle.category_name && (
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(255,107,0,0.1)', color: '#FF6B00', border: '1px solid rgba(255,107,0,0.2)' }}
                >
                  {vehicle.category_name}
                </span>
              )}
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${availability.color}`}
                style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {availability.label}
              </span>
            </div>

            {/* Name */}
            <h1
              className="text-2xl sm:text-3xl font-bold text-white"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              {vehicle.name}
            </h1>

            {/* Price */}
            <div className="flex items-end gap-2">
              <span
                className="text-3xl font-bold"
                style={{ color: '#FF6B00', fontFamily: 'Sora, sans-serif' }}
              >
                ₹{Number(vehicle.price_per_day).toLocaleString('en-IN')}
              </span>
              <span className="text-sm pb-1" style={{ color: '#B0B0B0' }}>/day</span>
            </div>

            {/* Description */}
            {vehicle.description && (
              <p className="text-sm leading-relaxed" style={{ color: '#B0B0B0' }}>
                {vehicle.description}
              </p>
            )}

            {/* Specs */}
            {Object.keys(specs).length > 0 && (
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2A2A2A' }}>
                <div className="px-4 py-3" style={{ background: '#111', borderBottom: '1px solid #2A2A2A' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#FF6B00' }}>
                    Specifications
                  </p>
                </div>
                <div className="px-4" style={{ background: '#1A1A1A' }}>
                  {Object.entries(specs).map(([key, val]) => (
                    <SpecItem
                      key={key}
                      label={key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      value={val}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Inquiry form */}
        <div className="max-w-2xl">
          <InquiryForm vehicleId={vehicle.id} vehicleName={vehicle.name} />
        </div>

        {/* Similar vehicles */}
        {similar?.length > 0 && (
          <div className="mt-16">
            <SectionHeading
              tag="More Options"
              title="Similar Vehicles"
              center={false}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
              {similar.slice(0, 3).map((v, i) => (
                <VehicleCard key={v.id} vehicle={v} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
