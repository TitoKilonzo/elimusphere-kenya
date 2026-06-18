import { GoogleGenAI } from '@google/genai';

/**
 * AI layer for ElimuSphere, structured as the brief's three cooperating
 * agents rather than one general chatbot:
 *   - Tutor/Explainer agent  -> answerLearnerQuestion()
 *   - Assessment agent       -> generateTeacherResource()
 *   - Insight agent          -> generateParentInsight()
 *
 * The model name is configurable via GEMINI_MODEL so it can be upgraded
 * without a code change as new Gemini versions ship.
 */

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }
  return client;
}

export function isAiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
}

export class AiNotConfiguredError extends Error {
  constructor() {
    super('The AI tutor is not yet configured on this server. Add a GEMINI_API_KEY to your environment to enable it.');
    this.name = 'AiNotConfiguredError';
  }
}

interface ChatTurn {
  sender: 'user' | 'model';
  text: string;
}

/** Tutor/Explainer agent: conversational, grade-aware homework help. */
export async function answerLearnerQuestion(params: {
  grade: string;
  subject: string;
  topic: string;
  messages: ChatTurn[];
}): Promise<string> {
  if (!isAiConfigured()) throw new AiNotConfiguredError();
  const { grade, subject, topic, messages } = params;

  const contents = messages.map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  const systemInstruction = `You are "Mwalimu AI", a professional, exceptionally friendly, and encouraging CBC/CBE Student Tutor for Kenyan learners in ${grade}, studying ${subject} (topic: ${topic}).
Your scope is strictly aligned with the Kenyan Competency-Based Curriculum (CBC) and Competency Based Education (CBE) frameworks.
- Keep your language perfectly grade-appropriate. For PP1 and PP2, use very simple, fun, short sentences. For Grades 1-6, use clear, descriptive terms. For Junior School (Grades 7-9) and Senior School (Grades 10-12), use academic and conceptual language.
- Introduce actual Kenyan references (e.g. local towns, parks like Maasai Mara, Kenyan shillings, crops like maize, tea, and beans, local sports, names like Mwangi, Achieng, Mutua).
- Format lessons using short paragraphs and bold key terms; include a small interactive check-for-understanding question where useful.
- Never give answers immediately; instead, guide the learner with smart hint questions. Keep responses polite, warm, and concise.`;

  const response = await getClient().models.generateContent({
    model: MODEL,
    contents,
    config: { systemInstruction, temperature: 0.7 },
  });

  return response.text || '';
}

export type TeacherResourceType = 'lessonPlan' | 'exam' | 'markingScheme' | 'worksheet';

/** Assessment agent: generates CBC-aligned teaching materials, calibrated by type. */
export async function generateTeacherResource(params: {
  type: TeacherResourceType;
  grade: string;
  subject: string;
  topic: string;
}): Promise<string> {
  if (!isAiConfigured()) throw new AiNotConfiguredError();
  const { type, grade, subject, topic } = params;

  const systemInstruction = 'You are an expert CBC curriculum developer and educational officer working with the Kenya Institute of Curriculum Development (KICD). Your role is to generate beautiful educational assets strictly aligned with CBE principles.';

  let prompt = '';
  if (type === 'lessonPlan') {
    prompt = `Generate a comprehensive CBC Lesson Plan for ${grade}, Subject: "${subject}", Topic: "${topic}".
Include sections:
1. Key Inquiry Questions (KIQs) (minimum 2)
2. Learning Objectives/Specific Learning Outcomes (Cognitive, Psychomotor, Affective)
3. Core Competencies to be Developed (such as Communication and Collaboration, Critical Thinking, Digital Literacy)
4. Pertinent and Contemporary Issues (PCIs) and Core Values (e.g. Respect, Integrity, Unity)
5. Learning Experiences (Introduction, Step-by-step Development, Conclusion)
6. Assessment Rubrics mapped to the CBAF bands (Exceeding, Meeting, Approaching, Below Expectations)`;
  } else if (type === 'exam') {
    prompt = `Create a CBC Formative Assessment for ${grade}, Subject: "${subject}", Topic: "${topic}".
Write:
- A short header for students (Name, Grade, Date, Instructions)
- Section A: Multiple Choice Questions (5 questions with options A, B, C, D)
- Section B: Short Answer and Critical Thinking Questions (3 questions testing CBC application)
- Section C: A hands-on CBC Practical/Community Project assignment task mirroring KNEC CBA guidelines.`;
  } else if (type === 'markingScheme') {
    prompt = `Generate a detailed Marking Scheme and Teacher Rubric for ${grade}, Subject: "${subject}", Topic: "${topic}".
Provide answers for all sample questions, with guidelines on how to grade different competency levels (mapped to the CBAF EE/ME/AE/BE bands) so teachers can score consistently.`;
  } else if (type === 'worksheet') {
    prompt = `Generate an engaging interactive CBC Activity Worksheet for ${grade}, Subject: "${subject}", Topic: "${topic}".
Include fun tasks, matching activities, fill-in-the-blank questions, and local Kenyan real-world scenarios (e.g. buying produce at a local market, counting trees in a forest reserve) to keep learners engaged.`;
  }

  const response = await getClient().models.generateContent({
    model: MODEL,
    contents: prompt,
    config: { systemInstruction, temperature: 0.5 },
  });

  return response.text || '';
}

/** Insight agent: turns raw progress data into a plain-language summary for parents. */
export async function generateParentInsight(params: {
  studentName: string;
  grade: string;
  grades: Record<string, number>;
  attendanceRate: number;
  points: number;
  badges: string[];
}): Promise<string> {
  if (!isAiConfigured()) throw new AiNotConfiguredError();
  const { studentName, grade, grades, attendanceRate, points, badges } = params;

  const summaryData = `
Student Name: ${studentName}
Grade Level: ${grade}
Subject Grades: ${JSON.stringify(grades)}
Attendance Rate: ${attendanceRate}%
Total Merits/Points: ${points}
Acquired Competency Badges: ${badges.join(', ') || 'None yet'}
`;

  const prompt = `Based on the following academic data, write a warm, detailed, and personalised Parental Progress Report & Home Learning Guide letter.
${summaryData}

Requirements for the response:
- Begin with a supportive greeting to the parent/guardian.
- Give an encouraging summary of the student's holistic performance, referencing their top-graded subjects and badges by name.
- Address areas of improvement positively (how they can progress), referencing the CBAF band language (Exceeding/Meeting/Approaching/Below Expectations) where relevant.
- Suggest 3 creative, offline home learning activities the parent can do with the child to support their specific growth areas.
- Close with an encouraging note about parent-teacher partnership.`;

  const response = await getClient().models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: 'You are the Senior Academic Counselor at ElimuSphere Kenya. You communicate with parents to bridge student performance gaps using warmth, support, and practical activities.',
      temperature: 0.6,
    },
  });

  return response.text || '';
}
