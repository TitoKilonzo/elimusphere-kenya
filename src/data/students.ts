import { StudentProfile, mpesaTransaction, SchoolStaff, SupportTicket } from '../types';

export function buildInitialStudent(name: string, email: string, grade: string): StudentProfile {
  return {
    id: 'STU-' + Date.now().toString(36).toUpperCase(),
    name,
    email,
    grade,
    points: 1250,
    badges: ['Fractions Master', 'Reading Streak', 'Science Explorer'],
    streak: 7,
    weeklyHours: 13,
    gradeHistory: {
      Mathematics: 82,
      'Science and Technology': 76,
      English: 91,
      Kiswahili: 68,
    },
    attendance: [
      { date: new Date(Date.now() - 4 * 86400000).toISOString(), status: 'Present' },
      { date: new Date(Date.now() - 3 * 86400000).toISOString(), status: 'Present' },
      { date: new Date(Date.now() - 2 * 86400000).toISOString(), status: 'Late' },
      { date: new Date(Date.now() - 1 * 86400000).toISOString(), status: 'Present' },
      { date: new Date().toISOString(), status: 'Present' },
    ],
    feePaid: 12000,
    feeTotal: 16000,
  };
}

export const INITIAL_PAYMENT_HISTORY: mpesaTransaction[] = [
  {
    id: 'TXN-001',
    phone: '0712345678',
    amount: 1500,
    status: 'Completed',
    reference: 'ELMQX92K1',
    timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
    purpose: 'Learner - Monthly Plan',
  },
  {
    id: 'TXN-002',
    phone: '0712345678',
    amount: 4000,
    status: 'Completed',
    reference: 'ELM7TH22A',
    timestamp: new Date(Date.now() - 30 * 86400000).toISOString(),
    purpose: 'School Fees Installment',
  },
];

export const INITIAL_STAFF: SchoolStaff[] = [
  { id: 'STF-01', name: 'Nancy Wanjiku', role: 'Teacher', email: 'nancy.wanjiku@elimusphere.ke', phone: '0712000111', salary: 45000, status: 'Active' },
  { id: 'STF-02', name: 'David Kemei', role: 'Teacher', email: 'david.kemei@elimusphere.ke', phone: '0712000222', salary: 48000, status: 'Active' },
  { id: 'STF-03', name: 'Susan Achieng', role: 'Principal', email: 'susan.achieng@elimusphere.ke', phone: '0712000333', salary: 95000, status: 'Active' },
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  { id: 'TCK-101', user: 'Grace Mwangi', category: 'Billing', subject: 'M-Pesa payment for Termly plan did not reflect', status: 'Open', date: new Date(Date.now() - 86400000).toISOString().slice(0, 10) },
  { id: 'TCK-102', user: 'Mwalimu Kiprotich', category: 'Content', subject: 'Requesting Grade 9 Agriculture scheme of work template', status: 'Open', date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10) },
  { id: 'TCK-103', user: 'Peter Otieno', category: 'Technical', subject: 'App not loading offline lessons on Tecno phone', status: 'Resolved', date: new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10) },
];
