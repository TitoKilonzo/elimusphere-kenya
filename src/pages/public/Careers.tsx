import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Briefcase } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { img } from '../../lib/images';

const ROLES = [
  { title: 'Curriculum Content Developer (CBC)', location: 'Nairobi, Kenya · Hybrid', type: 'Full-time' },
  { title: 'Mobile Performance Engineer (Android/PWA)', location: 'Remote, East Africa', type: 'Full-time' },
  { title: 'Kiswahili Localisation Specialist', location: 'Nairobi, Kenya', type: 'Contract' },
  { title: 'School Partnerships Lead', location: 'Mombasa, Kenya', type: 'Full-time' },
];

export default function Careers() {
  const { showToast } = useToast();

  return (
    <div className="flex flex-col">
      <header className="relative">
        <img src={img('codingKids', { w: 1600, h: 500 })} alt="Developers collaborating on the ElimuSphere platform" className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-[var(--elimu-ink-950)]/70 flex items-center justify-center px-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
            <h1 className="font-display text-3xl font-extrabold text-white mb-2">Build the future of CBC learning</h1>
            <p className="text-stone-200 text-sm max-w-md mx-auto">We're a small, focused team solving real problems for Kenyan classrooms.</p>
          </motion.div>
        </div>
      </header>

      <section className="py-14 px-6 max-w-4xl mx-auto w-full">
        <h2 className="font-display text-2xl font-extrabold text-stone-900 mb-6">Open roles</h2>
        <div className="space-y-3">
          {ROLES.map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <h3 className="font-bold text-stone-900 text-sm mb-1.5">{role.title}</h3>
                <div className="flex items-center gap-4 text-stone-400 text-xs">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {role.location}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {role.type}</span>
                </div>
              </div>
              <button
                onClick={() => showToast(`Thanks for your interest in "${role.title}" - send your CV to careers@elimusphere.ke.`)}
                className="px-4 py-2 bg-[var(--elimu-amber-500)] text-white font-bold rounded-lg text-xs hover:bg-[var(--elimu-amber-600)] transition-colors cursor-pointer shrink-0"
              >
                Apply now
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 bg-stone-50 rounded-2xl p-6 border border-stone-100 text-center">
          <p className="text-stone-500 text-sm">Don't see a role that fits? Send us your CV anyway at <a href="mailto:careers@elimusphere.ke" className="text-[var(--elimu-amber-600)] font-semibold hover:underline">careers@elimusphere.ke</a>.</p>
        </div>
      </section>
    </div>
  );
}
