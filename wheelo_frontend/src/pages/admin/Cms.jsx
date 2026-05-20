import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { HiPencil, HiCheck, HiX } from 'react-icons/hi'
import { getCmsSections, updateCmsSection } from '@/api/admin'
import AdminBtn from '@/components/admin/ui/AdminBtn'
import { AdminField, AdminTextarea } from '@/components/admin/ui/AdminField'

function SectionEditor({ section, onClose }) {
  const qc = useQueryClient()
  const [raw, setRaw] = useState(
    typeof section.content === 'object'
      ? JSON.stringify(section.content, null, 2)
      : String(section.content ?? '')
  )
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setError('')
    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      setError('Invalid JSON — fix before saving.')
      return
    }
    setSaving(true)
    try {
      await updateCmsSection(section.id, { content: parsed })
      qc.invalidateQueries({ queryKey: ['admin-cms'] })
      toast.success('Section updated.')
      onClose()
    } catch {
      toast.error('Save failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium mb-1" style={{ color: '#B0B0B0' }}>
          Section: <span className="text-white">{section.section_key}</span>
        </p>
        <AdminTextarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={14}
          style={{ fontFamily: 'monospace', fontSize: '12px' }}
        />
        {error && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{error}</p>}
      </div>
      <div className="flex justify-end gap-3">
        <AdminBtn variant="ghost" onClick={onClose}>Cancel</AdminBtn>
        <AdminBtn onClick={save} disabled={saving}>
          {saving ? 'Saving...' : 'Save Section'}
        </AdminBtn>
      </div>
    </div>
  )
}

export default function AdminCms() {
  const [editing, setEditing] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-cms'],
    queryFn: () => getCmsSections().then((r) => r.data.results ?? r.data),
  })

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: '#B0B0B0' }}>
        Edit content sections displayed on the website.
      </p>

      {isLoading ? (
        <div className="h-48 rounded-2xl animate-pulse" style={{ background: '#1A1A1A' }} />
      ) : (
        <div className="space-y-3">
          {data?.map((section) => (
            <div
              key={section.id}
              className="flex items-start justify-between gap-4 p-4 rounded-xl"
              style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white mb-1">{section.section_key}</p>
                <p className="text-xs font-mono truncate" style={{ color: '#B0B0B0' }}>
                  {JSON.stringify(section.content).slice(0, 120)}
                  {JSON.stringify(section.content).length > 120 ? '…' : ''}
                </p>
              </div>
              <AdminBtn size="sm" variant="ghost" onClick={() => setEditing(section)}>
                <HiPencil size={14} /> Edit
              </AdminBtn>
            </div>
          ))}
          {!data?.length && (
            <div
              className="py-12 text-center rounded-2xl"
              style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
            >
              <p className="text-sm" style={{ color: '#B0B0B0' }}>No CMS sections configured.</p>
            </div>
          )}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-2xl rounded-2xl p-6 space-y-4" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-white">Edit CMS Section</p>
              <button onClick={() => setEditing(null)} style={{ color: '#B0B0B0' }}>
                <HiX size={20} />
              </button>
            </div>
            <SectionEditor section={editing} onClose={() => setEditing(null)} />
          </div>
        </div>
      )}
    </div>
  )
}
