import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, GraduationCap, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ApiError } from '../../lib/api';
import { DASHBOARD_PATH } from '../../data/navigation';
import { img } from '../../lib/images';

const DEMO_ACCOUNTS = [
  { label: 'Learner', email: 'jomo.mwangi@elimusphere.ke', password: 'password123' },
  { label: 'Teacher', email: 'nancy.wanjiku@elimusphere.ke', password: 'password123' },
  { label: 'Parent', email: 'parent.mwangi@elimusphere.ke', password: 'password123' },
];

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(email.trim().toLowerCase(), password);
      showToast(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(from || DASHBOARD_PATH[user.role], { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Could not reach the server. Check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[number]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-68px)] grid grid-cols-1 lg:grid-cols-2">
      {/* Form side */}
      <div className="flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-[var(--elimu-amber-500)] rounded-xl flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-extrabold text-lg text-stone-900">
              ElimuSphere <span className="text-[var(--elimu-amber-500)]">Kenya</span>
            </span>
          </div>

          <h1 className="font-display text-2xl font-extrabold text-stone-900 mb-1">Welcome back</h1>
          <p className="text-stone-500 text-sm mb-7">Log in to continue your CBC learning journey.</p>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-xl p-3 mb-5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-200 rounded-xl bg-stone-50 outline-none focus:border-[var(--elimu-amber-500)] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide">Password</label>
                <Link to="/forgot-password" className="text-[11px] font-semibold text-[var(--elimu-amber-600)] hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-9 pr-10 py-2.5 text-sm border border-stone-200 rounded-xl bg-stone-50 outline-none focus:border-[var(--elimu-amber-500)] focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[var(--elimu-amber-500)] text-white font-bold rounded-xl hover:bg-[var(--elimu-amber-600)] transition-all text-sm shadow-lg shadow-[var(--elimu-amber-500)]/20 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Log In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            New to ElimuSphere?{' '}
            <Link to="/signup" className="font-bold text-[var(--elimu-amber-600)] hover:underline">
              Create a free account
            </Link>
          </p>

          {/* Demo accounts */}
          <div className="mt-8 pt-6 border-t border-stone-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Try a demo account</p>
            <div className="flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.label}
                  type="button"
                  onClick={() => fillDemo(acc)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-[var(--elimu-amber-50)] hover:text-[var(--elimu-amber-700)] text-stone-600 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {acc.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-stone-400 mt-2">Password for all demo accounts: <span className="font-mono font-semibold">password123</span></p>
          </div>
        </motion.div>
      </div>

      {/* Image side */}
      <div className="hidden lg:block relative">
        <img src={img('authClassroom', { w: 1200, h: 1400 })} alt="Students collaborating during a CBC classroom session" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--elimu-ink-950)]/80 via-[var(--elimu-ink-950)]/10 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="font-display text-2xl font-extrabold leading-snug mb-2">
            "ElimuSphere gives every mwalimu, pupil, and parent the same picture of progress."
          </p>
          <p className="text-stone-300 text-sm">CBAF-aligned reporting, mapped to KICD's curriculum tree.</p>
        </div>
      </div>
    </div>
  );
}
