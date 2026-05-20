import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { HiPhotograph, HiTrash, HiUpload } from 'react-icons/hi'
import { getAdminGallery, uploadGalleryImage, deleteGalleryImage } from '@/api/admin'

export default function AdminGallery() {
  const qc = useQueryClient()
  const [uploading, setUploading] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: () => getAdminGallery().then((r) => r.data.results ?? r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteGalleryImage,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-gallery'] }); toast.success('Image deleted.') },
    onError: () => toast.error('Delete failed.'),
  })

  const handleUpload = async (files) => {
    setUploading(true)
    try {
      for (const file of files) {
        const fd = new FormData()
        fd.append('image', file)
        await uploadGalleryImage(fd)
      }
      qc.invalidateQueries({ queryKey: ['admin-gallery'] })
      toast.success(`${files.length} image(s) uploaded.`)
    } catch {
      toast.error('Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: '#B0B0B0' }}>
          {data?.length ?? 0} images
        </p>
        <label
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl text-white cursor-pointer hover:opacity-90 transition-all"
          style={{ background: uploading ? '#555' : '#FF6B00' }}
        >
          <HiUpload size={16} />
          {uploading ? 'Uploading...' : 'Upload Images'}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => e.target.files?.length && handleUpload(Array.from(e.target.files))}
          />
        </label>
      </div>

      {isLoading ? (
        <div className="h-48 rounded-2xl animate-pulse" style={{ background: '#1A1A1A' }} />
      ) : !data?.length ? (
        <div
          className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl"
          style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
        >
          <HiPhotograph size={40} style={{ color: '#2A2A2A' }} />
          <p className="text-sm" style={{ color: '#B0B0B0' }}>No gallery images yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.map((img) => (
            <div
              key={img.id}
              className="relative group rounded-xl overflow-hidden aspect-square"
              style={{ background: '#111' }}
            >
              <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => deleteMutation.mutate(img.id)}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(0,0,0,0.65)', color: '#ef4444' }}
              >
                <HiTrash size={22} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
