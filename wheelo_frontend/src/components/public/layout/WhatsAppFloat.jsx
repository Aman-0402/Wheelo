import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query'
import { getSettings } from '@/api/public'
import { buildWhatsAppUrl } from '@/utils/whatsapp'

export default function WhatsAppFloat() {
  const { data } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings().then((r) => r.data),
    staleTime: Infinity,
  })

  const phone = data?.whatsapp_number
  if (!phone) return null

  return (
    <motion.a
      href={buildWhatsAppUrl(phone)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl text-white text-sm font-semibold"
      style={{ background: '#25D366' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <FaWhatsapp size={22} />
      <span className="hidden sm:block">Chat Now</span>
    </motion.a>
  )
}
