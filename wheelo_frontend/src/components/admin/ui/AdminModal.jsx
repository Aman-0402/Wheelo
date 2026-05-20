import { motion, AnimatePresence } from 'framer-motion'
import { HiX } from 'react-icons/hi'

export default function AdminModal({ open, onClose, title, children, width = 'max-w-lg' }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.75)' }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className={`w-full ${width} rounded-2xl overflow-hidden`}
              style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #2A2A2A' }}>
                <h3 className="text-base font-semibold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {title}
                </h3>
                <button onClick={onClose} className="p-1 rounded-lg text-[#B0B0B0] hover:text-white">
                  <HiX size={18} />
                </button>
              </div>
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
