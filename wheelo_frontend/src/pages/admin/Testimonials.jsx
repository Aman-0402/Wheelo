import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { HiPlus, HiPencil, HiTrash, HiStar } from 'react-icons/hi'
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/api/admin'
import AdminTable from '@/components/admin/ui/AdminTable'
import AdminModal from '@/components/admin/ui/AdminModal'
import AdminBtn from '@/components/admin/ui/AdminBtn'
import { AdminField, AdminInput, AdminTextarea, AdminSelect } from '@/components/admin/ui/AdminField'

const schema = z.object({
  author_name: z.string().min(2, 'Name required'),
  location: z.string().optional(),
  rating: z.string(),
  body: z.string().min(10, 'Review text required'),
  is_active: z.boolean().optional(),
})

function TestimonialForm({ testimonial, onClose }) {
  const qc = useQueryClient()
  const isEdit = !!testimonial

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      author_name: testimonial?.author_name || '',
      location: testimonial?.location || '',
      rating: testimonial?.rating ? String(testimonial.rating) : '5',
      body: testimonial?.body || '',
      is_active: testimonial?.is_active ?? true,
    },
  })

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? updateTestimonial(testimonial.id, data) : createTestimonial(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-testimonials'] })
      toast.success(isEdit ? 'Testimonial updated.' : 'Testimonial added.')
      onClose()
    },
    onError: () => toast.error('Failed to save.'),
  })

  const onSubmit = (data) => mutation.mutate({ ...data, rating: parseInt(data.rating) })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <AdminField label="Author Name" error={errors.author_name?.message} required>
          <AdminInput {...register('author_name')} placeholder="Rajesh Kumar" />
        </AdminField>
        <AdminField label="Location">
          <AdminInput {...register('location')} placeholder="Vadodara, Gujarat" />
        </AdminField>
        <AdminField label="Rating">
          <AdminSelect {...register('rating')}>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r} style={{ background: '#1A1A1A' }}>{'★'.repeat(r)} ({r}/5)</option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label="Active">
          <label className="flex items-center gap-2 text-sm cursor-pointer mt-2" style={{ color: '#B0B0B0' }}>
            <input type="checkbox" {...register('is_active')} className="accent-[#FF6B00]" />
            Show on website
          </label>
        </AdminField>
        <div className="col-span-2">
          <AdminField label="Review Text" error={errors.body?.message} required>
            <AdminTextarea {...register('body')} rows={4} placeholder="Write the customer's review..." />
          </AdminField>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <AdminBtn variant="ghost" onClick={onClose}>Cancel</AdminBtn>
        <AdminBtn type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add Testimonial'}
        </AdminBtn>
      </div>
    </form>
  )
}

export default function AdminTestimonials() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => getTestimonials().then((r) => r.data.results ?? r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-testimonials'] }); toast.success('Deleted.') },
    onError: () => toast.error('Delete failed.'),
  })

  const confirmDelete = (t) => {
    if (window.confirm(`Delete testimonial from "${t.author_name}"?`)) deleteMutation.mutate(t.id)
  }

  const columns = [
    { key: 'author_name', label: 'Author', render: (v) => <span className="text-white font-medium">{v}</span> },
    { key: 'location', label: 'Location', render: (v) => v || '—' },
    {
      key: 'rating', label: 'Rating',
      render: (v) => <span style={{ color: '#eab308' }}>{'★'.repeat(v)}</span>,
    },
    {
      key: 'body', label: 'Review',
      render: (v) => <span className="text-xs line-clamp-2" style={{ color: '#B0B0B0' }}>{v}</span>,
    },
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
        <p className="text-sm" style={{ color: '#B0B0B0' }}>{data?.length ?? 0} testimonials</p>
        <AdminBtn onClick={() => setModal({})}>
          <HiPlus size={16} /> Add Testimonial
        </AdminBtn>
      </div>

      {isLoading ? (
        <div className="h-48 rounded-2xl animate-pulse" style={{ background: '#1A1A1A' }} />
      ) : (
        <AdminTable columns={columns} data={data} emptyText="No testimonials yet." />
      )}

      <AdminModal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.author_name ? 'Edit Testimonial' : 'Add Testimonial'}
        width="max-w-xl"
      >
        {modal !== null && (
          <TestimonialForm
            testimonial={modal?.author_name ? modal : null}
            onClose={() => setModal(null)}
          />
        )}
      </AdminModal>
    </div>
  )
}
