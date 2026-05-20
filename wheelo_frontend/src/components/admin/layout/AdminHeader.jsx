import { HiMenuAlt2 } from 'react-icons/hi'

export default function AdminHeader({ onMenuClick, title }) {
  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 h-14 shrink-0"
      style={{ background: '#0F0F0F', borderBottom: '1px solid #2A2A2A' }}
    >
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-[#B0B0B0] hover:text-white"
        aria-label="Open menu"
      >
        <HiMenuAlt2 size={20} />
      </button>
      <h1 className="text-sm font-semibold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
        {title}
      </h1>
    </header>
  )
}
