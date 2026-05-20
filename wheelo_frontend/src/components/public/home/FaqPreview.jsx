import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiChevronDown } from 'react-icons/hi'
import { useQuery } from '@tanstack/react-query'
import { getFaqs } from '@/api/public'
import SectionHeading from '@/components/public/ui/SectionHeading'

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
      >
        <span className="text-sm font-medium text-white">{faq.question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
          style={{ color: '#FF6B00' }}
        >
          <HiChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: '#B0B0B0', borderTop: '1px solid #2A2A2A' }}>
              <div className="pt-3">{faq.answer}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FaqPreview() {
  const [openId, setOpenId] = useState(null)
  const { data: faqs } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => getFaqs().then((r) => r.data.results ?? r.data),
  })

  const preview = faqs?.slice(0, 5)
  if (!preview?.length) return null

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#111111' }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <SectionHeading
            tag="FAQ"
            title="Frequently Asked Questions"
            subtitle="Quick answers to common questions."
          />
        </div>

        <div className="space-y-3">
          {preview.map((faq) => (
            <FaqItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/faq"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: '#FF6B00' }}
          >
            View all FAQs →
          </Link>
        </div>
      </div>
    </section>
  )
}
