import { cn } from '@/utils/cn'

export default function AdminBtn({ children, onClick, type = 'button', variant = 'primary', size = 'md', disabled, className }) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-5 py-3 text-sm' }
  const variants = {
    primary: 'text-white hover:opacity-90',
    ghost: 'hover:bg-white/5',
    danger: 'hover:bg-red-500/10',
  }
  const styles = {
    primary: { background: '#FF6B00' },
    ghost: { color: '#B0B0B0', border: '1px solid #2A2A2A' },
    danger: { color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, sizes[size], variants[variant], className)}
      style={styles[variant]}
    >
      {children}
    </button>
  )
}
