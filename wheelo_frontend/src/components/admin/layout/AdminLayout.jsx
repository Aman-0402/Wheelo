import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen" style={{ background: '#0F0F0F' }}>
      {/* Sidebar will go here */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
