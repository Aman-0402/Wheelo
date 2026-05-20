import { cn } from '@/utils/cn'

const inputBase = 'w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-[#FF6B00] transition-all'
const inputStyle = { background: '#0F0F0F', border: '1px solid #2A2A2A' }

export function AdminField({ label, error, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium" style={{ color: '#B0B0B0' }}>
          {label} {required && <span style={{ color: '#FF6B00' }}>*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>}
    </div>
  )
}

export function AdminInput({ className, style, ...props }) {
  return (
    <input
      className={cn(inputBase, className)}
      style={{ ...inputStyle, ...style }}
      {...props}
    />
  )
}

export function AdminTextarea({ className, style, rows = 3, ...props }) {
  return (
    <textarea
      rows={rows}
      className={cn(inputBase, 'resize-none', className)}
      style={{ ...inputStyle, ...style }}
      {...props}
    />
  )
}

export function AdminSelect({ className, style, children, ...props }) {
  return (
    <select
      className={cn(inputBase, className)}
      style={{ ...inputStyle, color: '#fff', ...style }}
      {...props}
    >
      {children}
    </select>
  )
}
