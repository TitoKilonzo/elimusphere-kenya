# ElimuSphere Kenya

One app for every step of a Kenyan household's CBC/CBE journey - PP1 through Senior School. ElimuSphere brings Mwalimu AI tutoring, KICD-aligned lessons, CBAF-scored assessments, M-Pesa fee payments, and real-time parent reports into a single offline-friendly Progressive Web App, with purpose-built experiences for Learners, Teachers, Parents, Schools, and Admins.

## Tech stack

- **Frontend:** React 18 + Vite, React Router v7, Tailwind CSS v4, Framer Motion (`motion`), Recharts, Lucide icons
- **Backend:** Node.js + Express, served via Vite middleware in dev and as static files in production
- **Auth:** JWT access tokens + bcrypt password hashing, role-based route protection
- **AI layer:** Google Gemini (`@google/genai`), structured as three cooperating agents - Tutor/Explainer, Assessment, and Insight
- **Payments:** M-Pesa Daraja (STK Push), shaped around the real Safaricom API contract with a simulated sandbox fallback
- **PWA:** Real web app manifest, installable icons, and an app-shell service worker for offline support

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`. No configuration is required to explore the product - AI and M-Pesa endpoints run in clearly-labeled simulated mode until you add real credentials (see below).

### Demo accounts

| Role    | Email                          | Password      |
|---------|---------------------------------|---------------|
| Learner | jomo.mwangi@elimusphere.ke      | password123   |
| Teacher | nancy.wanjiku@elimusphere.ke    | password123   |
| Parent  | parent.mwangi@elimusphere.ke    | password123   |

You can also sign up fresh as a Learner, Teacher, Parent, or School Administrator from `/signup`.

## Enabling real integrations

Copy `.env.example` to `.env` and fill in:

- **`JWT_SECRET`** - any long random string (always set this for production)
- **`GEMINI_API_KEY`** - enables Mwalimu AI tutoring, lesson generation, and parent insight letters. Without it, `/api/ai/*` routes return a clear, honest 503 instead of failing silently.
- **`MPESA_CONSUMER_KEY` / `MPESA_CONSUMER_SECRET` / `MPESA_SHORTCODE` / `MPESA_PASSKEY`** - enables real Safaricom Daraja STK Push payments. Without these, payments run in simulated sandbox mode so the full billing flow can still be tested end to end.

The Admin dashboard (`/admin`, demo role: `admin`) shows live/simulated status for both integrations.

## Project structure

```
elimusphere-kenya/
├── server.ts                # Express entrypoint - mounts auth, AI, and M-Pesa routes
├── server/
│   ├── authRoutes.ts         # signup / login / me + JWT middleware
│   ├── userStore.ts          # JSON-file-backed user store (bcrypt-hashed passwords)
│   ├── aiService.ts          # Tutor / Assessment / Insight agents (Gemini)
│   └── mpesaService.ts       # Daraja-shaped STK Push integration
├── src/
│   ├── App.tsx                # Route definitions, lazy-loaded for mobile performance
│   ├── context/                # Auth + Toast providers
│   ├── components/layout/      # Navbar, Footer, ProtectedRoute
│   ├── components/ui/          # Shared widgets (CBAF badges, strand path, counters)
│   ├── pages/public/           # Landing, Login, Signup, About, Pricing, etc.
│   ├── pages/learner|teacher|parent|school|admin/   # Role dashboards
│   └── lib/                    # API client, curated image library
└── public/                    # PWA manifest, icons, service worker
```

## Scripts

- `npm run dev` - start the dev server (Express + Vite middleware)
- `npm run build` - build the production frontend bundle and bundle the server
- `npm start` - run the production build
- `npm run lint` - type-check the whole project with `tsc --noEmit`

## Roadmap context

This build covers the spec's **Phase 1** scope - full auth/RBAC for all roles, the installable PWA shell, and one complete vertical slice through each role's experience - plus working integrations for AI tutoring and M-Pesa payments shaped for production use. Curriculum breadth, the teacher content-review pipeline, and deeper platform analytics are natural next phases.
