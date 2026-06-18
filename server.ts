import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { authRouter, requireAuth, AuthedRequest } from './server/authRoutes';
import { answerLearnerQuestion, generateTeacherResource, generateParentInsight, AiNotConfiguredError, isAiConfigured } from './server/aiService';
import { initiateStkPush } from './server/mpesaService';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = Number(process.env.PORT) || 3000;

// ---------------------------------------------------------------
// Auth
// ---------------------------------------------------------------
app.use('/api/auth', authRouter);

// ---------------------------------------------------------------
// AI: Tutor / Explainer agent (Learner-facing)
// ---------------------------------------------------------------
app.post('/api/ai/student', requireAuth, async (req: AuthedRequest, res) => {
  try {
    const { grade, subject, topic, messages } = req.body;

    if (!grade || !subject || !topic || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing parameters or invalid messages array.' });
    }

    const reply = await answerLearnerQuestion({ grade, subject, topic, messages });
    res.json({ reply });
  } catch (error: any) {
    if (error instanceof AiNotConfiguredError) {
      return res.status(503).json({ error: error.message });
    }
    console.error('AI Student Tutor error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate tutor response.' });
  }
});

// ---------------------------------------------------------------
// AI: Assessment agent (Teacher-facing resource generation)
// ---------------------------------------------------------------
app.post('/api/ai/teacher', requireAuth, async (req: AuthedRequest, res) => {
  try {
    const { type, grade, subject, topic } = req.body;

    if (!type || !grade || !subject || !topic) {
      return res.status(400).json({ error: 'Missing type, grade, subject, or topic.' });
    }

    const output = await generateTeacherResource({ type, grade, subject, topic });
    res.json({ output });
  } catch (error: any) {
    if (error instanceof AiNotConfiguredError) {
      return res.status(503).json({ error: error.message });
    }
    console.error('AI Teacher Assistant error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate resource.' });
  }
});

// ---------------------------------------------------------------
// AI: Insight agent (Parent-facing progress summaries)
// ---------------------------------------------------------------
app.post('/api/ai/parent', requireAuth, async (req: AuthedRequest, res) => {
  try {
    const { studentName, grade, grades, attendanceRate, points, badges } = req.body;

    if (!studentName || !grade) {
      return res.status(400).json({ error: 'Missing student name or grade.' });
    }

    const letter = await generateParentInsight({
      studentName,
      grade,
      grades: grades || {},
      attendanceRate: attendanceRate ?? 0,
      points: points ?? 0,
      badges: badges || [],
    });
    res.json({ letter });
  } catch (error: any) {
    if (error instanceof AiNotConfiguredError) {
      return res.status(503).json({ error: error.message });
    }
    console.error('AI Parent Assistant error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate parent summary.' });
  }
});

// ---------------------------------------------------------------
// System: lets the client know which optional integrations are live,
// so the UI can show an honest "simulated" badge instead of pretending.
// ---------------------------------------------------------------
app.get('/api/system/status', (_req, res) => {
  res.json({
    aiConfigured: isAiConfigured(),
    mpesaConfigured: Boolean(process.env.MPESA_CONSUMER_KEY),
  });
});

// ---------------------------------------------------------------
// Payments: M-Pesa STK Push (Daraja-shaped, simulated until credentials are set)
// ---------------------------------------------------------------
app.post('/api/mpesa/pay', requireAuth, async (req: AuthedRequest, res) => {
  try {
    const { phone, amount, planName } = req.body;

    if (!phone || !amount || !planName) {
      return res.status(400).json({ error: 'Missing payment details.' });
    }

    const result = await initiateStkPush({
      phone,
      amount: Number(amount),
      accountReference: req.userId || 'ELIMUSPHERE',
      description: planName,
    });

    res.json(result);
  } catch (error: any) {
    console.error('M-Pesa payment error:', error);
    res.status(500).json({ error: 'Payment processing failed. Please try again.' });
  }
});

/** Daraja calls back here once the customer completes (or cancels) the STK prompt. */
app.post('/api/mpesa/callback', (req, res) => {
  console.log('M-Pesa callback received:', JSON.stringify(req.body));
  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

// ---------------------------------------------------------------
// Vite middleware (dev) or static build (production)
// ---------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Setting up Express dev server with Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Serving built static files in production...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ElimuSphere Kenya Server running on http://localhost:${PORT}`);
    if (!isAiConfigured()) {
      console.log('  ⚠ GEMINI_API_KEY not set - AI tutor endpoints will return a clear 503 until configured.');
    }
  });
}

startServer();
