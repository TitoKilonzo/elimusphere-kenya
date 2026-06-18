import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  User, Users, BookOpen, BarChart3, CheckCircle2, Sparkles, Trophy, ShieldCheck, Download, ArrowRight,
} from 'lucide-react';
import { img } from '../../lib/images';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import StrandPath from '../../components/ui/StrandPath';
import { useAuth } from '../../context/AuthContext';
import { DASHBOARD_PATH } from '../../data/navigation';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function Landing() {
  const { user } = useAuth();
  const primaryCta = user ? DASHBOARD_PATH[user.role] : '/signup';

  return (
    <div className="flex flex-col">
      {/* ------------------------------------------------------------- HERO */}
      <header className="relative bg-[var(--elimu-ink-950)] overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute top-0 right-0 w-[28rem] h-[28rem] bg-[var(--elimu-amber-500)] rounded-full blur-[140px] -mr-48 -mt-32" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--elimu-green-500)] rounded-full blur-[120px] -ml-32 -mb-32" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.12, delayChildren: 0.05 }}
            className="w-full lg:w-1/2 text-left"
          >
            <motion.span
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="inline-block px-3 py-1 bg-[var(--elimu-amber-500)]/15 text-[var(--elimu-amber-400)] text-xs font-bold rounded-full mb-5 uppercase tracking-widest"
            >
              AI-Powered Kenyan CBC/CBE Platform
            </motion.span>
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="font-display text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] mb-5"
            >
              One app for every step of your child's <span className="text-[var(--elimu-amber-400)]">CBC journey</span>
            </motion.h1>
            <motion.p variants={fadeUp} transition={{ duration: 0.6 }} className="text-stone-300 text-base md:text-lg mb-8 max-w-xl leading-relaxed">
              From PP1 to Senior School, ElimuSphere brings Mwalimu AI tutoring, KICD-aligned lessons,
              CBAF-scored assessments, and real-time parent reports - plus M-Pesa fee payments - into a
              single offline-friendly companion for Learners, Teachers, and Parents.
            </motion.p>
            <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="flex flex-wrap gap-3 mb-10">
              <Link
                to={primaryCta}
                className="px-6 py-3 bg-[var(--elimu-amber-500)] text-white font-bold rounded-xl shadow-lg shadow-[var(--elimu-amber-500)]/20 hover:bg-[var(--elimu-amber-600)] transition-all cursor-pointer transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                {user ? 'Go to my dashboard' : 'Get started free'} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/library"
                className="px-6 py-3 bg-white/5 text-white font-bold rounded-xl border border-white/15 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer"
              >
                Browse the Library
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
              <StrandPath steps={['Grade', 'Subject', 'Strand', 'Sub-strand', 'Lesson']} className="max-w-md" />
            </motion.div>
          </motion.div>

          {/* Hero photo + live stat card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-float-slow">
              <img
                src={img('heroClassroom', { w: 900, h: 620 })}
                alt="Kenyan students engaged in an interactive classroom lesson"
                className="w-full h-[280px] sm:h-[360px] lg:h-[420px] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--elimu-ink-950)]/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--elimu-green-500)] rounded-full flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-wide">Mwalimu AI</h4>
                  <p className="text-emerald-300 text-xs font-medium">24/7 homework explanations in English & Kiswahili</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-6 hidden sm:flex bg-white rounded-2xl shadow-2xl p-4 gap-4 w-[90%] max-w-sm border border-stone-100">
              <div className="grid grid-cols-2 gap-3 w-full text-left">
                <div>
                  <p className="text-stone-400 text-[10px] uppercase font-bold">Active Learners</p>
                  <p className="text-xl font-display font-extrabold text-stone-900">
                    <AnimatedCounter value={284912} />
                  </p>
                </div>
                <div>
                  <p className="text-stone-400 text-[10px] uppercase font-bold">M-Pesa Status</p>
                  <p className="text-xl font-display font-extrabold text-[var(--elimu-green-600)]">Connected</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ------------------------------------------------------------- ROLE CARDS */}
      <section className="pt-20 pb-12 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-extrabold text-stone-900 tracking-tight">Built around three connected roles</h2>
          <div className="h-1 w-20 bg-[var(--elimu-amber-500)] mx-auto mt-3 rounded-full" />
          <p className="text-stone-500 max-w-xl mx-auto mt-3 text-sm">
            Learner, Teacher, and Parent experiences that talk to each other in real time - plus a School ERP for the whole institution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              to: '/learner',
              title: 'Learner Portal',
              icon: User,
              image: 'learnerPortal',
              accent: 'var(--elimu-amber-500)',
              accentBg: 'bg-[var(--elimu-amber-50)]',
              accentText: 'text-[var(--elimu-amber-600)]',
              border: 'hover:border-[var(--elimu-amber-300)]',
              desc: 'Personalised homework support for PP1 to Grade 12 - quizzes, past papers, and CBAF-scored progress.',
              points: ['Gamified XP & streaks', 'KNEC CBA exam prep'],
              cta: 'Enter Learner Zone',
            },
            {
              to: '/teacher',
              title: 'Teacher Hub',
              icon: BookOpen,
              image: 'teacherHub',
              accent: 'var(--elimu-sky-500)',
              accentBg: 'bg-sky-50',
              accentText: 'text-sky-600',
              border: 'hover:border-sky-300',
              desc: 'AI-assisted lesson plans, schemes of work, and CBAF rubrics. Publish to the shared digital library.',
              points: ['Instant lesson schemes', 'Competency analytics'],
              cta: 'Build Class Materials',
            },
            {
              to: '/parent',
              title: 'Parent Portal',
              icon: Users,
              image: 'parentMonitor',
              accent: 'var(--elimu-green-500)',
              accentBg: 'bg-[var(--elimu-green-50)]',
              accentText: 'text-[var(--elimu-green-600)]',
              border: 'hover:border-emerald-300',
              desc: 'AI progress letters in plain language, attendance logs, and M-Pesa fee payments for every linked child.',
              points: ['M-Pesa STK fee payments', 'Real-time CBAF reports'],
              cta: 'Check Child Progress',
            },
            {
              to: '/school',
              title: 'School ERP',
              icon: BarChart3,
              image: 'schoolErp',
              accent: '#57534E',
              accentBg: 'bg-stone-100',
              accentText: 'text-stone-700',
              border: 'hover:border-stone-300',
              desc: 'Admissions, timetables, staff payroll, and bulk SMS - the operational layer for the whole institution.',
              points: ['Automated timetabling', 'Staff & student directory'],
              cta: 'Manage School',
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden hover:shadow-xl transition-all flex flex-col group ${card.border}`}
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={img(card.image as any, { w: 500, h: 260 })}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className={`absolute bottom-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center ${card.accentBg} ${card.accentText} shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-lg font-bold text-stone-900 mb-2">{card.title}</h3>
                  <p className="text-stone-500 text-xs mb-5 leading-relaxed flex-1">{card.desc}</p>
                  <ul className="text-xs space-y-2 mb-6 text-stone-600">
                    {card.points.map((p) => (
                      <li key={p} className="flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-2 shrink-0" style={{ color: card.accent }} /> {p}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={card.to}
                    className={`w-full mt-auto py-2.5 text-center border rounded-lg text-xs font-bold transition-all cursor-pointer ${card.accentText}`}
                    style={{ borderColor: card.accent }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = card.accent;
                      (e.currentTarget as HTMLElement).style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '';
                      (e.currentTarget as HTMLElement).style.color = '';
                    }}
                  >
                    {card.cta}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------- STATS STRIP */}
      <section className="bg-[var(--elimu-amber-50)]/60 py-14 px-6 border-y border-[var(--elimu-amber-100)]">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Trophy, value: 450000, label: 'Competency badges awarded', sub: 'For science, reading & more', color: 'var(--elimu-amber-500)', bg: 'bg-[var(--elimu-amber-100)]' },
            { icon: ShieldCheck, value: 1480, label: 'Schools enrolled', sub: 'Approved by education officers', color: 'var(--elimu-green-500)', bg: 'bg-[var(--elimu-green-50)]' },
            { icon: Download, value: 24310, label: 'Resources downloaded weekly', sub: 'Lesson plans & schemes of work', color: 'var(--elimu-sky-500)', bg: 'bg-sky-50' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4"
              >
                <div className={`p-3.5 rounded-xl ${s.bg}`} style={{ color: s.color }}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-stone-500 text-xs uppercase font-semibold">{s.label}</h4>
                  <span className="text-2xl font-display font-extrabold text-stone-900 block mt-1">
                    <AnimatedCounter value={s.value} suffix="+" />
                  </span>
                  <span className="text-[10px] text-stone-400">{s.sub}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------- CBAF EXPLAINER */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-3 py-1 bg-[var(--elimu-amber-50)] text-[var(--elimu-amber-600)] text-xs font-bold rounded-full mb-4 uppercase tracking-widest">
              Same language as KJSEA results
            </span>
            <h2 className="font-display text-3xl font-extrabold text-stone-900 mb-4">
              Every score reported in the bands families already know
            </h2>
            <p className="text-stone-500 text-sm leading-relaxed mb-6 max-w-lg">
              All quizzes and assessments map to KNEC's Competency-Based Assessment Framework -
              Exceeding, Meeting, Approaching, and Below Expectations, each split into two sub-levels
              for an 8-point scale. Parents see the same EE/ME/AE/BE language from <span className="font-semibold text-stone-700">cba.knec.ac.ke</span>.
            </p>
            <div className="rounded-2xl overflow-hidden shadow-md border border-stone-100">
              <img src={img('reading', { w: 700, h: 360 })} alt="A learner reviewing assessment feedback with a teacher" className="w-full h-56 object-cover" loading="lazy" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-3">
            {[
              { band: 'Exceeding Expectations', sub: 'EE1 · EE2', range: '75 - 100%', color: 'var(--elimu-green-500)', bg: 'bg-[var(--elimu-green-50)]', text: 'text-[var(--elimu-green-600)]' },
              { band: 'Meeting Expectations', sub: 'ME1 · ME2', range: '41 - 74%', color: 'var(--elimu-sky-500)', bg: 'bg-sky-50', text: 'text-sky-700' },
              { band: 'Approaching Expectations', sub: 'AE1 · AE2', range: '21 - 40%', color: 'var(--elimu-amber-500)', bg: 'bg-[var(--elimu-amber-50)]', text: 'text-[var(--elimu-amber-700)]' },
              { band: 'Below Expectations', sub: 'BE1 · BE2', range: '0 - 20%', color: '#DC2626', bg: 'bg-red-50', text: 'text-red-700' },
            ].map((row, i) => (
              <motion.div
                key={row.band}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`flex items-center justify-between p-4 rounded-2xl border ${row.bg} border-stone-100`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-10 rounded-full" style={{ backgroundColor: row.color }} />
                  <div>
                    <p className={`font-bold text-sm ${row.text}`}>{row.band}</p>
                    <p className="text-stone-400 text-[11px] font-mono">{row.sub}</p>
                  </div>
                </div>
                <span className="font-display font-extrabold text-stone-700 text-sm">{row.range}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------- CTA */}
      <section className="px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto bg-[var(--elimu-ink-950)] rounded-3xl p-10 lg:p-14 relative overflow-hidden text-center"
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[var(--elimu-amber-500)] rounded-full blur-[110px] -mr-20 -mt-20" />
          </div>
          <div className="relative z-10">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Ready to bring Mwalimu AI home?
            </h2>
            <p className="text-stone-300 text-sm max-w-xl mx-auto mb-7">
              Sign up free as a Learner, Teacher, or Parent and start exploring in minutes - no card required for the Educator tier.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/signup" className="px-6 py-3 bg-[var(--elimu-amber-500)] text-white font-bold rounded-xl shadow-lg hover:bg-[var(--elimu-amber-600)] transition-all cursor-pointer">
                Create your free account
              </Link>
              <Link to="/pricing" className="px-6 py-3 bg-white/5 text-white font-bold rounded-xl border border-white/15 hover:bg-white/10 transition-all cursor-pointer">
                View pricing
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
