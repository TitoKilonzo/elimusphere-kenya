import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DollarSign, Sparkles, BookMarked, Smartphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiFetch, ApiError } from '../../lib/api';
import { StudentProfile, mpesaTransaction } from '../../types';
import { buildInitialStudent, INITIAL_PAYMENT_HISTORY } from '../../data/students';

const PLAN_AMOUNTS: Record<string, number> = {
  'Learner - Monthly': 1500,
  'Learner - Termly': 4000,
  'Parents Package - Termly': 5500,
  'Schools Package - Termly': 16000,
  'School Fees Payment': 5000,
};

export default function ParentDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [student] = useState<StudentProfile>(() => buildInitialStudent('Jomo Mwangi', 'jomo.mwangi@elimusphere.ke', 'Grade 6'));
  const [paymentHistory, setPaymentHistory] = useState<mpesaTransaction[]>(INITIAL_PAYMENT_HISTORY);

  const [mpesaPhone, setMpesaPhone] = useState('');
  const [mpesaPlan, setMpesaPlan] = useState('Learner - Monthly');
  const [mpesaAmount, setMpesaAmount] = useState(PLAN_AMOUNTS['Learner - Monthly']);
  const [isMpesaLoading, setIsMpesaLoading] = useState(false);

  const [parentReport, setParentReport] = useState('');
  const [isReportLoading, setIsReportLoading] = useState(false);

  const handlePlanChange = (plan: string) => {
    setMpesaPlan(plan);
    setMpesaAmount(PLAN_AMOUNTS[plan] ?? 0);
  };

  const handleMpesaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mpesaPhone.trim()) {
      showToast('Please enter your M-Pesa phone number.', 'error');
      return;
    }
    if (!/^(0|\+?254)\d{9}$/.test(mpesaPhone.replace(/\s/g, ''))) {
      showToast('Enter a valid Safaricom number, e.g. 0712345678.', 'error');
      return;
    }

    setIsMpesaLoading(true);
    try {
      const data = await apiFetch<{ success: boolean; message: string; reference: string; status: string; timestamp: string }>('/mpesa/pay', {
        method: 'POST',
        body: { phone: mpesaPhone, amount: mpesaAmount, planName: mpesaPlan },
      });

      if (data.success) {
        setPaymentHistory((prev) => [
          { id: 'TXN-' + Date.now(), phone: mpesaPhone, amount: mpesaAmount, status: data.status as any, reference: data.reference, timestamp: data.timestamp, purpose: mpesaPlan },
          ...prev,
        ]);
        showToast(data.message);
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not reach the payment gateway.';
      showToast(message, 'error');
    } finally {
      setIsMpesaLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsReportLoading(true);
    try {
      const attendanceRate = Math.round(
        (student.attendance.filter((a) => a.status === 'Present').length / student.attendance.length) * 100
      );
      const data = await apiFetch<{ letter: string }>('/ai/parent', {
        method: 'POST',
        body: {
          studentName: student.name,
          grade: student.grade,
          grades: student.gradeHistory,
          attendanceRate,
          points: student.points,
          badges: student.badges,
        },
      });
      setParentReport(data.letter);
      showToast('Home guide report ready.');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not generate the report right now.';
      showToast(message, 'error');
    } finally {
      setIsReportLoading(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT: M-Pesa payments */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
          <div className="flex items-center gap-3 text-[var(--elimu-green-600)] mb-4">
            <DollarSign className="w-6 h-6 shrink-0" />
            <div>
              <h3 className="font-extrabold text-stone-900 text-sm leading-tight">Safaricom M-Pesa Gateway</h3>
              <span className="text-[10px] text-stone-400">Pay subscription or tuition fees</span>
            </div>
          </div>

          <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs mb-4">
            <div className="flex justify-between font-semibold text-stone-600 py-1 border-b border-stone-100">
              <span>Child Name</span>
              <span className="font-bold text-stone-900">{student.name}</span>
            </div>
            <div className="flex justify-between font-semibold text-stone-600 py-1 border-b border-stone-100">
              <span>Outstanding Fees</span>
              <span className="text-red-600 font-bold">KES {(student.feeTotal - student.feePaid).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-stone-600 py-1">
              <span>Class Level</span>
              <span>{student.grade}</span>
            </div>
          </div>

          <form onSubmit={handleMpesaSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">M-Pesa Phone Number</label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(e.target.value)}
                  placeholder="e.g. 0712345678"
                  className="w-full pl-9 p-2.5 text-xs bg-white border border-stone-200 rounded-xl outline-none focus:border-[var(--elimu-green-500)]"
                  maxLength={13}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Payment Purpose</label>
              <select value={mpesaPlan} onChange={(e) => handlePlanChange(e.target.value)} className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[var(--elimu-green-500)]">
                <option value="Learner - Monthly">Learner - Monthly (KES 1,500)</option>
                <option value="Learner - Termly">Learner - Termly (KES 4,000)</option>
                <option value="Parents Package - Termly">Parents Package - Termly (KES 5,500)</option>
                <option value="Schools Package - Termly">Schools Package - Termly (KES 16,000)</option>
                <option value="School Fees Payment">Pay Custom Tuition Installment</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Amount (KES)</label>
              <input
                type="number"
                value={mpesaAmount}
                onChange={(e) => setMpesaAmount(Number(e.target.value))}
                className="w-full p-2.5 text-xs bg-white border border-stone-200 rounded-xl font-bold text-[var(--elimu-green-600)] outline-none focus:border-[var(--elimu-green-500)]"
              />
            </div>

            <button
              type="submit"
              disabled={isMpesaLoading}
              className="w-full py-3 bg-[var(--elimu-green-500)] hover:bg-[var(--elimu-green-600)] text-white font-extrabold rounded-xl transition text-xs flex items-center justify-center gap-2 cursor-pointer shadow disabled:opacity-60"
            >
              {isMpesaLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending STK Push...
                </>
              ) : (
                'Pay with M-Pesa'
              )}
            </button>
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
          <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-3">Recent Receipts</h3>
          <div className="space-y-3 max-h-[260px] overflow-y-auto scrollbar-thin">
            {paymentHistory.map((tx) => (
              <div key={tx.id} className="p-3 bg-stone-50 rounded-xl border border-stone-150 text-[11px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-stone-700">{tx.purpose}</span>
                  <span className="text-[var(--elimu-green-600)] font-extrabold">KES {tx.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Ref: {tx.reference}</span>
                  <span>{new Date(tx.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* RIGHT: AI insight + attendance */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3 border-b border-stone-100 pb-4">
            <div>
              <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--elimu-amber-500)]" />
                Mwalimu Parent Support Counselor
              </h3>
              <p className="text-stone-400 text-xs">A plain-language progress summary, generated from {student.name}'s record card</p>
            </div>
            <button
              onClick={handleGenerateReport}
              disabled={isReportLoading}
              className="px-4 py-2 bg-[var(--elimu-amber-500)] text-white font-bold rounded-lg text-xs hover:bg-[var(--elimu-amber-600)] transition disabled:opacity-60 cursor-pointer shrink-0"
            >
              {isReportLoading ? 'Synthesizing report...' : 'Build Home Guide Report'}
            </button>
          </div>

          {parentReport ? (
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">{parentReport}</div>
          ) : (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 bg-[var(--elimu-green-50)] text-[var(--elimu-green-600)] rounded-full flex items-center justify-center mx-auto shadow-sm">
                <BookMarked className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">No report drafted yet</h4>
                <p className="text-stone-400 text-[11px] max-w-sm mx-auto mt-1">
                  Click "Build Home Guide Report" above. Mwalimu AI will study {student.name}'s grades and attendance to draft a guide for home revision.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
          <h3 className="font-bold text-stone-900 text-sm mb-2">Attendance Calendar</h3>
          <p className="text-stone-400 text-xs mb-4">Confirmed via the school's gate check-in log</p>
          <div className="grid grid-cols-5 gap-3">
            {student.attendance.map((att, idx) => (
              <div key={idx} className="bg-stone-50 border border-stone-100 rounded-xl p-3 text-center text-xs">
                <span className="block font-semibold text-stone-500 mb-1">{new Date(att.date).toLocaleDateString([], { weekday: 'short' })}</span>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    att.status === 'Present' ? 'bg-[var(--elimu-green-50)] text-[var(--elimu-green-600)]' : att.status === 'Late' ? 'bg-[var(--elimu-amber-100)] text-[var(--elimu-amber-800)]' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {att.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
