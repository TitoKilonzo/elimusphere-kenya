import React from 'react';
import { motion } from 'motion/react';
import { Target, Heart, Globe2 } from 'lucide-react';
import { img } from '../../lib/images';

const TEAM = [
  { name: 'Achieng Otieno', role: 'Founder & CEO', image: 'portraitTeacherFemale' as const },
  { name: 'David Kemei', role: 'Head of Curriculum', image: 'portraitTeacherMale' as const },
  { name: 'Grace Mwangi', role: 'Head of Partnerships', image: 'portraitParent' as const },
];

export default function About() {
  return (
    <div className="flex flex-col">
      <header className="relative bg-[var(--elimu-ink-950)] py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/2 w-96 h-96 bg-[var(--elimu-amber-500)] rounded-full blur-[130px] -translate-x-1/2" />
        </div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Replacing fragmentation with one connected ecosystem
          </h1>
          <p className="text-stone-300 text-sm leading-relaxed">
            ElimuSphere Kenya exists because families were juggling separate tools for AI tutoring, video lessons,
            assessment feedback, and senior-school pathway prep. We built the single home companion app instead.
          </p>
        </motion.div>
      </header>

      <section className="py-16 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="font-display text-2xl font-extrabold text-stone-900 mb-4">Our mission</h2>
          <p className="text-stone-500 text-sm leading-relaxed mb-6">
            We want every Kenyan household navigating the CBC/CBE journey - from Pre-Primary through Senior School -
            to have one trustworthy, offline-friendly companion, not five disconnected apps. That means real curriculum
            alignment with KICD's own structure, assessment language families already recognise from KNEC, and a
            three-way ecosystem where Learner, Teacher, and Parent experiences talk to each other in real time.
          </p>
          <div className="space-y-4">
            {[
              { icon: Target, title: 'Curriculum-true', desc: "Every lesson maps to KICD's Grade → Subject → Strand → Sub-strand hierarchy." },
              { icon: Heart, title: 'Family-first', desc: 'Built for mid-range Android phones and patchy data, because that\'s the reality for most households.' },
              { icon: Globe2, title: 'Locally rooted', desc: 'Kenyan references, M-Pesa payments, and English/Kiswahili support throughout.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-3 items-start">
                  <div className="w-9 h-9 bg-[var(--elimu-amber-50)] text-[var(--elimu-amber-600)] rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{item.title}</h4>
                    <p className="text-stone-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-3xl overflow-hidden shadow-xl">
          <img src={img('heroTeacherTablet', { w: 800, h: 600 })} alt="A teacher using a tablet to guide a Kenyan classroom lesson" className="w-full h-80 lg:h-full object-cover" />
        </motion.div>
      </section>

      <section className="py-16 px-6 bg-stone-50">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-extrabold text-stone-900">The team behind ElimuSphere</h2>
            <div className="h-1 w-16 bg-[var(--elimu-amber-500)] mx-auto mt-3 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 text-center"
              >
                <img src={img(member.image, { w: 600, h: 600 })} alt={member.name} className="w-full h-44 object-cover" loading="lazy" />
                <div className="p-4">
                  <h4 className="font-bold text-stone-900 text-sm">{member.name}</h4>
                  <p className="text-stone-400 text-xs">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
