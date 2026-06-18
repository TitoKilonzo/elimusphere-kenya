import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, User as UserIcon, GraduationCap, AlertCircle, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ApiError } from '../../lib/api';
import { DASHBOARD_PATH, GRADES, PATHWAYS, ROLE_LABEL, SUBJECTS_BY_LEVEL } from '../../data/navigation';
import { UserRole } from '../../types';
import { img } from '../../lib/images';

const ROLE_OPTIONS: { role: UserRole; title: string; desc: string }[] = [
  { role: 'learner', title: 'Learner', desc: 'PP1 - Grade 12 student' },
  { role: 'teacher', title: 'Teacher', desc: 'Free Educator account' },
  { role: 'parent', title: 'Parent / Guardian', desc: 'Track your children' },
  { role: 'school', title: 'School Admin', desc: 'Manage your institution' },
];

function isSeniorGrade(grade: string) {
  const n = parseInt(grade.replace('Grade ', ''), 10);
  return !Number.isNaN(n) && n >= 10;
}

export default function Signup() {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<UserRole>('learner');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Role-specific fields
  const [grade, setGrade] = useState('Grade 6');
  const [pathway, setPathway] = useState<typeof PATHWAYS[number]>('STEM');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [schoolName, setSchoolName] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSubject = (subj: string) => {
    setSubjects((prev) => (prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]));
  };

  const validateStep1 = () => {
    if (!name.trim()) return 'Please enter your full name.';
    if (!email.trim() || !email.includes('@')) return 'Please enter a valid email address.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const goToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateStep1();
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (role === 'teacher' && subjects.length === 0) {
      setError('Please select at least one subject you teach.');
      return;
    }
    if (role === 'school' && !schoolName.trim()) {
      setError('Please enter your school or institution name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      };
      if (role === 'learner') {
        payload.grade = grade;
        if (isSeniorGrade(grade)) payload.pathway = pathway;
      }
      if (role === 'teacher') {
        payload.subjects = subjects;
      }
      if (role === 'school') {
        payload.schoolName = schoolName.trim();
      }

      const user = await signup(payload);
      showToast(`Welcome to ElimuSphere, ${user.name.split(' ')[0]}!`);
      navigate(DASHBOARD_PATH[user.role], { replace: true });
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

  const seniorPrimaryGrades = GRADES.filter((g) => !isSeniorGrade(g));
  const seniorGrades = GRADES.filter((g) => isSeniorGrade(g));

  const teacherLevelSubjects = Array.from(
    new Set([...SUBJECTS_BY_LEVEL.primary, ...SUBJECTS_BY_LEVEL.junior, ...SUBJECTS_BY_LEVEL.senior])
  );

  return (
    <div className="min-h-[calc(100vh-68px)] grid grid-cols-1 lg:grid-cols-2">
      {/* Image side */}
      <div className="hidden lg:block relative order-2 lg:order-1">
        <img src={img('authStudyGroup', { w: 1200, h: 1400 })} alt="A study group of Kenyan students preparing for assessments" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--elimu-ink-950)]/80 via-[var(--elimu-ink-950)]/10 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="font-display text-2xl font-extrabold leading-snug mb-2">
            One account. Every grade. Three connected roles.
          </p>
          <p className="text-stone-300 text-sm">Teachers stay free by default - it's how the platform grows.</p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center px-6 py-12 order-1 lg:order-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-7">
            <div className="w-10 h-10 bg-[var(--elimu-amber-500)] rounded-xl flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-extrabold text-lg text-stone-900">
              ElimuSphere <span className="text-[var(--elimu-amber-500)]">Kenya</span>
            </span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`flex items-center gap-2 text-xs font-bold ${step >= 1 ? 'text-[var(--elimu-amber-600)]' : 'text-stone-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step > 1 ? 'bg-[var(--elimu-amber-500)] border-[var(--elimu-amber-500)] text-white' : step === 1 ? 'border-[var(--elimu-amber-500)]' : 'border-stone-300'}`}>
                {step > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
              </span>
              Account
            </div>
            <div className={`flex-1 h-px ${step > 1 ? 'bg-[var(--elimu-amber-500)]' : 'bg-stone-200'}`} />
            <div className={`flex items-center gap-2 text-xs font-bold ${step >= 2 ? 'text-[var(--elimu-amber-600)]' : 'text-stone-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step === 2 ? 'border-[var(--elimu-amber-500)]' : 'border-stone-300'}`}>2</span>
              Role
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-xl p-3 mb-5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                onSubmit={goToStep2}
                className="space-y-4"
              >
                <h1 className="font-display text-2xl font-extrabold text-stone-900 mb-1">Create your account</h1>
                <p className="text-stone-500 text-sm mb-5">Free to start. You can change your role details later.</p>

                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1.5">Full name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Achieng Otieno"
                      autoComplete="name"
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-200 rounded-xl bg-stone-50 outline-none focus:border-[var(--elimu-amber-500)] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        autoComplete="new-password"
                        className="w-full pl-9 pr-9 py-2.5 text-sm border border-stone-200 rounded-xl bg-stone-50 outline-none focus:border-[var(--elimu-amber-500)] focus:bg-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1.5">Confirm</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-200 rounded-xl bg-stone-50 outline-none focus:border-[var(--elimu-amber-500)] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[var(--elimu-amber-500)] text-white font-bold rounded-xl hover:bg-[var(--elimu-amber-600)] transition-all text-sm shadow-lg shadow-[var(--elimu-amber-500)]/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <h1 className="font-display text-2xl font-extrabold text-stone-900 mb-1">How will you use ElimuSphere?</h1>
                <p className="text-stone-500 text-sm mb-5">This shapes your dashboard - you can adjust details anytime.</p>

                <div className="grid grid-cols-2 gap-2.5">
                  {ROLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.role}
                      type="button"
                      onClick={() => setRole(opt.role)}
                      className={`text-left p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        role === opt.role
                          ? 'border-[var(--elimu-amber-500)] bg-[var(--elimu-amber-50)]'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <p className={`font-bold text-sm ${role === opt.role ? 'text-[var(--elimu-amber-700)]' : 'text-stone-800'}`}>{opt.title}</p>
                      <p className="text-stone-400 text-[11px] mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Role-specific fields */}
                <AnimatePresence mode="wait">
                  {role === 'learner' && (
                    <motion.div key="learner-fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1.5">Your grade</label>
                        <select
                          value={grade}
                          onChange={(e) => setGrade(e.target.value)}
                          className="w-full p-2.5 text-sm border border-stone-200 rounded-xl bg-stone-50 outline-none focus:border-[var(--elimu-amber-500)]"
                        >
                          <optgroup label="Early Years & Middle School">
                            {seniorPrimaryGrades.map((g) => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </optgroup>
                          <optgroup label="Senior School">
                            {seniorGrades.map((g) => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </optgroup>
                        </select>
                      </div>
                      {isSeniorGrade(grade) && (
                        <div>
                          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1.5">Pathway</label>
                          <div className="grid grid-cols-3 gap-2">
                            {PATHWAYS.map((p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setPathway(p)}
                                className={`p-2 rounded-lg border-2 text-[11px] font-bold transition-all cursor-pointer ${
                                  pathway === p ? 'border-[var(--elimu-amber-500)] bg-[var(--elimu-amber-50)] text-[var(--elimu-amber-700)]' : 'border-stone-200 text-stone-600 hover:border-stone-300'
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {role === 'teacher' && (
                    <motion.div key="teacher-fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1.5">Subjects you teach</label>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1 scrollbar-thin">
                        {teacherLevelSubjects.map((subj) => (
                          <button
                            key={subj}
                            type="button"
                            onClick={() => toggleSubject(subj)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-bold border-2 transition-all cursor-pointer ${
                              subjects.includes(subj)
                                ? 'border-[var(--elimu-amber-500)] bg-[var(--elimu-amber-50)] text-[var(--elimu-amber-700)]'
                                : 'border-stone-200 text-stone-600 hover:border-stone-300'
                            }`}
                          >
                            {subj}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {role === 'school' && (
                    <motion.div key="school-fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1.5">School / institution name</label>
                      <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="e.g. Greenfield Academy, Nairobi"
                        className="w-full p-2.5 text-sm border border-stone-200 rounded-xl bg-stone-50 outline-none focus:border-[var(--elimu-amber-500)]"
                      />
                    </motion.div>
                  )}

                  {role === 'parent' && (
                    <motion.div key="parent-fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-stone-500 bg-stone-50 border border-stone-100 rounded-xl p-3">
                      After signing up, you'll be able to link your children's learner accounts from your Parent dashboard.
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-3 border border-stone-200 text-stone-600 font-bold rounded-xl text-sm hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-[var(--elimu-amber-500)] text-white font-bold rounded-xl hover:bg-[var(--elimu-amber-600)] transition-all text-sm shadow-lg shadow-[var(--elimu-amber-500)]/20 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {step === 1 && (
            <p className="text-center text-sm text-stone-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[var(--elimu-amber-600)] hover:underline">
                Log in
              </Link>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
