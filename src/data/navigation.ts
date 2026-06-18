import { UserRole } from '../types';

export interface NavLink {
  label: string;
  path: string;
}

/** Public links shown to everyone, regardless of auth state. */
export const PUBLIC_LINKS: NavLink[] = [
  { label: 'Home', path: '/' },
  { label: 'Library', path: '/library' },
  { label: 'Pricing', path: '/pricing' },
];

/** Where "Go to my dashboard" sends a logged-in user, by role. */
export const DASHBOARD_PATH: Record<UserRole, string> = {
  learner: '/learner',
  teacher: '/teacher',
  parent: '/parent',
  school: '/school',
  admin: '/admin',
};

/** Friendly label for each role, used in onboarding and badges. */
export const ROLE_LABEL: Record<UserRole, string> = {
  learner: 'Learner',
  teacher: 'Teacher',
  parent: 'Parent / Guardian',
  school: 'School Administrator',
  admin: 'Platform Admin',
};

export const ROLE_HOME_TITLE: Record<UserRole, string> = {
  learner: 'Learner Zone',
  teacher: 'Teacher Hub',
  parent: 'Parent Monitor',
  school: 'School ERP',
  admin: 'Core Systems',
};

export const GRADES: string[] = [
  'PP1', 'PP2',
  'Grade 1', 'Grade 2', 'Grade 3',
  'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9',
  'Grade 10', 'Grade 11', 'Grade 12',
];

export const PATHWAYS = ['STEM', 'Social Sciences', 'Arts & Sports Science'] as const;

export const SUBJECTS_BY_LEVEL: Record<string, string[]> = {
  primary: ['Mathematics', 'English', 'Kiswahili', 'Science and Technology', 'Social Studies', 'Agriculture & Nutrition', 'CRE'],
  junior: ['Mathematics', 'English', 'Kiswahili', 'Integrated Science', 'Social Studies', 'Pre-Technical Studies', 'Agriculture'],
  senior: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'History', 'Geography', 'Business Studies', 'Music', 'Fine Art'],
};
