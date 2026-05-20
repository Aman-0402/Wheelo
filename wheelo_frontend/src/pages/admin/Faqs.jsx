import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi'
import { getFaqs, createFaq, updateFaq, deleteFaq } from '@/api/admin'
import AdminTable from '@/components/admin/ui/AdminTable'
import AdminModal from '@/components/admin/ui/AdminModal'
import AdminBtn from '@/components/admin/ui/AdminBtn'
import { AdminField, AdminInput, AdminTextarea } from '@/components/admin/ui/AdminField'

const schema = z.object({
  question: z.string().min(5, 'Question required'),
  answer: z.string().min(10, 'Answer required'),
  order: z.string().optional(),
})

function FaqForm({ faq, onClose }) {
  const qc = useQueryClient()
  const isEdit = !!faq

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      question: faq?.question || '',
      answer: faq?.answer || '',
      order: faq?.order != null ? String(faq.order) : '0',
    },
  })

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? updateFaq(faq.id, data) : createFaq(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-faqs'] })
      toast.success(isEdit ? 'FAQ updated.' : 'FAQ added.')
      onClose()
    },
    onError: () => toast.error('Failed to save.'),
  })

  const onSubmit = (data) => mutation.mutate({ ...data, order: parseInt(data.order) || 0 })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AdminField label="Question" error={errors.question?.message} required>
        <AdminInput {...register('question')} placeholder="What documents are required?" />
      </AdminField>
      <AdminField label="Answer" error={errors.answer?.message} required>
        <AdminTextarea {...register('answer')} rows={4} placeholder="Provide a clear answer..." />
      </AdminField>
      <AdminField label="Display Order">
        <AdminInput {...register('order')} type="number" placeholder="0" className="w-24" />
      </AdminField>
      <div className="flex justify-end gap-3 pt-2">
        <AdminBtn variant="ghost" onClick={onClose}>Cancel</AdminBtn>
        <AdminBtn type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update FAQ' : 'Add FAQ'}
        </AdminBtn>
      </div>
    </form>
  )
}

export default function AdminFaqs() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-faqs'],
    queryFn: () => getFaqs().then((r) => r.data.results ?? r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteFaq,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-faqs'] }); toast.success('FAQ deleted.') },
    onError: () => toast.error('Delete failed.'),
  })

  const confirmDelete = (faq) => {
    if (window.confirm('Delete this FAQ?')) deleteMutation.mutate(faq.id)
  }

  const columns = [
    { key: 'order', label: '#', render: (v) => <span style={{ color: '#B0B0B0' }}>{v}</span> },
    {
      key: 'question', label: 'Question',
      render: (v) => <span className="text-white font-medium">{v}</span>,
    },
    {
      key: 'answer', label: 'Answer',
      render: (v) => <span className="text-xs line-clamp-2" style={{ color: '#B0B0B0' }}>{v}</span>,
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
        <p className="text-sm" style={{ color: '#B0B0B0' }}>{data?.length ?? 0} FAQs</p>
        <AdminBtn onClick={() => setModal({})}>
          <HiPlus size={16} /> Add FAQ
        </AdminBtn>
      </div>

      {isLoading ? (
        <div className="h-48 rounded-2xl animate-pulse" style={{ background: '#1A1A1A' }} />
      ) : (
        <AdminTable columns={columns} data={data} emptyText="No FAQs yet." />
      )}

      <AdminModal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.question ? 'Edit FAQ' : 'Add FAQ'}
        width="max-w-xl"
      >
        {modal !== null && (
          <FaqForm faq={modal?.question ? modal : null} onClose={() => setModal(null)} />
        )}
      </AdminModal>
    </div>
  )
}
