import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Send, Flame, Trophy, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiFetch, ApiError } from '../../lib/api';
import { ChatMessage, StudentProfile } from '../../types';
import { CBAFBadge, cbafBandColor } from '../../components/ui/CBAFBadge';
import { buildInitialStudent } from '../../data/students';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';

const QUIZ_BANK = [
  {
    text: 'A farmer harvested 84 kg of maize and sold 3/4 of it at the local market. How many kilograms did the farmer sell?',
    options: [
      { id: 'A', text: '21 kg' },
      { id: 'B', text: '42 kg' },
      { id: 'C', text: '63 kg' },
      { id: 'D', text: '84 kg' },
    ],
    correctId: 'C',
    explanation: '3/4 of 84 kg = (3 × 84) ÷ 4 = 252 ÷ 4 = 63 kg. The farmer sold 63 kg and kept 21 kg.',
  },
  {
    text: 'Which part of a plant is mainly responsible for absorbing water and minerals from the soil?',
    options: [
      { id: 'A', text: 'Leaves' },
      { id: 'B', text: 'Roots' },
      { id: 'C', text: 'Stem' },
      { id: 'D', text: 'Flowers' },
    ],
    correctId: 'B',
    explanation: 'Roots anchor the plant and absorb water and dissolved minerals, which travel up through the stem to the leaves.',
  },
];

const GRADE_OPTIONS = ['PP1', 'PP2', 'Grade 1', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 9', 'Grade 10'];
const SUBJECT_OPTIONS = ['Mathematics', 'Science and Technology', 'Kiswahili', 'English', 'Agriculture & Nutrition'];

export default function LearnerDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [student, setStudent] = useState<StudentProfile>(() =>
    buildInitialStudent(user?.name || 'Learner', user?.email || '', user?.grade || 'Grade 6')
  );

  const [learnerGrade, setLearnerGrade] = useState(user?.grade || 'Grade 6');
  const [learnerSubject, setLearnerSubject] = useState('Mathematics');
  const [learnerTopic, setLearnerTopic] = useState('Fractions and decimals');

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'model', text: `Habari ${user?.name?.split(' ')[0] || ''}! I'm Mwalimu AI. Ask me anything about your ${learnerSubject} syllabus.`, timestamp: 'Just now' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const quizQuestion = QUIZ_BANK[quizIndex % QUIZ_BANK.length];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiLoading]);

  const averageGrade = useMemo(() => {
    const values: number[] = Object.values(student.gradeHistory);
    if (values.length === 0) return 0;
    return Math.round(values.reduce((sum: number, v: number) => sum + v, 0) / values.length);
  }, [student.gradeHistory]);

  const chartData = useMemo(
    () => Object.entries(student.gradeHistory).map(([subject, score]) => ({ subject, score })),
    [student.gradeHistory]
  );

  const handleSendTutorMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiLoading) return;

    const userMsg: ChatMessage = { id: 'm-' + Date.now(), sender: 'user', text: chatInput.trim(), timestamp: 'Just now' };
    const updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    setChatInput('');
    setIsAiLoading(true);

    try {
      const data = await apiFetch<{ reply: string }>('/ai/student', {
        method: 'POST',
        body: { grade: learnerGrade, subject: learnerSubject, topic: learnerTopic, messages: updated },
      });
      setChatMessages((prev) => [...prev, { id: 'm-' + Date.now() + 1, sender: 'model', text: data.reply, timestamp: 'Just now' }]);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Mwalimu AI is unreachable right now. Please try again shortly.';
      setChatMessages((prev) => [...prev, { id: 'm-' + Date.now() + 1, sender: 'model', text: message, timestamp: 'Just now' }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleQuizSubmit = () => {
    if (!quizSelectedAnswer) {
      showToast('Choose an answer option first.', 'error');
      return;
    }
    setQuizAnswered(true);
    if (quizSelectedAnswer === quizQuestion.correctId) {
      setStudent((prev) => ({ ...prev, points: prev.points + 50 }));
      showToast('Correct! +50 Elimu Points added.');
    } else {
      showToast("Not quite, but a great try - here's the explanation.", 'info');
    }
  };

  const nextQuiz = () => {
    setQuizIndex((i) => i + 1);
    setQuizAnswered(false);
    setQuizSelectedAnswer(null);
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT: Profile + progress + quiz */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 bg-[var(--elimu-amber-50)] rounded-full flex items-center justify-center font-display font-extrabold text-2xl text-[var(--elimu-amber-600)] border-2 border-[var(--elimu-amber-400)]">
              {student.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">{student.name}</h3>
              <span className="px-2 py-0.5 bg-[var(--elimu-amber-50)] text-[var(--elimu-amber-700)] rounded-full text-xs font-semibold">{student.grade}</span>
              <span className="text-stone-400 text-xs block mt-1">{student.email}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5 text-center">
            <div className="bg-[var(--elimu-amber-50)] p-3 rounded-xl border border-[var(--elimu-amber-100)]">
              <span className="block text-[10px] font-bold text-stone-500 uppercase">Elimu Points</span>
              <span className="text-xl font-display font-black text-[var(--elimu-amber-600)]">{student.points.toLocaleString()}</span>
            </div>
            <div className="bg-[var(--elimu-green-50)] p-3 rounded-xl border border-emerald-100">
              <span className="block text-[10px] font-bold text-stone-500 uppercase">Daily Streak</span>
              <span className="text-xl font-display font-black text-[var(--elimu-green-600)] flex items-center justify-center gap-1">
                <Flame className="w-4 h-4" /> {student.streak} Days
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs font-semibold text-stone-500 mb-1">
              <span>Weekly Learning Target</span>
              <span>{student.weeklyHours} / 20 Hours</span>
            </div>
            <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(student.weeklyHours / 20) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="bg-[var(--elimu-green-500)] h-full rounded-full"
              />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Competency Badges</h4>
            <div className="flex flex-wrap gap-1.5">
              {student.badges.map((b, i) => (
                <span key={i} className="px-2 py-1 bg-stone-100 text-stone-700 text-[10px] rounded font-bold border border-stone-200 flex items-center gap-1">
                  <Award className="w-3 h-3 text-[var(--elimu-amber-500)]" /> {b}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
          <h3 className="text-sm font-bold text-stone-900 mb-1 flex items-center justify-between">
            <span>CBA Progress by Subject</span>
            <span className="text-xs text-[var(--elimu-green-600)] font-semibold">Avg: {averageGrade}%</span>
          </h3>
          <p className="text-stone-400 text-[11px] mb-3">Scored against KNEC's CBAF bands</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1EBE3" />
                <XAxis dataKey="subject" tick={{ fontSize: 9, fill: '#A9978A' }} interval={0} angle={-15} textAnchor="end" height={40} />
                <YAxis tick={{ fontSize: 10, fill: '#A9978A' }} domain={[0, 100]} />
                <Tooltip
                  formatter={(value: any) => [`${value}%`, 'Score']}
                  contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #F1EBE3' }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={cbafBandColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {chartData.map((d) => (
              <CBAFBadge key={d.subject} score={d.score} />
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-[var(--elimu-amber-50)]/70 border border-[var(--elimu-amber-200)] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[var(--elimu-amber-700)] uppercase tracking-wider">CBE Quick Challenge</span>
            <span className="text-xs font-extrabold text-[var(--elimu-amber-600)]">+50 Points</span>
          </div>
          <p className="text-sm font-bold text-stone-800 mb-4">{quizQuestion.text}</p>
          <div className="space-y-2 mb-4">
            {quizQuestion.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => !quizAnswered && setQuizSelectedAnswer(opt.id)}
                className={`w-full text-left p-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  quizSelectedAnswer === opt.id
                    ? 'bg-[var(--elimu-amber-100)] border-[var(--elimu-amber-500)] text-[var(--elimu-amber-900)]'
                    : 'bg-white hover:bg-stone-50 border-stone-100 text-stone-700'
                }`}
              >
                <span className="font-extrabold mr-2 text-[var(--elimu-amber-600)]">{opt.id}.</span> {opt.text}
              </button>
            ))}
          </div>

          {!quizAnswered ? (
            <button onClick={handleQuizSubmit} className="w-full py-2 bg-[var(--elimu-amber-500)] hover:bg-[var(--elimu-amber-600)] text-white font-bold rounded-lg text-xs cursor-pointer transition-colors">
              Lock Answer
            </button>
          ) : (
            <div className="bg-white p-3 rounded-xl border border-[var(--elimu-amber-100)] text-[11px] text-stone-700">
              <p className={`font-bold mb-1 ${quizSelectedAnswer === quizQuestion.correctId ? 'text-[var(--elimu-green-600)]' : 'text-red-600'}`}>
                {quizSelectedAnswer === quizQuestion.correctId ? 'Correct! Well done.' : "Let's learn together:"}
              </p>
              <p className="leading-relaxed mb-2">{quizQuestion.explanation}</p>
              <button onClick={nextQuiz} className="text-[var(--elimu-amber-600)] font-extrabold uppercase tracking-wider text-[10px] cursor-pointer">
                Next Question →
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* RIGHT: AI tutor */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
          <div className="flex items-center gap-2 text-[var(--elimu-amber-600)] mb-4">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-stone-900 text-base">Configure Mwalimu AI</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Grade</label>
              <select value={learnerGrade} onChange={(e) => setLearnerGrade(e.target.value)} className="w-full p-2.5 text-xs border border-stone-200 rounded-lg bg-stone-50 outline-none focus:border-[var(--elimu-amber-500)]">
                {GRADE_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Subject</label>
              <select value={learnerSubject} onChange={(e) => setLearnerSubject(e.target.value)} className="w-full p-2.5 text-xs border border-stone-200 rounded-lg bg-stone-50 outline-none focus:border-[var(--elimu-amber-500)]">
                {SUBJECT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Active Topic</label>
              <input
                type="text"
                value={learnerTopic}
                onChange={(e) => setLearnerTopic(e.target.value)}
                placeholder="e.g. Living Things"
                className="w-full p-2.5 text-xs border border-stone-200 rounded-lg bg-white outline-none focus:border-[var(--elimu-amber-500)]"
              />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="bg-white rounded-2xl border border-stone-100 shadow-sm flex flex-col h-[500px]">
          <div className="p-4 border-b border-stone-100 bg-stone-50 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-[var(--elimu-amber-500)] rounded-full flex items-center justify-center text-white font-black text-sm font-display">AI</div>
                <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 bg-[var(--elimu-green-500)] rounded-full border-2 border-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">Mwalimu AI Tutor</h4>
                <p className="text-[10px] text-stone-400">Scope: {learnerGrade} · {learnerSubject}</p>
              </div>
            </div>
            <button
              onClick={() => setChatMessages([{ id: '1', sender: 'model', text: 'Habari! Workspace refreshed. Ask me anything about your syllabus.', timestamp: 'Just now' }])}
              className="text-xs font-semibold text-stone-400 hover:text-[var(--elimu-amber-600)] cursor-pointer"
            >
              Clear Chat
            </button>
          </div>

          <div className="flex-grow p-4 overflow-y-auto space-y-4 text-xs scrollbar-thin">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3.5 ${msg.sender === 'user' ? 'bg-[var(--elimu-ink-950)] text-white rounded-tr-none' : 'bg-stone-100 text-stone-800 rounded-tl-none border border-stone-200'}`}>
                  <div className="flex justify-between items-center mb-1 text-[9px] opacity-70 font-semibold gap-4">
                    <span>{msg.sender === 'user' ? 'Me' : 'Mwalimu AI'}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isAiLoading && (
              <div className="flex justify-start">
                <div className="bg-stone-50 text-stone-500 rounded-2xl p-3 border border-stone-200 rounded-tl-none flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-[var(--elimu-amber-500)] rounded-full animate-bounce" />
                  <span className="inline-block w-2 h-2 bg-[var(--elimu-amber-500)] rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="inline-block w-2 h-2 bg-[var(--elimu-amber-500)] rounded-full animate-bounce [animation-delay:0.3s]" />
                  <span>Mwalimu is preparing an explanation...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendTutorMessage} className="p-3 border-t border-stone-100 bg-stone-50 rounded-b-2xl flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder='Ask: "Can you explain fractions using shilling coins?"'
              className="flex-grow p-3 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-[var(--elimu-amber-500)]"
              disabled={isAiLoading}
            />
            <button type="submit" className="p-3 bg-[var(--elimu-amber-500)] text-white rounded-xl hover:bg-[var(--elimu-amber-600)] transition-colors cursor-pointer disabled:opacity-60" disabled={isAiLoading}>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
