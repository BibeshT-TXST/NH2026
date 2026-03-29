/**
 * index.js — Service infrastructure
 *
 * This is the primary entry point for the "Lets Build Us" backend.
 * It configures middleware, defines routes, and manages the lifecycle 
 * of the Express server.
 */

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import classifyRouter from './routes/classify.js';

// ── Configuration ─────────────────────────────────────────────────────────

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Global Middleware ─────────────────────────────────────────────────────

app.use(cors());
app.use(express.json({ limit: '16kb' }));

// ── Route Registration ────────────────────────────────────────────────────

/**
 * Health check endpoint for uptime monitoring and infrastructure metrics.
 */
app.get('/health', (_req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    service: 'nh2026-backend', 
    timestamp: new Date().toISOString() 
  });
});

/**
 * Primary AI classification endpoint.
 * Manages reflection processing via Gemini 2.0.
 */
app.use('/api/classify', classifyRouter);

/**
 * Global 404 handler for unrecognized routes.
 */
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ── Server Lifecycle ──────────────────────────────────────────────────────

/**
 * Initializes the Express listener on the configured port.
 */
app.listen(PORT, () => {
  console.log(`\n🌱 Lets Build Us — Backend running on http://localhost:${PORT}`);
  console.log(`   POST /api/classify  — Gemini component classifier`);
  console.log(`   GET  /health        — Health check status\n`);
});

