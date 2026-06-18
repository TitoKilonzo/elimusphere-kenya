import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function Contact() {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill in every field before sending.', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Message sent - our team will respond within 24 hours.');
  };

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
      <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <span className="inline-block px-3 py-1 bg-[var(--elimu-amber-50)] text-[var(--elimu-amber-600)] text-xs font-bold rounded-full mb-4 uppercase tracking-widest">
          We're here to help
        </span>
        <h1 className="font-display text-3xl font-extrabold text-stone-900 mb-4">Get in touch</h1>
        <p className="text-stone-500 text-sm leading-relaxed mb-8 max-w-md">
          Questions about pricing, school bulk plans, or a technical issue? Reach out and our team based in Nairobi
          will respond within one business day.
        </p>

        <div className="space-y-5">
          {[
            { icon: Mail, label: 'Email', value: 'support@elimusphere.ke' },
            { icon: Phone, label: 'Phone / WhatsApp', value: '+254 712 345 678' },
            { icon: MapPin, label: 'Office', value: 'Westlands, Nairobi, Kenya' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--elimu-amber-50)] text-[var(--elimu-amber-600)] rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-stone-400 text-[10px] uppercase font-bold">{item.label}</p>
                  <p className="text-stone-800 text-sm font-semibold">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-7">
        {submitted ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 bg-[var(--elimu-green-50)] text-[var(--elimu-green-600)] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-stone-900 text-base mb-1">Message sent!</h3>
            <p className="text-stone-500 text-sm">Thanks, {name.split(' ')[0]} - we'll be in touch at {email} shortly.</p>
            <button onClick={() => setSubmitted(false)} className="mt-5 text-[var(--elimu-amber-600)] font-bold text-xs hover:underline cursor-pointer">
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1.5">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mary Achieng"
                className="w-full p-2.5 text-sm border border-stone-200 rounded-xl bg-stone-50 outline-none focus:border-[var(--elimu-amber-500)] focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-2.5 text-sm border border-stone-200 rounded-xl bg-stone-50 outline-none focus:border-[var(--elimu-amber-500)] focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1.5">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="How can we help?"
                className="w-full p-2.5 text-sm border border-stone-200 rounded-xl bg-stone-50 outline-none focus:border-[var(--elimu-amber-500)] focus:bg-white transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[var(--elimu-amber-500)] text-white font-bold rounded-xl hover:bg-[var(--elimu-amber-600)] transition-all text-sm shadow-lg shadow-[var(--elimu-amber-500)]/20 cursor-pointer flex items-center justify-center gap-2"
            >
              Send message <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
