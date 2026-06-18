import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Copy, UploadCloud } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiFetch, ApiError } from '../../lib/api';
import { CBCResource } from '../../types';

const GRADE_OPTIONS = ['PP1', 'PP2', 'Grade 1', 'Grade 3', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 10'];
const SUBJECT_OPTIONS = ['Mathematics', 'Science and Technology', 'Kiswahili Lugha', 'Social Studies & CRE', 'Agriculture & Nutrition', 'Pre-Technical Studies'];

type ResourceType = 'lessonPlan' | 'exam' | 'markingScheme' | 'worksheet';

const RESOURCE_TYPES: { id: ResourceType; label: string }[] = [
  { id: 'lessonPlan', label: 'Lesson Plan' },
  { id: 'exam', label: 'Formative CAT' },
  { id: 'markingScheme', label: 'Marking Scheme' },
  { id: 'worksheet', label: 'Worksheet' },
];

const COMPETENCY_LEVELS = ['Below Expectation', 'Approaches Expectation', 'Meets Expectation', 'Exceeds Expectation'] as const;
type CompetencyLevel = typeof COMPETENCY_LEVELS[number];

interface TeacherDashboardProps {
  onPublish?: (resource: CBCResource) => void;
}

export default function TeacherDashboard({ onPublish }: TeacherDashboardProps) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [grade, setGrade] = useState('Grade 7');
  const [subject, setSubject] = useState('Mathematics');
  const [topic, setTopic] = useState('Identifying soil textures');
  const [resourceType, setResourceType] = useState<ResourceType>('lessonPlan');

  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [competencies, setCompetencies] = useState<Record<string, CompetencyLevel>>({
    'Communication and Collaboration': 'Meets Expectation',
    'Critical Thinking and Problem Solving': 'Approaches Expectation',
    'Digital Literacy': 'Exceeds Expectation',
  });

  const handleGenerate = async () => {
    if (!topic.trim()) {
      showToast('Please enter a specific topic or strand first.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const data = await apiFetch<{ output: string }>('/ai/teacher', {
        method: 'POST',
        body: { type: resourceType, grade, subject, topic },
      });
      setOutput(data.output);
      showToast('Resource generated successfully.');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not generate this resource right now.';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = () => {
    if (!output) {
      showToast('Generate a resource first.', 'error');
      return;
    }
    const labelMap: Record<ResourceType, CBCResource['type']> = {
      lessonPlan: 'Lesson Plan',
      exam: 'Past Paper',
      markingScheme: 'Marking Scheme',
      worksheet: 'Worksheet',
    };
    const resource: CBCResource = {
      id: 'RES-' + Math.floor(Math.random() * 9000 + 100),
      title: `${grade} ${subject} - ${topic}`,
      type: labelMap[resourceType],
      subject,
      grade,
      downloads: 0,
      rating: 5.0,
      author: user?.name || 'ElimuSphere Educator',
      imageQuery: 'computerLab',
    };
    onPublish?.(resource);
    showToast('Published to the shared Digital Library.');
  };

  const gradeCompetency = (comp: string, level: CompetencyLevel) => {
    setCompetencies((prev) => ({ ...prev, [comp]: level }));
    showToast(`Recorded "${level}" for ${comp}.`);
  };

  const levelStyles: Record<CompetencyLevel, string> = {
    'Exceeds Expectation': 'bg-[var(--elimu-green-50)] text-[var(--elimu-green-600)]',
    'Meets Expectation': 'bg-sky-50 text-sky-700',
    'Approaches Expectation': 'bg-[var(--elimu-amber-50)] text-[var(--elimu-amber-700)]',
    'Below Expectation': 'bg-red-50 text-red-700',
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT: Generator controls + rubric */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
          <div className="flex items-center gap-2.5 text-[var(--elimu-amber-600)] mb-4">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-extrabold text-stone-900 text-base">AI Lesson Planner</h3>
          </div>
          <p className="text-stone-500 text-xs mb-4 leading-relaxed">
            Design printable, KICD-compliant classroom materials, scored against standard CBAF rubrics.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Target Grade</label>
              <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium outline-none focus:border-[var(--elimu-amber-500)]">
                {GRADE_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Subject Area</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium outline-none focus:border-[var(--elimu-amber-500)]">
                {SUBJECT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Topic / Strand</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-stone-200 rounded-xl font-semibold outline-none focus:border-[var(--elimu-amber-500)]"
                placeholder="e.g. Identifying soil textures"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-400 mb-2">Resource Type</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {RESOURCE_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setResourceType(type.id)}
                    className={`p-2.5 rounded-lg font-bold border transition-all cursor-pointer ${
                      resourceType === type.id ? 'bg-[var(--elimu-amber-100)] text-[var(--elimu-amber-900)] border-[var(--elimu-amber-500)]' : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-3 bg-[var(--elimu-amber-500)] text-white font-extrabold rounded-xl hover:bg-[var(--elimu-amber-600)] transition-all text-xs cursor-pointer shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Designing Resource...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Develop KICD Asset
                </>
              )}
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
          <h3 className="font-bold text-stone-900 text-sm mb-1">Live Competency Rubric</h3>
          <p className="text-stone-400 text-[11px] mb-3 leading-relaxed">Grade core competencies under the CBC matrix:</p>
          <div className="space-y-4">
            {Object.entries(competencies).map(([compName, level]) => (
              <div key={compName} className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-stone-700">{compName}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${levelStyles[level]}`}>{level}</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {COMPETENCY_LEVELS.map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => gradeCompetency(compName, lvl)}
                      className={`py-1 text-[8px] rounded font-bold uppercase cursor-pointer ${
                        level === lvl ? 'bg-[var(--elimu-amber-500)] text-white' : 'bg-white hover:bg-stone-100 text-stone-400 border border-stone-200'
                      }`}
                    >
                      {lvl.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* RIGHT: Output */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white rounded-2xl border border-stone-100 shadow-xl flex flex-col min-h-[600px]">
          <div className="p-4 border-b border-stone-100 bg-[var(--elimu-ink-950)] rounded-t-2xl flex justify-between items-center text-white">
            <div>
              <h3 className="font-bold text-sm tracking-wide">{isLoading ? 'GENERATING CONTENT...' : 'CBC SCHEMES & LESSON BUILDER OUTPUT'}</h3>
              <p className="text-[10px] text-stone-400">Standard Framework set by the Ministry of Education, Kenya</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!output) return;
                  navigator.clipboard.writeText(output);
                  showToast('Copied to clipboard.');
                }}
                className="px-3 py-1 bg-white/10 text-white rounded text-xs hover:bg-white/20 transition cursor-pointer flex items-center gap-1.5"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
              <button onClick={handlePublish} className="px-3 py-1 bg-[var(--elimu-amber-500)] hover:bg-[var(--elimu-amber-600)] text-white rounded text-xs transition cursor-pointer flex items-center gap-1.5">
                <UploadCloud className="w-3 h-3" /> Publish
              </button>
            </div>
          </div>

          <div className="p-6 flex-grow overflow-y-auto max-h-[500px] text-xs leading-relaxed text-stone-800 scrollbar-thin">
            {output ? (
              <div className="whitespace-pre-wrap">{output}</div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <div className="p-4 bg-[var(--elimu-amber-50)] text-[var(--elimu-amber-600)] rounded-full">
                  <Sparkles className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">No resource generated yet</h4>
                  <p className="text-stone-400 text-[11px] max-w-sm mt-1">
                    Configure your strand and target class on the left, then select "Develop KICD Asset" to compile it.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-stone-50 rounded-b-2xl border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
            <span>Authorized for educational use under CBE license</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
