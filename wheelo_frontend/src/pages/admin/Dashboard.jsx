import { useQuery } from '@tanstack/react-query'
import { getDashboardAnalytics } from '@/api/admin'
import StatCard from '@/components/admin/ui/StatCard'
import AdminTable from '@/components/admin/ui/AdminTable'
import { INQUIRY_STATUS } from '@/constants'
import { format } from 'date-fns'

const STATUS_COLORS = {
  new: '#3b82f6', reviewed: '#eab308', contacted: '#FF6B00', closed: '#6b7280',
}

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => getDashboardAnalytics().then((r) => r.data),
    refetchInterval: 30000,
  })

  const stats = [
    { label: 'Total Vehicles', value: data?.total_vehicles, icon: '🚗', color: '#FF6B00' },
    { label: 'Available Now', value: data?.available_vehicles, icon: '✅', color: '#22c55e' },
    { label: 'Total Inquiries', value: data?.total_inquiries, icon: '📝', color: '#3b82f6' },
    { label: 'New Inquiries', value: data?.new_inquiries, icon: '🔔', color: '#eab308' },
  ]

  const recentColumns = [
    { key: 'full_name', label: 'Name', render: (v) => <span className="text-white font-medium">{v}</span> },
    { key: 'phone', label: 'Phone' },
    { key: 'vehicle_name', label: 'Vehicle', render: (v) => v || '—' },
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
      key: 'submitted_at', label: 'Submitted',
      render: (v) => v ? format(new Date(v), 'dd MMM, hh:mm a') : '—',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: '#1A1A1A' }} />
            ))
          : stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)
        }
      </div>

      {/* Inquiry status breakdown */}
      {data?.inquiry_status_breakdown && (
        <div className="p-5 rounded-2xl" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#FF6B00' }}>
            Inquiry Breakdown
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(data.inquiry_status_breakdown).map(([status, count]) => (
              <div key={status} className="text-center">
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className="text-xs capitalize mt-0.5" style={{ color: STATUS_COLORS[status] }}>
                  {INQUIRY_STATUS[status]?.label || status}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent inquiries */}
      <div>
        <p className="text-sm font-semibold text-white mb-3">Recent Inquiries</p>
        {isLoading ? (
          <div className="h-48 rounded-2xl animate-pulse" style={{ background: '#1A1A1A' }} />
        ) : (
          <AdminTable
            columns={recentColumns}
            data={data?.recent_inquiries}
            emptyText="No inquiries yet."
          />
        )}
      </div>
    </div>
  )
}
