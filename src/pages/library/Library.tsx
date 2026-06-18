import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BookOpen, Download, MessageSquare, Star } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { CBCResource } from '../../types';
import { INITIAL_RESOURCES } from '../../data/resources';
import { img } from '../../lib/images';

interface ResourceComment {
  id: string;
  author: string;
  text: string;
  rating: number;
  timestamp: string;
}

interface LibraryProps {
  extraResources?: CBCResource[];
}

const TYPE_FILTERS = ['All', 'Scheme of Work', 'Lesson Plan', 'Worksheet', 'Past Paper', 'Marking Scheme', 'Revision Notes'];

export default function Library({ extraResources = [] }: LibraryProps) {
  const { showToast } = useToast();

  const [resources, setResources] = useState<CBCResource[]>([...extraResources, ...INITIAL_RESOURCES]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, ResourceComment[]>>({});

  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentRating, setCommentRating] = useState(5);

  const filtered = resources.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = r.title.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q) || r.author.toLowerCase().includes(q);
    const matchesType = typeFilter === 'All' || r.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleDownload = (id: string, title: string) => {
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, downloads: r.downloads + 1 } : r)));
    showToast(`"${title}" download started.`);
  };

  const handleAddComment = (resourceId: string) => {
    if (!commentAuthor.trim() || !commentText.trim()) {
      showToast('Please provide your name and a comment.', 'error');
      return;
    }
    const newComment: ResourceComment = {
      id: 'CMT-' + Date.now(),
      author: commentAuthor.trim(),
      text: commentText.trim(),
      rating: commentRating,
      timestamp: 'Just now',
    };
    setComments((prev) => {
      const updated = [newComment, ...(prev[resourceId] || [])];
      const avg = Math.round((updated.reduce((sum, c) => sum + c.rating, 0) / updated.length) * 10) / 10;
      setResources((res) => res.map((r) => (r.id === resourceId ? { ...r, rating: avg } : r)));
      return { ...prev, [resourceId]: updated };
    });
    setCommentAuthor('');
    setCommentText('');
    setCommentRating(5);
    showToast('Thank you - your review has been added.');
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-[var(--elimu-amber-600)]">
          <BookOpen className="w-6 h-6" />
          <h3 className="font-extrabold text-stone-900 text-base">CBC Curriculum Digital Library</h3>
        </div>

        <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-3">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schemes, past papers, lessons..."
              className="w-full p-2.5 pl-9 text-xs border border-stone-200 bg-stone-50 rounded-xl outline-none focus:border-[var(--elimu-amber-500)]"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full md:w-auto p-2.5 text-xs border border-stone-200 bg-stone-50 rounded-xl font-semibold outline-none focus:border-[var(--elimu-amber-500)]">
            {TYPE_FILTERS.map((t) => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <p className="font-bold text-stone-700 mb-1">No resources match your search</p>
          <p className="text-xs">Try a different keyword or clear the type filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((res, i) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
            >
              <div className="relative h-32 overflow-hidden">
                <img src={img(res.imageQuery as any, { w: 800, h: 420 })} alt="" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-white/90 text-[var(--elimu-amber-700)] rounded-full text-[10px] font-extrabold uppercase">
                  {res.type}
                </span>
                <span className="absolute top-2.5 right-2.5 px-2 py-1 bg-white/90 text-stone-700 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[var(--elimu-amber-500)] text-[var(--elimu-amber-500)]" /> {res.rating}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h4 className="font-extrabold text-stone-950 text-sm leading-snug mb-2">{res.title}</h4>
                <p className="text-stone-400 text-xs mb-3">{res.subject} · {res.grade}</p>
                <p className="text-stone-500 text-[11px] mb-4">Contributed by {res.author}</p>

                <div className="border-t border-stone-100 pt-4 mt-auto space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setExpandedId(expandedId === res.id ? null : res.id)}
                      className="text-[var(--elimu-amber-600)] hover:text-[var(--elimu-amber-700)] font-bold text-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-4 h-4" /> Reviews ({(comments[res.id] || []).length})
                    </button>
                    <button
                      onClick={() => handleDownload(res.id, res.title)}
                      className="px-3.5 py-1.5 bg-[var(--elimu-ink-950)] hover:bg-stone-800 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                    <span>Ref: {res.id}</span>
                    <span>{res.downloads} Downloads</span>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === res.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-dashed border-stone-200 overflow-hidden">
                      <h5 className="text-xs font-black text-stone-900 mb-3 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[var(--elimu-amber-500)]" /> Comments & Reviews
                      </h5>

                      <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 mb-4 scrollbar-thin">
                        {(comments[res.id] || []).length === 0 ? (
                          <p className="text-[11px] text-stone-400 italic">No reviews yet. Be the first to review this material.</p>
                        ) : (
                          (comments[res.id] || []).map((cmt) => (
                            <div key={cmt.id} className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-[11px] space-y-1">
                              <div className="flex justify-between items-center font-bold text-stone-700">
                                <span className="text-stone-900 truncate">{cmt.author}</span>
                                <span className="flex items-center gap-0.5 shrink-0">
                                  {[1, 2, 3, 4, 5].map((val) => (
                                    <Star
                                      key={val}
                                      className={`w-3 h-3 ${val <= cmt.rating ? 'fill-[var(--elimu-amber-500)] text-[var(--elimu-amber-500)]' : 'text-stone-300'}`}
                                    />
                                  ))}
                                </span>
                              </div>
                              <p className="text-stone-500 leading-relaxed break-words">{cmt.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="bg-[var(--elimu-amber-50)]/60 border border-[var(--elimu-amber-100)] p-3 rounded-xl space-y-3">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--elimu-amber-600)] block">Post a Review</span>
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={commentAuthor}
                          onChange={(e) => setCommentAuthor(e.target.value)}
                          className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs font-semibold outline-none focus:border-[var(--elimu-amber-400)]"
                        />
                        <div className="flex items-center justify-between bg-white border border-stone-200 rounded-lg p-2 text-xs">
                          <span className="text-[10px] text-stone-400 font-semibold">Rating:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((val) => (
                              <button key={val} type="button" onClick={() => setCommentRating(val)} className="cursor-pointer active:scale-95 transition-transform">
                                <Star className={`w-3.5 h-3.5 ${val <= commentRating ? 'fill-[var(--elimu-amber-500)] text-[var(--elimu-amber-500)]' : 'text-stone-300'}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <textarea
                          placeholder="Write your feedback..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          rows={2}
                          className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs outline-none focus:border-[var(--elimu-amber-400)]"
                        />
                        <button onClick={() => handleAddComment(res.id)} className="w-full py-2 bg-[var(--elimu-amber-500)] hover:bg-[var(--elimu-amber-600)] text-white font-extrabold rounded-lg text-xs cursor-pointer transition-colors">
                          Submit Review
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
