import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { HiSave } from 'react-icons/hi'
import { getAdminSettings, updateSettings } from '@/api/admin'
import AdminBtn from '@/components/admin/ui/AdminBtn'
import { AdminField, AdminInput, AdminTextarea } from '@/components/admin/ui/AdminField'

const SETTING_FIELDS = [
  { group: 'Brand', fields: [
    { key: 'site_name', label: 'Site Name', placeholder: 'Wheelo' },
    { key: 'tagline', label: 'Tagline', placeholder: 'Your premium vehicle rental service' },
  ]},
  { group: 'Contact', fields: [
    { key: 'phone', label: 'Phone', placeholder: '+91 98765 43210' },
    { key: 'email', label: 'Email', placeholder: 'hello@wheelo.in' },
    { key: 'whatsapp_number', label: 'WhatsApp Number', placeholder: '919876543210 (country code, no +)' },
    { key: 'address', label: 'Address', placeholder: 'Vadodara, Gujarat', textarea: true },
  ]},
  { group: 'Integrations', fields: [
    { key: 'maps_embed_url', label: 'Google Maps Embed URL', placeholder: 'https://maps.google.com/maps?...', textarea: true },
    { key: 'ga4_id', label: 'Google Analytics 4 ID', placeholder: 'G-XXXXXXXXXX' },
  ]},
  { group: 'Social Media', fields: [
    { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/wheelo' },
    { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/wheelo' },
  ]},
]

export default function AdminSettings() {
  const qc = useQueryClient()
  const [values, setValues] = useState({})

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => getAdminSettings().then((r) => r.data),
  })

  useEffect(() => {
    if (data) {
      const map = {}
      data.forEach((s) => { map[s.key] = s.value })
      setValues(map)
    }
  }, [data])

  const mutation = useMutation({
    mutationFn: (payload) => updateSettings(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-settings'] })
      qc.invalidateQueries({ queryKey: ['settings'] })
      toast.success('Settings saved.')
    },
    onError: () => toast.error('Save failed.'),
  })

  const handleSave = () => {
    const payload = Object.entries(values).map(([key, value]) => ({ key, value: value || '' }))
    mutation.mutate(payload)
  }

  if (isLoading) return <div className="h-48 rounded-2xl animate-pulse" style={{ background: '#1A1A1A' }} />

  return (
    <div className="space-y-6 max-w-2xl">
      {SETTING_FIELDS.map(({ group, fields }) => (
        <div key={group} className="p-5 rounded-2xl space-y-4" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#FF6B00' }}>{group}</p>
          {fields.map(({ key, label, placeholder, textarea }) => (
            <AdminField key={key} label={label}>
              {textarea ? (
                <AdminTextarea
                  value={values[key] || ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  rows={3}
                />
              ) : (
                <AdminInput
                  value={values[key] || ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                />
              )}
            </AdminField>
          ))}
        </div>
      ))}

      <div className="flex justify-end pb-4">
        <AdminBtn onClick={handleSave} disabled={mutation.isPending} size="lg">
          <HiSave size={16} />
          {mutation.isPending ? 'Saving...' : 'Save All Settings'}
        </AdminBtn>
      </div>
    </div>
  )
}
