import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { AuthUser, UserRole } from '../src/types';

export interface StoredUser extends AuthUser {
  passwordHash: string;
}

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function seedUsers(): StoredUser[] {
  // Pre-hashed bcrypt hash for "password123" (10 rounds), shared by all demo accounts.
  const demoHash = bcrypt.hashSync('password123', 10);
  const now = new Date().toISOString();

  return [
    {
      id: 'USR-LEARNER-01',
      name: 'Jomo Mwangi',
      email: 'jomo.mwangi@elimusphere.ke',
      role: 'learner' as UserRole,
      grade: 'Grade 6',
      passwordHash: demoHash,
      createdAt: now,
    },
    {
      id: 'USR-TEACHER-01',
      name: 'Nancy Wanjiku',
      email: 'nancy.wanjiku@elimusphere.ke',
      role: 'teacher' as UserRole,
      subjects: ['Mathematics', 'Integrated Science'],
      passwordHash: demoHash,
      createdAt: now,
    },
    {
      id: 'USR-PARENT-01',
      name: 'Grace Mwangi',
      email: 'parent.mwangi@elimusphere.ke',
      role: 'parent' as UserRole,
      passwordHash: demoHash,
      createdAt: now,
    },
  ];
}

let cache: StoredUser[] | null = null;

function load(): StoredUser[] {
  if (cache) return cache;
  ensureDataDir();
  if (fs.existsSync(USERS_FILE)) {
    try {
      const raw = fs.readFileSync(USERS_FILE, 'utf-8');
      cache = JSON.parse(raw) as StoredUser[];
      return cache;
    } catch {
      // fall through to reseed on parse error
    }
  }
  cache = seedUsers();
  persist();
  return cache;
}

function persist() {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(cache, null, 2), 'utf-8');
}

export function findByEmail(email: string): StoredUser | undefined {
  const users = load();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findById(id: string): StoredUser | undefined {
  const users = load();
  return users.find((u) => u.id === id);
}

export function createUser(input: Omit<StoredUser, 'id' | 'createdAt'>): StoredUser {
  const users = load();
  const user: StoredUser = {
    ...input,
    id: 'USR-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 1000),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  persist();
  return user;
}

export function updateUser(id: string, patch: Partial<StoredUser>): StoredUser | undefined {
  const users = load();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return undefined;
  users[idx] = { ...users[idx], ...patch };
  persist();
  return users[idx];
}

export function toPublicUser(u: StoredUser): AuthUser {
  const { passwordHash, ...rest } = u;
  return rest;
}
