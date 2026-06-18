import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, Calendar, PhoneCall } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface Admission {
  id: string;
  name: string;
  grade: string;
  date: string;
}

const GRADE_OPTIONS = ['PP1', 'PP2', 'Grade 1', 'Grade 4', 'Grade 8', 'Grade 9'];

const TIMETABLE_SLOTS = [
  { time: '08:00 AM - 08:35 AM', subject: 'Language Activities (English)', teacher: 'Nancy Wanjiku', status: 'Active' },
  { time: '08:35 AM - 09:10 AM', subject: 'Mathematical Activities', teacher: 'Nancy Wanjiku', status: 'Active' },
  { time: '09:10 AM - 09:45 AM', subject: 'CBE Practical - Garden Weeding', teacher: 'Kiprotich', status: 'Community Field' },
  { time: '09:45 AM - 10:15 AM', subject: 'Break & Snack Time', teacher: 'Assigned Matron', status: 'Relaxation' },
  { time: '10:15 AM - 10:50 AM', subject: 'Science and Technology', teacher: 'David Kemei', status: 'Science Lab' },
];

export default function SchoolDashboard() {
  const { showToast } = useToast();

  const [admissions, setAdmissions] = useState<Admission[]>([
    { id: 'ADM-01', name: 'Kelvin Mutisya', grade: 'Grade 4', date: new Date(Date.now() - 86400000).toISOString().slice(0, 10) },
    { id: 'ADM-02', name: 'Faith Njeri', grade: 'PP2', date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10) },
  ]);
  const [newAdmitName, setNewAdmitName] = useState('');
  const [newAdmitGrade, setNewAdmitGrade] = useState('PP1');

  const [smsTarget, setSmsTarget] = useState('All Parents');
  const [smsText, setSmsText] = useState('Reminder: Term 2 closes this Friday. Please collect report cards from the school office.');

  const handleAdmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmitName.trim()) {
      showToast('Please enter the learner\'s full name.', 'error');
      return;
    }
    setAdmissions((prev) => [{ id: 'ADM-' + Date.now(), name: newAdmitName.trim(), grade: newAdmitGrade, date: new Date().toISOString().slice(0, 10) }, ...prev]);
    setNewAdmitName('');
    showToast(`${newAdmitName.trim()} admitted into ${newAdmitGrade}.`);
  };

  const handleBroadcast = () => {
    if (!smsText.trim()) {
      showToast('Write a message before broadcasting.', 'error');
      return;
    }
    showToast(`Broadcasted SMS to ${smsTarget} successfully.`);
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Admissions */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-stone-900 text-sm mb-2 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[var(--elimu-amber-500)]" /> CBC Class Admissions
          </h3>
          <p className="text-stone-400 text-xs mb-4">Onboard new learners into class streams</p>

          <form onSubmit={handleAdmit} className="space-y-4 mb-5">
            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Learner Full Name</label>
              <input
                type="text"
                value={newAdmitName}
                onChange={(e) => setNewAdmitName(e.target.value)}
                placeholder="e.g. Kelvin Mutisya"
                className="w-full p-2.5 text-xs bg-white border border-stone-200 rounded-xl outline-none focus:border-[var(--elimu-amber-500)]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Target Class</label>
              <select value={newAdmitGrade} onChange={(e) => setNewAdmitGrade(e.target.value)} className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[var(--elimu-amber-500)]">
                {GRADE_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full py-2 bg-[var(--elimu-amber-500)] text-white font-bold rounded-lg text-xs hover:bg-[var(--elimu-amber-600)] transition cursor-pointer">
              Admit Learner
            </button>
          </form>
        </div>

        <div>
          <h4 className="font-bold text-xs text-stone-700 tracking-wide mb-2 uppercase">Recent Admissions</h4>
          <div className="space-y-2">
            {admissions.map((adm) => (
              <div key={adm.id} className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-[11px] flex justify-between items-center">
                <div>
                  <span className="font-bold text-stone-700 block">{adm.name}</span>
                  <span className="text-stone-400">{adm.grade} · Registered {adm.date}</span>
                </div>
                <span className="px-2 py-0.5 bg-[var(--elimu-green-50)] text-[var(--elimu-green-600)] text-[9px] font-black rounded-full uppercase">Approved</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Timetable */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
        <h3 className="font-extrabold text-stone-900 text-sm mb-2 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-600" /> Class Timetable
        </h3>
        <p className="text-stone-400 text-xs mb-4">Auto-generated, conflict-free slots</p>

        <div className="space-y-3 text-xs">
          {TIMETABLE_SLOTS.map((slot, i) => (
            <div key={i} className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex justify-between gap-3 items-center">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">{slot.time}</span>
                <span className="font-extrabold text-stone-900 mt-0.5 block">{slot.subject}</span>
                <span className="text-stone-400 font-medium mt-0.5 block text-[10px]">Instructor: {slot.teacher}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-sky-50 text-sky-800 rounded">{slot.status}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bulk SMS */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-stone-900 text-sm mb-2 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-[var(--elimu-green-600)]" /> Bulk SMS Broadcaster
          </h3>
          <p className="text-stone-400 text-xs mb-4">Notify parents and guardians instantly</p>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Target Audience</label>
              <select value={smsTarget} onChange={(e) => setSmsTarget(e.target.value)} className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[var(--elimu-green-500)]">
                <option value="All Parents">All Parents (Grade 1-12)</option>
                <option value="Grade 6 Parents">Grade 6 Parents Only</option>
                <option value="Staff Teachers Only">Staff Teachers Only</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Message Body</label>
              <textarea
                value={smsText}
                onChange={(e) => setSmsText(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-stone-200 rounded-xl h-24 text-stone-700 font-semibold outline-none focus:border-[var(--elimu-green-500)]"
                rows={3}
              />
            </div>
            <button onClick={handleBroadcast} className="w-full py-2.5 bg-[var(--elimu-green-500)] hover:bg-[var(--elimu-green-600)] text-white font-bold rounded-lg text-xs cursor-pointer shadow">
              Broadcast SMS Bundle
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-stone-400">
          <span>SMS Credit Balance: </span>
          <span className="font-bold text-stone-900">14,281 Credits Remaining</span>
        </div>
      </motion.div>
    </div>
  );
}
