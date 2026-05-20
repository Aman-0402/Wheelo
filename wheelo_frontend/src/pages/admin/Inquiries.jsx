import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { FaWhatsapp } from 'react-icons/fa'
import { HiEye } from 'react-icons/hi'
import { getInquiries, updateInquiryStatus } from '@/api/admin'
import { useQuery as useSettingsQuery } from '@tanstack/react-query'
import { getSettings } from '@/api/public'
import AdminTable from '@/components/admin/ui/AdminTable'
import AdminModal from '@/components/admin/ui/AdminModal'
import AdminBtn from '@/components/admin/ui/AdminBtn'
import { AdminSelect } from '@/components/admin/ui/AdminField'
import { INQUIRY_STATUS } from '@/constants'
import { buildWhatsAppUrl as waUrl } from '@/utils/whatsapp'

const STATUS_COLORS = {
  new: '#3b82f6', reviewed: '#eab308', contacted: '#FF6B00', closed: '#6b7280',
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  ...Object.entries(INQUIRY_STATUS).map(([value, { label }]) => ({ value, label })),
]

function InquiryDetail({ inquiry, settings, onClose }) {
  const qc = useQueryClient()
  const mutation = useMutation({
    mutationFn: (status) => updateInquiryStatus(inquiry.id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-inquiries'] }); toast.success('Status updated.') },
  })

  const whatsappUrl = settings?.whatsapp_number
    ? waUrl(settings.whatsapp_number, {
        full_name: inquiry.full_name,
        phone: inquiry.phone,
        vehicle_name: inquiry.vehicle_name,
        pickup_date: inquiry.pickup_date,
        drop_date: inquiry.drop_date,
        city: inquiry.city,
      })
    : null

  return (
    <div className="space-y-5">
      {/* Status selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium" style={{ color: '#B0B0B0' }}>Status:</span>
        <AdminSelect
          value={inquiry.status}
          onChange={(e) => mutation.mutate(e.target.value)}
          className="w-36"
        >
          {Object.entries(INQUIRY_STATUS).map(([val, { label }]) => (
            <option key={val} value={val} style={{ background: '#1A1A1A' }}>{label}</option>
          ))}
        </AdminSelect>
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white"
            style={{ background: '#25D366' }}
          >
            <FaWhatsapp size={14} /> WhatsApp
          </a>
        )}
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {[
          ['Name', inquiry.full_name],
          ['Phone', inquiry.phone],
          ['Email', inquiry.email || '—'],
          ['City', inquiry.city],
          ['Vehicle', inquiry.vehicle_name || '—'],
          ['Pickup', inquiry.pickup_date],
          ['Drop', inquiry.drop_date],
          ['Submitted', inquiry.submitted_at ? format(new Date(inquiry.submitted_at), 'dd MMM yyyy, hh:mm a') : '—'],
        ].map(([label, value]) => (
          <div key={label} className="p-3 rounded-xl" style={{ background: '#0F0F0F' }}>
            <p className="text-xs mb-0.5" style={{ color: '#B0B0B0' }}>{label}</p>
            <p className="text-white font-medium">{value}</p>
          </div>
        ))}
      </div>

      {inquiry.message && (
        <div className="p-3 rounded-xl" style={{ background: '#0F0F0F' }}>
          <p className="text-xs mb-1" style={{ color: '#B0B0B0' }}>Message</p>
          <p className="text-sm text-white leading-relaxed">{inquiry.message}</p>
        </div>
      )}

      <div className="flex justify-end">
        <AdminBtn variant="ghost" onClick={onClose}>Close</AdminBtn>
      </div>
    </div>
  )
}

export default function AdminInquiries() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selected, setSelected] = useState(null)
  const statusFilter = searchParams.get('status') || ''

  const { data, isLoading } = useQuery({
    queryKey: ['admin-inquiries', statusFilter],
    queryFn: () => getInquiries(statusFilter ? { status: statusFilter } : {}).then((r) => r.data.results ?? r.data),
  })

  const { data: settings } = useSettingsQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings().then((r) => r.data),
    staleTime: Infinity,
  })

  const columns = [
    { key: 'full_name', label: 'Name', render: (v) => <span className="text-white font-medium">{v}</span> },
    { key: 'phone', label: 'Phone' },
    { key: 'vehicle_name', label: 'Vehicle', render: (v) => v || '—' },
    { key: 'city', label: 'City' },
    { key: 'pickup_date', label: 'Pickup' },
    {
      key: 'status', label: 'Status',
      render: (v) => (
        <span
          className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
          style={{ background: STATUS_COLORS[v] || '#2A2A2A' }}
        >
          {INQUIRY_STATUS[v]?.label || v}
        </span>
      ),
    },
    {
      key: 'submitted_at', label: 'Date',
      render: (v) => v ? format(new Date(v), 'dd MMM, hh:mm a') : '—',
    },
    {
      key: 'id', label: '',
      render: (_, row) => (
        <AdminBtn size="sm" variant="ghost" onClick={() => setSelected(row)}>
          <HiEye size={14} /> View
        </AdminBtn>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: '#B0B0B0' }}>
          {data?.length ?? 0} inquiries
        </p>
        <AdminSelect
          value={statusFilter}
          onChange={(e) => {
            const next = new URLSearchParams()
            if (e.target.value) next.set('status', e.target.value)
            setSearchParams(next)
          }}
          className="w-36"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} style={{ background: '#1A1A1A' }}>{o.label}</option>
          ))}
        </AdminSelect>
      </div>

      {isLoading ? (
        <div className="h-48 rounded-2xl animate-pulse" style={{ background: '#1A1A1A' }} />
      ) : (
        <AdminTable columns={columns} data={data} emptyText="No inquiries yet." />
      )}

      <AdminModal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Inquiry Details"
        width="max-w-xl"
      >
        {selected && (
          <InquiryDetail inquiry={selected} settings={settings} onClose={() => setSelected(null)} />
        )}
      </AdminModal>
    </div>
  )
}
