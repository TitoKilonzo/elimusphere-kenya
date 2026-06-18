import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'What is the CBAF and why does ElimuSphere use it?',
    a: "The Competency-Based Assessment Framework (CBAF) is KNEC's official scoring system, splitting results into four bands - Exceeding, Meeting, Approaching, and Below Expectations - each with two sub-levels. We report every quiz and assessment in these same EE/ME/AE/BE bands so families see the same language they already recognise from KJSEA results.",
  },
  {
    q: 'Does the app work without internet?',
    a: 'Yes. ElimuSphere is a true installable PWA - downloaded lessons, videos, and notes are cached for offline viewing, and quizzes taken offline are queued and submitted automatically once you reconnect.',
  },
  {
    q: 'Is the platform free for teachers?',
    a: 'Yes, by default. Teachers get a free Educator account to create classes, build lesson materials, and track competency analytics. An optional Teacher Pro add-on unlocks AI-assisted lesson planning and deeper class analytics.',
  },
  {
    q: 'How do Senior School pathways work?',
    a: "At Grade 10, learners choose one of three pathways - STEM, Social Sciences, or Arts & Sports Science. All learners take 7 subjects total: 4 universal core subjects plus 3 pathway-specific subjects they select.",
  },
  {
    q: 'How do I pay for a subscription?',
    a: 'M-Pesa STK Push is the primary payment method - enter your phone number, confirm the prompt on your handset, and you\'re done. Pesapal and Flutterwave are available as card fallbacks for parents based outside Kenya.',
  },
  {
    q: 'What happens if my subscription expires?',
    a: 'Your account soft-downgrades to a limited free view (browse only, no new lessons or quizzes) rather than a hard lockout, so your progress and history stay intact until you renew.',
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="py-16 px-6 max-w-3xl mx-auto w-full">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl font-extrabold text-stone-900 mb-3">Frequently asked questions</h1>
        <p className="text-stone-500 text-sm">Can't find what you're looking for? <a href="/contact" className="text-[var(--elimu-amber-600)] font-semibold hover:underline">Contact our team</a>.</p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div key={faq.q} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between text-left p-5 cursor-pointer"
              >
                <span className="font-bold text-stone-900 text-sm pr-4">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[var(--elimu-amber-500)] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <p className="px-5 pb-5 text-stone-500 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
