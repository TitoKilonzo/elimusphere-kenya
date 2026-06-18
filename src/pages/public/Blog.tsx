import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowRight } from 'lucide-react';
import { img } from '../../lib/images';

const POSTS = [
  {
    title: 'Understanding the CBAF bands: a parent\'s guide to EE, ME, AE, and BE',
    excerpt: "What each competency band actually means for your child's learning, and how to read a CBAF report card with confidence.",
    date: 'June 2, 2026',
    image: 'reading' as const,
    tag: 'For Parents',
  },
  {
    title: 'Choosing a Senior School pathway: STEM, Social Sciences, or Arts & Sports Science',
    excerpt: 'A practical breakdown of all three Grade 10 pathways, the subjects each one opens up, and how to help your child decide.',
    date: 'May 21, 2026',
    image: 'science' as const,
    tag: 'Senior School',
  },
  {
    title: 'Five offline activities that build CBC competencies at home',
    excerpt: 'No internet required - simple, Kenyan-context activities that reinforce critical thinking, communication, and digital literacy.',
    date: 'May 9, 2026',
    image: 'agriculture' as const,
    tag: 'Home Learning',
  },
  {
    title: 'A teacher\'s guide to writing schemes of work that map cleanly to KICD',
    excerpt: 'How to structure strand, sub-strand, and specific learning outcome columns so your schemes stay nationally aligned.',
    date: 'April 28, 2026',
    image: 'computerLab' as const,
    tag: 'For Teachers',
  },
];

export default function Blog() {
  return (
    <div className="py-16 px-6 max-w-7xl mx-auto w-full">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 bg-[var(--elimu-amber-50)] text-[var(--elimu-amber-600)] text-xs font-bold rounded-full mb-4 uppercase tracking-widest">
          Curriculum Blog
        </span>
        <h1 className="font-display text-3xl font-extrabold text-stone-900">Notes on the CBC/CBE journey</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {POSTS.map((post, i) => (
          <motion.article
            key={post.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="sm:w-2/5 h-44 sm:h-auto overflow-hidden">
              <img src={img(post.image, { w: 400, h: 320 })} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <span className="text-[10px] font-extrabold text-[var(--elimu-amber-600)] uppercase tracking-wide mb-2">{post.tag}</span>
              <h3 className="font-display font-bold text-stone-900 text-sm leading-snug mb-2">{post.title}</h3>
              <p className="text-stone-500 text-xs leading-relaxed mb-4 flex-1">{post.excerpt}</p>
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                <span className="flex items-center gap-1 text-[var(--elimu-amber-600)] font-bold">Read more <ArrowRight className="w-3 h-3" /></span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
