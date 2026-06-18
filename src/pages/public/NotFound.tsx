import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, GraduationCap } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-68px)] flex items-center justify-center px-6 text-center">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="w-16 h-16 bg-[var(--elimu-amber-50)] text-[var(--elimu-amber-500)] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="font-display text-5xl font-extrabold text-stone-900 mb-2">404</h1>
        <p className="text-stone-500 text-sm mb-7 max-w-sm mx-auto">
          This page wandered off the curriculum tree. Let's get you back to a Grade → Subject → Strand that exists.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--elimu-amber-500)] text-white font-bold rounded-xl hover:bg-[var(--elimu-amber-600)] transition-colors cursor-pointer shadow-lg"
        >
          <Home className="w-4 h-4" /> Back to home
        </Link>
      </motion.div>
    </div>
  );
}
