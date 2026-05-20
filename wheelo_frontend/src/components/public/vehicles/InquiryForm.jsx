import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { FaWhatsapp } from 'react-icons/fa'
import { HiCheck } from 'react-icons/hi'
import { submitInquiry } from '@/api/public'
import { useQuery } from '@tanstack/react-query'
import { getSettings, getVehicles } from '@/api/public'
import { buildWhatsAppUrl } from '@/utils/whatsapp'
import { cn } from '@/utils/cn'

const schema = z.object({
  full_name: z.string().min(2, 'Enter your full name'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian mobile number'),
  email: z.string().email('Enter valid email').optional().or(z.literal('')),
  city: z.string().min(2, 'Enter your city'),
  vehicle: z.string().optional(),
  pickup_date: z.string().min(1, 'Select pickup date'),
  drop_date: z.string().min(1, 'Select drop date'),
  message: z.string().optional(),
}).refine(
  (d) => !d.pickup_date || !d.drop_date || new Date(d.drop_date) >= new Date(d.pickup_date),
  { message: 'Drop date must be after pickup date', path: ['drop_date'] }
)

function Field({ label, error, children, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: '#B0B0B0' }}>
        {label} {required && <span style={{ color: '#FF6B00' }}>*</span>}
      </label>
      {children}
      {error && <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>}
    </div>
  )
}

const inputClass = 'w-full px-4 py-3 rounded-xl text-sm text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-[#FF6B00] transition-all'
const inputStyle = { background: '#0F0F0F', border: '1px solid #2A2A2A' }

export default function InquiryForm({ vehicleId, vehicleName }) {
  const [submitted, setSubmitted] = useState(false)
  const [whatsappData, setWhatsappData] = useState(null)

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings().then((r) => r.data),
    staleTime: Infinity,
  })

  const { data: vehicles } = useQuery({
    queryKey: ['vehicles', 'all'],
    queryFn: () => getVehicles().then((r) => r.data.results ?? r.data),
    enabled: !vehicleId,
  })

  const today = new Date().toISOString().split('T')[0]

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      vehicle: vehicleId ? String(vehicleId) : '',
      pickup_date: '',
      drop_date: '',
    },
  })

  const pickupDate = watch('pickup_date')

  const onSubmit = async (data) => {
    try {
      await submitInquiry({
        ...data,
        ...(vehicleId && { vehicle: vehicleId }),
        phone: data.phone,
        email: data.email || undefined,
        message: data.message || undefined,
      })
      setWhatsappData({ ...data, vehicle_name: vehicleName })
      setSubmitted(true)
    } catch {
      toast.error('Failed to submit inquiry. Please try again.')
    }
  }

  const whatsappUrl = whatsappData && settings?.whatsapp_number
    ? buildWhatsAppUrl(settings.whatsapp_number, whatsappData)
    : null

  return (
    <div className="rounded-2xl p-6" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
      <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
        Send an Inquiry
      </h3>
      <p className="text-xs mb-6" style={{ color: '#B0B0B0' }}>
        Fill in your details and we'll confirm within hours.
      </p>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center py-8 gap-4"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,107,0,0.15)', border: '2px solid #FF6B00' }}
            >
              <HiCheck size={30} style={{ color: '#FF6B00' }} />
            </div>
            <div>
              <p className="text-base font-semibold text-white mb-1">Inquiry Submitted!</p>
              <p className="text-sm" style={{ color: '#B0B0B0' }}>
                We'll contact you shortly to confirm your booking.
              </p>
            </div>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 mt-2"
                style={{ background: '#25D366' }}
              >
                <FaWhatsapp size={18} />
                Continue on WhatsApp
              </a>
            )}
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs underline"
              style={{ color: '#B0B0B0' }}
            >
              Submit another inquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Field label="Full Name" error={errors.full_name?.message} required>
              <input
                {...register('full_name')}
                placeholder="Rahul Sharma"
                className={inputClass}
                style={inputStyle}
              />
            </Field>

            <Field label="Phone Number" error={errors.phone?.message} required>
              <input
                {...register('phone')}
                placeholder="9876543210"
                type="tel"
                inputMode="tel"
                maxLength={10}
                className={inputClass}
                style={inputStyle}
              />
            </Field>

            <Field label="Email" error={errors.email?.message}>
              <input
                {...register('email')}
                placeholder="rahul@email.com"
                type="email"
                inputMode="email"
                className={inputClass}
                style={inputStyle}
              />
            </Field>

            <Field label="City" error={errors.city?.message} required>
              <input
                {...register('city')}
                placeholder="Vadodara"
                className={inputClass}
                style={inputStyle}
              />
            </Field>

            {/* Vehicle select — only shown if not pre-filled */}
            {!vehicleId && (
              <div className="sm:col-span-2">
                <Field label="Vehicle (optional)" error={errors.vehicle?.message}>
                  <select
                    {...register('vehicle')}
                    className={inputClass}
                    style={{ ...inputStyle, color: '#fff' }}
                  >
                    <option value="" style={{ background: '#1A1A1A' }}>Select a vehicle (optional)</option>
                    {vehicles?.map((v) => (
                      <option key={v.id} value={v.id} style={{ background: '#1A1A1A' }}>
                        {v.name} — ₹{Number(v.price_per_day).toLocaleString('en-IN')}/day
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            )}

            <Field label="Pickup Date" error={errors.pickup_date?.message} required>
              <input
                {...register('pickup_date')}
                type="date"
                min={today}
                className={inputClass}
                style={{ ...inputStyle, colorScheme: 'dark' }}
              />
            </Field>

            <Field label="Drop Date" error={errors.drop_date?.message} required>
              <input
                {...register('drop_date')}
                type="date"
                min={pickupDate || today}
                className={inputClass}
                style={{ ...inputStyle, colorScheme: 'dark' }}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Message (optional)" error={errors.message?.message}>
                <textarea
                  {...register('message')}
                  placeholder="Any special requirements..."
                  rows={3}
                  className={cn(inputClass, 'resize-none')}
                  style={inputStyle}
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: '#FF6B00' }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
