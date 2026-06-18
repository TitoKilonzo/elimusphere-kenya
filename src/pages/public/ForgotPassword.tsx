import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, GraduationCap, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-[calc(100vh-68px)] flex items-center justify-center px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 bg-[var(--elimu-amber-500)] rounded-xl flex items-center justify-center shadow-md">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-extrabold text-lg text-stone-900">
            ElimuSphere <span className="text-[var(--elimu-amber-500)]">Kenya</span>
          </span>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-7 text-center">
            <div className="w-12 h-12 bg-[var(--elimu-green-50)] text-[var(--elimu-green-600)] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-stone-900 text-base mb-1">Check your inbox</h2>
            <p className="text-stone-500 text-sm">If an account exists for {email}, a reset link is on its way.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-7">
            <h1 className="font-display text-xl font-extrabold text-stone-900 mb-1">Reset your password</h1>
            <p className="text-stone-500 text-sm mb-6">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-200 rounded-xl bg-stone-50 outline-none focus:border-[var(--elimu-amber-500)] focus:bg-white transition-colors"
                />
              </div>
              <button type="submit" className="w-full py-3 bg-[var(--elimu-amber-500)] text-white font-bold rounded-xl hover:bg-[var(--elimu-amber-600)] transition-all text-sm shadow-lg shadow-[var(--elimu-amber-500)]/20 cursor-pointer">
                Send reset link
              </button>
            </form>
          </div>
        )}

        <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm font-semibold text-stone-500 hover:text-[var(--elimu-amber-600)] mt-6 cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to log in
        </Link>
      </motion.div>
    </div>
  );
}
