import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { findByEmail, findById, createUser, toPublicUser, StoredUser } from './userStore';
import { UserRole } from '../src/types';

const JWT_SECRET = process.env.JWT_SECRET || 'elimusphere-dev-secret-change-in-production';
const JWT_EXPIRES_IN = '30d';

const VALID_ROLES: UserRole[] = ['learner', 'teacher', 'parent', 'school', 'admin'];

function signToken(user: StoredUser): string {
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export interface AuthedRequest extends Request {
  userId?: string;
  userRole?: UserRole;
}

/** Express middleware: verifies the Bearer token and attaches userId/userRole. */
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; role: UserRole };
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch {
    return res.status(401).json({ error: 'Your session has expired. Please log in again.' });
  }
}

export const authRouter = express.Router();

/**
 * POST /api/auth/signup
 */
authRouter.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, grade, pathway, subjects, schoolName } = req.body || {};

    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'Please enter your full name.' });
    }
    if (!email || !String(email).includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!password || String(password).length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }
    if (!role || !VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: 'Please choose a valid account role.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (findByEmail(normalizedEmail)) {
      return res.status(409).json({ error: 'An account with this email already exists. Try logging in instead.' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const user = createUser({
      name: String(name).trim(),
      email: normalizedEmail,
      role,
      passwordHash,
      ...(role === 'learner' && grade ? { grade: String(grade) } : {}),
      ...(role === 'learner' && pathway ? { pathway } : {}),
      ...(role === 'teacher' && Array.isArray(subjects) ? { subjects } : {}),
      ...(role === 'school' && schoolName ? { schoolName: String(schoolName).trim() } : {}),
    });

    const token = signToken(user);
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Something went wrong while creating your account. Please try again.' });
  }
});

/**
 * POST /api/auth/login
 */
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both your email and password.' });
    }

    const user = findByEmail(String(email).trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'No account found with that email. Check the address or sign up.' });
    }

    const matches = await bcrypt.compare(String(password), user.passwordHash);
    if (!matches) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    const token = signToken(user);
    res.json({ token, user: toPublicUser(user) });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Something went wrong while logging you in. Please try again.' });
  }
});

/**
 * GET /api/auth/me - returns the current user's profile (used to restore sessions)
 */
authRouter.get('/me', requireAuth, (req: AuthedRequest, res: Response) => {
  const user = findById(req.userId!);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  res.json({ user: toPublicUser(user) });
});
