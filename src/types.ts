/**
 * ELIMUSPHERE KENYA - Type Definitions
 */

// ---------------------------------------------------------------
// Auth & Account
// ---------------------------------------------------------------

export type UserRole = 'learner' | 'teacher' | 'parent' | 'school' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  grade?: string; // learners: PP1 - Grade 12
  pathway?: 'STEM' | 'Social Sciences' | 'Arts & Sports Science';
  subjects?: string[]; // teachers
  schoolName?: string; // school role
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// ---------------------------------------------------------------
// Learner / AI
// ---------------------------------------------------------------

export interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  grade: string; // PP1 - Grade 12
  points: number;
  badges: string[];
  streak: number;
  weeklyHours: number;
  gradeHistory: { [subject: string]: number };
  attendance: { date: string; status: 'Present' | 'Absent' | 'Late' }[];
  feePaid: number;
  feeTotal: number;
}

// ---------------------------------------------------------------
// Curriculum / CBAF
// ---------------------------------------------------------------

export type CBAFBand = 'EE1' | 'EE2' | 'ME1' | 'ME2' | 'AE1' | 'AE2' | 'BE1' | 'BE2';

export interface CBAFMapping {
  band: 'Exceeding Expectations' | 'Meeting Expectations' | 'Approaching Expectations' | 'Below Expectations';
  subLevel: CBAFBand;
  minScore: number;
  maxScore: number;
  points: number;
}

export const CBAF_TABLE: CBAFMapping[] = [
  { band: 'Exceeding Expectations', subLevel: 'EE1', minScore: 90, maxScore: 100, points: 8 },
  { band: 'Exceeding Expectations', subLevel: 'EE2', minScore: 75, maxScore: 89, points: 7 },
  { band: 'Meeting Expectations', subLevel: 'ME1', minScore: 58, maxScore: 74, points: 6 },
  { band: 'Meeting Expectations', subLevel: 'ME2', minScore: 41, maxScore: 57, points: 5 },
  { band: 'Approaching Expectations', subLevel: 'AE1', minScore: 31, maxScore: 40, points: 4 },
  { band: 'Approaching Expectations', subLevel: 'AE2', minScore: 21, maxScore: 30, points: 3 },
  { band: 'Below Expectations', subLevel: 'BE1', minScore: 11, maxScore: 20, points: 2 },
  { band: 'Below Expectations', subLevel: 'BE2', minScore: 0, maxScore: 10, points: 1 },
];

export function getCbafBand(score: number): CBAFMapping {
  const found = CBAF_TABLE.find((m) => score >= m.minScore && score <= m.maxScore);
  return found || CBAF_TABLE[CBAF_TABLE.length - 1];
}

// ---------------------------------------------------------------
// Resources / Library
// ---------------------------------------------------------------

export interface CBCResource {
  id: string;
  title: string;
  type: 'Scheme of Work' | 'Lesson Plan' | 'Worksheet' | 'Past Paper' | 'Marking Scheme' | 'Revision Notes';
  subject: string;
  grade: string;
  downloads: number;
  rating: number;
  author: string;
  imageQuery: string;
}

export interface SchemeOfWork {
  id: string;
  subject: string;
  grade: string;
  term: 1 | 2 | 3;
  weeks: {
    week: number;
    strand: string;
    subStrand: string;
    specificLearningOutcomes: string;
    learningResources: string;
    assessmentMethods: string;
  }[];
}

// ---------------------------------------------------------------
// School ERP
// ---------------------------------------------------------------

export interface SchoolStaff {
  id: string;
  name: string;
  role: 'Teacher' | 'Administrator' | 'Principal' | 'Tutor';
  email: string;
  phone: string;
  salary: number;
  status: 'Active' | 'On Leave';
}

export interface mpesaTransaction {
  id: string;
  phone: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed';
  reference: string;
  timestamp: string;
  purpose: string;
}

export interface SupportTicket {
  id: string;
  user: string;
  category: 'Billing' | 'Technical' | 'Content' | 'General';
  subject: string;
  status: 'Open' | 'Resolved';
  date: string;
}
