import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Users, LifeBuoy, Activity, Wifi, WifiOff } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { apiFetch } from '../../lib/api';
import { SchoolStaff, SupportTicket } from '../../types';
import { INITIAL_STAFF, INITIAL_SUPPORT_TICKETS } from '../../data/students';

interface SystemStatus {
  aiConfigured: boolean;
  mpesaConfigured: boolean;
}

export default function AdminDashboard() {
  const { showToast } = useToast();

  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [staff] = useState<SchoolStaff[]>(INITIAL_STAFF);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);

  useEffect(() => {
    apiFetch<SystemStatus>('/system/status', { auth: false })
      .then(setStatus)
      .catch(() => setStatus({ aiConfigured: false, mpesaConfigured: false }));
  }, []);

  const resolveTicket = (id: string) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'Resolved' } : t)));
    showToast('Ticket marked as resolved.');
  };

  const totalPayroll = staff.reduce((sum, s) => sum + s.salary, 0);

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
      {/* System status */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-[var(--elimu-ink-950)] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-5">
          <ShieldCheck className="w-5 h-5 text-[var(--elimu-amber-400)]" />
          <h3 className="font-extrabold text-base">Core Systems Status</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatusCard
            label="Mwalimu AI (Gemini)"
            online={status?.aiConfigured ?? false}
            description={status?.aiConfigured ? 'AI tutor, lesson generator, and parent insights are live.' : 'Add GEMINI_API_KEY to enable AI endpoints.'}
          />
          <StatusCard
            label="M-Pesa Daraja"
            online={status?.mpesaConfigured ?? false}
            description={status?.mpesaConfigured ? 'Real STK Push payments are processing.' : 'Running in simulated sandbox mode.'}
          />
          <StatusCard label="Authentication" online description="JWT sessions and bcrypt password hashing active." />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staff payroll */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--elimu-amber-500)]" /> Staff & Payroll
            </h3>
            <span className="text-xs font-bold text-stone-500">Total: KES {totalPayroll.toLocaleString()}/mo</span>
          </div>
          <div className="space-y-2.5">
            {staff.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs">
                <div>
                  <span className="font-bold text-stone-800 block">{s.name}</span>
                  <span className="text-stone-400">{s.role} · {s.phone}</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-stone-900 block">KES {s.salary.toLocaleString()}</span>
                  <span className={`text-[10px] font-bold ${s.status === 'Active' ? 'text-[var(--elimu-green-600)]' : 'text-[var(--elimu-amber-600)]'}`}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Support tickets */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
          <h3 className="font-extrabold text-stone-900 text-sm mb-4 flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-sky-600" /> Support Queue
          </h3>
          <div className="space-y-2.5">
            {tickets.map((t) => (
              <div key={t.id} className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs">
                <div className="flex justify-between items-start mb-1.5 gap-2">
                  <span className="font-bold text-stone-800 leading-snug">{t.subject}</span>
                  <span className={`shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${t.status === 'Open' ? 'bg-[var(--elimu-amber-100)] text-[var(--elimu-amber-800)]' : 'bg-[var(--elimu-green-50)] text-[var(--elimu-green-600)]'}`}>
                    {t.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-stone-400">
                  <span>{t.user} · {t.category} · {t.date}</span>
                  {t.status === 'Open' && (
                    <button onClick={() => resolveTicket(t.id)} className="text-[var(--elimu-amber-600)] font-bold hover:underline cursor-pointer">
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
        <h3 className="font-extrabold text-stone-900 text-sm mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[var(--elimu-green-600)]" /> Platform Snapshot
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Active Learners', value: '284,912' },
            { label: 'Schools Enrolled', value: '1,480' },
            { label: 'DAU / MAU', value: '38%' },
            { label: 'Open Tickets', value: String(tickets.filter((t) => t.status === 'Open').length) },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-stone-50 rounded-xl border border-stone-100">
              <span className="block text-xl font-display font-extrabold text-stone-900">{stat.value}</span>
              <span className="text-[10px] uppercase font-bold text-stone-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function StatusCard({ label, online, description }: { label: string; online: boolean; description: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-sm">{label}</span>
        {online ? <Wifi className="w-4 h-4 text-[var(--elimu-green-500)]" /> : <WifiOff className="w-4 h-4 text-stone-500" />}
      </div>
      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${online ? 'bg-[var(--elimu-green-500)]/15 text-[var(--elimu-green-500)]' : 'bg-stone-500/15 text-stone-400'}`}>
        {online ? 'Live' : 'Simulated'}
      </span>
      <p className="text-stone-400 text-[11px] mt-2 leading-relaxed">{description}</p>
    </div>
  );
}
