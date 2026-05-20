import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppFloat from './WhatsAppFloat'

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#0F0F0F' }}>
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
