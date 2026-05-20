import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { HiPlus, HiPencil, HiTrash, HiPhotograph } from 'react-icons/hi'
import { getBanners, createBanner, updateBanner, deleteBanner } from '@/api/admin'
import AdminTable from '@/components/admin/ui/AdminTable'
import AdminModal from '@/components/admin/ui/AdminModal'
import AdminBtn from '@/components/admin/ui/AdminBtn'
import { AdminField, AdminInput, AdminSelect } from '@/components/admin/ui/AdminField'

const schema = z.object({
  title: z.string().min(2, 'Title required'),
  subtitle: z.string().optional(),
  cta_text: z.string().optional(),
  cta_link: z.string().optional(),
  order: z.string().optional(),
  is_active: z.boolean().optional(),
})

function BannerForm({ banner, onClose }) {
  const qc = useQueryClient()
  const isEdit = !!banner
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(banner?.image_url || null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: banner?.title || '',
      subtitle: banner?.subtitle || '',
      cta_text: banner?.cta_text || '',
      cta_link: banner?.cta_link || '',
      order: banner?.order != null ? String(banner.order) : '0',
      is_active: banner?.is_active ?? true,
    },
  })

  const mutation = useMutation({
    mutationFn: (data) => {
      const fd = new FormData()
      Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== '') fd.append(k, v) })
      if (imageFile) fd.append('image', imageFile)
      return isEdit ? updateBanner(banner.id, fd) : createBanner(fd)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-banners'] })
      toast.success(isEdit ? 'Banner updated.' : 'Banner created.')
      onClose()
    },
    onError: () => toast.error('Failed to save.'),
  })

  const onSubmit = (data) => mutation.mutate({ ...data, order: parseInt(data.order) || 0 })

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Image picker */}
      <label
        className="flex items-center justify-center gap-3 py-4 rounded-xl cursor-pointer border-2 border-dashed transition-colors hover:border-[#FF6B00] overflow-hidden"
        style={{ borderColor: '#2A2A2A', background: '#0F0F0F' }}
      >
        {preview ? (
          <img src={preview} alt="" className="h-28 w-full object-cover rounded-lg" />
        ) : (
          <div className="flex flex-col items-center gap-2 py-4" style={{ color: '#B0B0B0' }}>
            <HiPhotograph size={28} />
            <span className="text-xs">Click to upload banner image</span>
          </div>
        )}
        <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <AdminField label="Title" error={errors.title?.message} required>
            <AdminInput {...register('title')} placeholder="Luxury Fleet\nFor Every Journey" />
          </AdminField>
        </div>
        <div className="col-span-2">
          <AdminField label="Subtitle">
            <AdminInput {...register('subtitle')} placeholder="Premium vehicles at your service" />
          </AdminField>
        </div>
        <AdminField label="CTA Button Text">
          <AdminInput {...register('cta_text')} placeholder="Explore Fleet" />
        </AdminField>
        <AdminField label="CTA Link">
          <AdminInput {...register('cta_link')} placeholder="/vehicles" />
        </AdminField>
        <AdminField label="Order">
          <AdminInput {...register('order')} type="number" placeholder="0" />
        </AdminField>
        <AdminField label="Active">
          <label className="flex items-center gap-2 text-sm cursor-pointer mt-2" style={{ color: '#B0B0B0' }}>
            <input type="checkbox" {...register('is_active')} className="accent-[#FF6B00]" />
            Show on homepage
          </label>
        </AdminField>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <AdminBtn variant="ghost" onClick={onClose}>Cancel</AdminBtn>
        <AdminBtn type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Banner' : 'Create Banner'}
        </AdminBtn>
      </div>
    </form>
  )
}

export default function AdminBanners() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: () => getBanners().then((r) => r.data.results ?? r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-banners'] }); toast.success('Banner deleted.') },
    onError: () => toast.error('Delete failed.'),
  })

  const confirmDelete = (b) => {
    if (window.confirm(`Delete banner "${b.title}"?`)) deleteMutation.mutate(b.id)
  }

  const columns = [
    {
      key: 'image_url', label: 'Image',
      render: (v) => v
        ? <img src={v} alt="" className="w-20 h-12 object-cover rounded-lg" />
        : <div className="w-20 h-12 rounded-lg flex items-center justify-center" style={{ background: '#2A2A2A' }}><HiPhotograph style={{ color: '#555' }} /></div>,
    },
    { key: 'title', label: 'Title', render: (v) => <span className="text-white font-medium">{v}</span> },
    { key: 'subtitle', label: 'Subtitle', render: (v) => <span className="text-xs" style={{ color: '#B0B0B0' }}>{v || '—'}</span> },
    { key: 'order', label: 'Order' },
    {
      key: 'is_active', label: 'Active',
      render: (v) => v
        ? <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>Yes</span>
        : <span className="text-xs" style={{ color: '#B0B0B0' }}>No</span>,
    },
    {
      key: 'id', label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <AdminBtn size="sm" variant="ghost" onClick={() => setModal(row)}>
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
        <p className="text-sm" style={{ color: '#B0B0B0' }}>{data?.length ?? 0} banners</p>
        <AdminBtn onClick={() => setModal({})}>
          <HiPlus size={16} /> Add Banner
        </AdminBtn>
      </div>

      {isLoading ? (
        <div className="h-48 rounded-2xl animate-pulse" style={{ background: '#1A1A1A' }} />
      ) : (
        <AdminTable columns={columns} data={data} emptyText="No banners yet." />
      )}

      <AdminModal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.title ? 'Edit Banner' : 'Add Banner'}
        width="max-w-xl"
      >
        {modal !== null && (
          <BannerForm banner={modal?.title ? modal : null} onClose={() => setModal(null)} />
        )}
      </AdminModal>
    </div>
  )
}
