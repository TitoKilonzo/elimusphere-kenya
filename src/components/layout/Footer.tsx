import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[var(--elimu-ink-950)] border-t border-stone-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 text-xs text-left">
        <div className="col-span-2 lg:col-span-1">
          <span className="font-display font-extrabold text-lg text-white">
            ElimuSphere <span className="text-[var(--elimu-amber-400)]">Kenya</span>
          </span>
          <p className="text-stone-400 mt-3 leading-relaxed">
            One subscription, one app, every grade - PP1 to Grade 12, mapped to KICD's curriculum tree and KNEC's CBAF bands.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-stone-200 uppercase tracking-wider mb-3">About</h4>
          <ul className="space-y-2 text-stone-400">
            <li><Link to="/about" className="hover:text-[var(--elimu-amber-400)] transition-colors">Our Mission</Link></li>
            <li><Link to="/careers" className="hover:text-[var(--elimu-amber-400)] transition-colors">Careers</Link></li>
            <li><Link to="/pricing" className="hover:text-[var(--elimu-amber-400)] transition-colors">Pricing Plans</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-stone-200 uppercase tracking-wider mb-3">Support</h4>
          <ul className="space-y-2 text-stone-400">
            <li><Link to="/contact" className="hover:text-[var(--elimu-amber-400)] transition-colors">Contact Us</Link></li>
            <li><Link to="/faqs" className="hover:text-[var(--elimu-amber-400)] transition-colors">FAQs</Link></li>
            <li><Link to="/admin" className="hover:text-[var(--elimu-amber-400)] transition-colors">System Status</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-stone-200 uppercase tracking-wider mb-3">Learn</h4>
          <ul className="space-y-2 text-stone-400">
            <li><Link to="/library" className="hover:text-[var(--elimu-amber-400)] transition-colors">Digital Library</Link></li>
            <li><Link to="/blog" className="hover:text-[var(--elimu-amber-400)] transition-colors">Curriculum Blog</Link></li>
            <li><Link to="/signup" className="hover:text-[var(--elimu-amber-400)] transition-colors">Create Account</Link></li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <h4 className="font-bold text-stone-200 uppercase tracking-wider mb-3">Connect</h4>
          <div className="flex -space-x-1.5 mb-4">
            <span className="w-7 h-7 rounded-full bg-blue-500 border-2 border-[var(--elimu-ink-950)] flex items-center justify-center text-[9px] text-white font-bold cursor-pointer" title="Facebook">FB</span>
            <span className="w-7 h-7 rounded-full bg-stone-700 border-2 border-[var(--elimu-ink-950)] flex items-center justify-center text-[9px] text-white font-bold cursor-pointer" title="X">X</span>
            <span className="w-7 h-7 rounded-full bg-red-600 border-2 border-[var(--elimu-ink-950)] flex items-center justify-center text-[9px] text-white font-bold cursor-pointer" title="YouTube">YT</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--elimu-green-500)] rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-[var(--elimu-green-500)] uppercase tracking-wide">All Systems Operational</span>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800 px-6 py-4 flex flex-wrap items-center justify-center gap-3 text-[10px] text-stone-500 font-semibold uppercase tracking-widest">
        <span>© 2026 ElimuSphere Kenya</span>
        <span className="hidden md:inline">•</span>
        <span>Safaricom M-Pesa Integrated</span>
        <span className="hidden md:inline">•</span>
        <span>KNEC CBA Aligned</span>
      </div>
    </footer>
  );
}
