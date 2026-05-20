import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { HiChevronDown } from 'react-icons/hi'
import { getFaqs } from '@/api/public'
import SectionHeading from '@/components/public/ui/SectionHeading'
import InquiryForm from '@/components/public/vehicles/InquiryForm'

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between px-5 py-4 text-left gap-4"
      >
        <span className="text-sm font-medium text-white leading-relaxed">{faq.question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 mt-0.5"
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
            <div
              className="px-5 pb-5 text-sm leading-relaxed"
              style={{ color: '#B0B0B0', borderTop: '1px solid #2A2A2A' }}
            >
              <div className="pt-4">{faq.answer}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Faq() {
  const [openId, setOpenId] = useState(null)

  const { data: faqs, isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => getFaqs().then((r) => r.data.results ?? r.data),
  })

  return (
    <>
      <Helmet>
        <title>FAQ — Wheelo | Vehicle Rental Vadodara</title>
        <meta name="description" content="Frequently asked questions about Wheelo vehicle rental in Vadodara. Find answers about booking, pricing, availability and more." />
      </Helmet>

      <div className="py-12 md:py-16 px-4 sm:px-6 lg:px-8" style={{ background: '#111111', borderBottom: '1px solid #2A2A2A' }}>
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            tag="FAQ"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know before booking. Can't find an answer? Contact us directly."
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* FAQ list */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-14 rounded-xl animate-pulse"
                    style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
                  />
                ))}
              </div>
            ) : !faqs?.length ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-4xl mb-3">❓</span>
                <p className="text-base font-semibold text-white">No FAQs yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <FaqItem
                    key={faq.id}
                    faq={faq}
                    isOpen={openId === faq.id}
                    onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar — quick inquiry */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <InquiryForm />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
