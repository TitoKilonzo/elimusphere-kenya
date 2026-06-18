import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, GraduationCap, Users, School } from 'lucide-react';

const CYCLES = [
  { id: 'weekly', label: 'Weekly', price: 500, weeklyRate: 500, note: 'Short-term / exam-week crunch' },
  { id: 'monthly', label: 'Monthly', price: 1800, weeklyRate: 450, note: 'Standard plan, ~4 weeks' },
  { id: 'termly', label: 'Termly', price: 5500, weeklyRate: 423, note: 'Best for an active school term', highlight: true },
  { id: 'annual', label: 'Annual', price: 16000, weeklyRate: 308, note: '3 terms, ~38% cheaper than weekly' },
];

const TIERS = [
  {
    icon: GraduationCap,
    title: 'Learner',
    color: 'var(--elimu-amber-500)',
    bg: 'bg-[var(--elimu-amber-50)]',
    text: 'text-[var(--elimu-amber-600)]',
    features: ['Full curriculum explorer, PP1-Grade 12', 'Mwalimu AI tutor (unlimited)', 'CBAF-scored practice & assessments', 'Offline lesson downloads', 'Gamified XP, streaks & badges'],
  },
  {
    icon: Users,
    title: 'Parent',
    color: 'var(--elimu-green-500)',
    bg: 'bg-[var(--elimu-green-50)]',
    text: 'text-[var(--elimu-green-600)]',
    features: ['Multi-child dashboard', 'Real-time CBAF progress reports', 'AI-generated home learning guides', 'M-Pesa fee payments & history', 'Direct teacher messaging'],
  },
  {
    icon: School,
    title: 'School',
    color: '#57534E',
    bg: 'bg-stone-100',
    text: 'text-stone-700',
    features: ['Bulk learner & teacher licenses', 'Admissions & timetabling', 'Staff payroll management', 'Bulk SMS broadcaster', 'Institution-wide analytics'],
  },
];

export default function Pricing() {
  const [selectedCycle, setSelectedCycle] = useState('termly');

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto w-full">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 bg-[var(--elimu-amber-50)] text-[var(--elimu-amber-600)] text-xs font-bold rounded-full mb-4 uppercase tracking-widest">
          One subscription, every grade
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 mb-3">Simple, transparent pricing</h1>
        <p className="text-stone-500 text-sm max-w-xl mx-auto">
          One core plan, four billing cycles - the longer the commitment, the better the effective weekly rate. Teachers stay free by default.
        </p>
      </div>

      {/* Billing cycle selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        {CYCLES.map((c, i) => (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            onClick={() => setSelectedCycle(c.id)}
            className={`relative text-left p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedCycle === c.id ? 'border-[var(--elimu-amber-500)] bg-[var(--elimu-amber-50)] shadow-md' : 'border-stone-100 bg-white hover:border-stone-200'
            }`}
          >
            {c.highlight && (
              <span className="absolute -top-2.5 right-4 px-2 py-0.5 bg-[var(--elimu-green-500)] text-white text-[9px] font-extrabold rounded-full uppercase">
                Most Popular
              </span>
            )}
            <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${selectedCycle === c.id ? 'text-[var(--elimu-amber-700)]' : 'text-stone-400'}`}>{c.label}</p>
            <p className="font-display text-2xl font-extrabold text-stone-900">KES {c.price.toLocaleString()}</p>
            <p className="text-stone-400 text-[11px] mt-1">~KES {c.weeklyRate}/week effective</p>
            <p className="text-stone-500 text-[10px] mt-2 leading-snug">{c.note}</p>
          </motion.button>
        ))}
      </div>

      {/* Role tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        {TIERS.map((tier, i) => {
          const Icon = tier.icon;
          return (
            <motion.div
              key={tier.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm p-7 flex flex-col"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${tier.bg}`} style={{ color: tier.color }}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-stone-900 mb-1">{tier.title}</h3>
              <p className="text-stone-400 text-xs mb-5">Included in every billing cycle above</p>
              <ul className="space-y-2.5 text-xs text-stone-600 mb-6 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: tier.color }} /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`w-full py-2.5 text-center rounded-lg text-xs font-bold border-2 transition-colors cursor-pointer ${tier.text}`}
                style={{ borderColor: tier.color }}
              >
                Get started
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Add-ons */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-[var(--elimu-ink-950)] rounded-3xl p-8 lg:p-10 text-white grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-bold text-[var(--elimu-amber-400)] text-sm mb-2 uppercase tracking-wide">Family Discount</h4>
          <p className="text-stone-300 text-xs leading-relaxed">A percentage discount per additional linked learner under one parent account.</p>
        </div>
        <div>
          <h4 className="font-bold text-[var(--elimu-amber-400)] text-sm mb-2 uppercase tracking-wide">Teacher Pro</h4>
          <p className="text-stone-300 text-xs leading-relaxed">Optional add-on for AI-assisted lesson planning and deeper class analytics - the base Educator tier stays free.</p>
        </div>
        <div>
          <h4 className="font-bold text-[var(--elimu-amber-400)] text-sm mb-2 uppercase tracking-wide">Soft Downgrade</h4>
          <p className="text-stone-300 text-xs leading-relaxed">On expiry, accounts move to a limited free view rather than a hard lockout - browse only, no new lessons or quizzes.</p>
        </div>
      </motion.div>
    </div>
  );
}
