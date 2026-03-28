/**
 * index.js — Express app entry point
 *
 * Lets Build Us · Backend
 */

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import classifyRouter from './routes/classify.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
}));
app.use(express.json({ limit: '16kb' }));

// ── Routes ────────────────────────────────────────────────────────────
app.use('/api/classify', classifyRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'nh2026-backend', timestamp: new Date().toISOString() });
});

// 404 catch-all
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ── Start ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌱 Lets Build Us — Backend running on http://localhost:${PORT}`);
  console.log(`   POST /api/classify  — Gemini component classifier`);
  console.log(`   GET  /health        — Health check\n`);
});
