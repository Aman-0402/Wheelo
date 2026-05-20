import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { HiPlus, HiPencil, HiTrash, HiPhotograph } from 'react-icons/hi'
import {
  getAdminVehicles, getAdminCategories, createVehicle, updateVehicle,
  deleteVehicle, uploadVehicleImage, deleteVehicleImage,
} from '@/api/admin'
import AdminTable from '@/components/admin/ui/AdminTable'
import AdminModal from '@/components/admin/ui/AdminModal'
import AdminBtn from '@/components/admin/ui/AdminBtn'
import { AdminField, AdminInput, AdminTextarea, AdminSelect } from '@/components/admin/ui/AdminField'
import { AVAILABILITY } from '@/constants'

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  category: z.string().optional(),
  description: z.string().optional(),
  price_per_day: z.string().min(1, 'Price required'),
  availability: z.enum(['available', 'rented', 'maintenance']),
  is_featured: z.boolean().optional(),
  specs: z.string().optional(),
})

function VehicleForm({ vehicle, categories, onClose }) {
  const qc = useQueryClient()
  const isEdit = !!vehicle

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: vehicle?.name || '',
      category: vehicle?.category ? String(vehicle.category) : '',
      description: vehicle?.description || '',
      price_per_day: vehicle?.price_per_day ? String(vehicle.price_per_day) : '',
      availability: vehicle?.availability || 'available',
      is_featured: vehicle?.is_featured || false,
      specs: vehicle?.specs ? JSON.stringify(vehicle.specs, null, 2) : '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? updateVehicle(vehicle.id, data) : createVehicle(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-vehicles'] })
      toast.success(isEdit ? 'Vehicle updated.' : 'Vehicle created.')
      onClose()
    },
    onError: () => toast.error('Failed to save vehicle.'),
  })

  const onSubmit = (data) => {
    let specs = {}
    try { if (data.specs) specs = JSON.parse(data.specs) } catch { specs = {} }
    mutation.mutate({
      ...data,
      specs,
      category: data.category || null,
      price_per_day: parseFloat(data.price_per_day),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <AdminField label="Vehicle Name" error={errors.name?.message} required>
            <AdminInput {...register('name')} placeholder="Toyota Innova Crysta" />
          </AdminField>
        </div>
        <AdminField label="Category" error={errors.category?.message}>
          <AdminSelect {...register('category')}>
            <option value="" style={{ background: '#1A1A1A' }}>None</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id} style={{ background: '#1A1A1A' }}>{c.name}</option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label="Price / Day (₹)" error={errors.price_per_day?.message} required>
          <AdminInput {...register('price_per_day')} type="number" placeholder="2500" />
        </AdminField>
        <AdminField label="Availability" error={errors.availability?.message}>
          <AdminSelect {...register('availability')}>
            {Object.entries(AVAILABILITY).map(([val, { label }]) => (
              <option key={val} value={val} style={{ background: '#1A1A1A' }}>{label}</option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label="Featured">
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: '#B0B0B0' }}>
            <input type="checkbox" {...register('is_featured')} className="accent-[#FF6B00]" />
            Show in featured section
          </label>
        </AdminField>
        <div className="col-span-2">
          <AdminField label="Description">
            <AdminTextarea {...register('description')} placeholder="Brief description of the vehicle..." rows={3} />
          </AdminField>
        </div>
        <div className="col-span-2">
          <AdminField label="Specifications (JSON)" error={errors.specs?.message}>
            <AdminTextarea
              {...register('specs')}
              rows={4}
              placeholder={'{\n  "Fuel": "Diesel",\n  "Seats": "7",\n  "Transmission": "Automatic"\n}'}
            />
          </AdminField>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <AdminBtn variant="ghost" onClick={onClose}>Cancel</AdminBtn>
        <AdminBtn type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Vehicle' : 'Create Vehicle'}
        </AdminBtn>
      </div>
    </form>
  )
}

function ImageManager({ vehicle, onClose }) {
  const qc = useQueryClient()

  const uploadMutation = useMutation({
    mutationFn: (file) => {
      const fd = new FormData()
      fd.append('vehicle', vehicle.id)
      fd.append('image', file)
      fd.append('is_primary', vehicle.images?.length === 0 ? 'true' : 'false')
      return uploadVehicleImage(fd)
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-vehicles'] }); toast.success('Image uploaded.') },
    onError: () => toast.error('Upload failed.'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteVehicleImage,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-vehicles'] }); toast.success('Image deleted.') },
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {vehicle.images?.map((img) => (
          <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-video" style={{ background: '#111' }}>
            <img src={img.image_url} alt="" className="w-full h-full object-cover" />
            {img.is_primary && (
              <span className="absolute top-1 left-1 text-xs px-1.5 py-0.5 rounded" style={{ background: '#FF6B00', color: '#fff' }}>
                Primary
              </span>
            )}
            <button
              onClick={() => deleteMutation.mutate(img.id)}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(0,0,0,0.6)', color: '#ef4444' }}
            >
              <HiTrash size={20} />
            </button>
          </div>
        ))}
      </div>
      <label
        className="flex flex-col items-center justify-center gap-2 py-6 rounded-xl cursor-pointer border-2 border-dashed transition-colors hover:border-[#FF6B00]"
        style={{ borderColor: '#2A2A2A', color: '#B0B0B0' }}
      >
        <HiPhotograph size={24} />
        <span className="text-sm">Click to upload image</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && uploadMutation.mutate(e.target.files[0])}
        />
      </label>
      <div className="flex justify-end">
        <AdminBtn variant="ghost" onClick={onClose}>Close</AdminBtn>
      </div>
    </div>
  )
}

export default function AdminVehicles() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null) // null | { type: 'form'|'images', vehicle?: obj }

  const { data, isLoading } = useQuery({
    queryKey: ['admin-vehicles'],
    queryFn: () => getAdminVehicles().then((r) => r.data.results ?? r.data),
  })

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => getAdminCategories().then((r) => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-vehicles'] }); toast.success('Vehicle deleted.') },
    onError: () => toast.error('Delete failed.'),
  })

  const confirmDelete = (vehicle) => {
    if (window.confirm(`Delete "${vehicle.name}"? This cannot be undone.`)) {
      deleteMutation.mutate(vehicle.id)
    }
  }

  const columns = [
    {
      key: 'name', label: 'Vehicle',
      render: (v, row) => (
        <div className="flex items-center gap-3">
          {row.images?.[0]?.image_url ? (
            <img src={row.images[0].image_url} alt="" className="w-10 h-7 object-cover rounded" />
          ) : (
            <div className="w-10 h-7 rounded flex items-center justify-center text-base" style={{ background: '#2A2A2A' }}>🚗</div>
          )}
          <span className="text-white font-medium">{v}</span>
        </div>
      ),
    },
    { key: 'category_name', label: 'Category', render: (v) => v || '—' },
    {
      key: 'price_per_day', label: 'Price/Day',
      render: (v) => <span className="font-semibold" style={{ color: '#FF6B00' }}>₹{Number(v).toLocaleString('en-IN')}</span>,
    },
    {
      key: 'availability', label: 'Status',
      render: (v) => (
        <span className={`text-xs font-semibold ${AVAILABILITY[v]?.color || 'text-gray-400'}`}>
          {AVAILABILITY[v]?.label || v}
        </span>
      ),
    },
    {
      key: 'is_featured', label: 'Featured',
      render: (v) => v
        ? <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,107,0,0.15)', color: '#FF6B00' }}>Yes</span>
        : <span className="text-xs" style={{ color: '#B0B0B0' }}>No</span>,
    },
    {
      key: 'id', label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <AdminBtn size="sm" variant="ghost" onClick={() => setModal({ type: 'images', vehicle: row })}>
            <HiPhotograph size={14} /> Images
          </AdminBtn>
          <AdminBtn size="sm" variant="ghost" onClick={() => setModal({ type: 'form', vehicle: row })}>
            <HiPencil size={14} />
          </AdminBtn>
          <AdminBtn size="sm" variant="danger" onClick={() => confirmDelete(row)}>
            <HiTrash size={14} />
          </AdminBtn>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: '#B0B0B0' }}>
          {data?.length ?? 0} vehicles total
        </p>
        <AdminBtn onClick={() => setModal({ type: 'form' })}>
          <HiPlus size={16} /> Add Vehicle
        </AdminBtn>
      </div>

      {isLoading ? (
        <div className="h-48 rounded-2xl animate-pulse" style={{ background: '#1A1A1A' }} />
      ) : (
        <AdminTable columns={columns} data={data} emptyText="No vehicles yet. Add your first vehicle." />
      )}

      <AdminModal
        open={modal?.type === 'form'}
        onClose={() => setModal(null)}
        title={modal?.vehicle ? 'Edit Vehicle' : 'Add Vehicle'}
        width="max-w-2xl"
      >
        {modal?.type === 'form' && (
          <VehicleForm vehicle={modal.vehicle} categories={categories} onClose={() => setModal(null)} />
        )}
      </AdminModal>

      <AdminModal
        open={modal?.type === 'images'}
        onClose={() => setModal(null)}
        title={`Images — ${modal?.vehicle?.name}`}
        width="max-w-xl"
      >
        {modal?.type === 'images' && (
          <ImageManager vehicle={modal.vehicle} onClose={() => setModal(null)} />
        )}
      </AdminModal>
    </div>
  )
}
