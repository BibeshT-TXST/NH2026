/**
 * geminiController.js
 *
 * Handles POST /api/classify
 * Sends the user's reflection text to Gemini Flash and returns
 * which shortform component to display.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildClassificationPrompt, COMPONENT_REGISTRY } from '../classificationPrompt.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use gemini-1.5-flash — fast, cheap, perfect for classification tasks
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.3,       // Low temp = consistent, deterministic classification
    maxOutputTokens: 256,   // We only need a small JSON blob back
    responseMimeType: 'application/json',
  },
});

const VALID_COMPONENTS = Object.keys(COMPONENT_REGISTRY);

/**
 * POST /api/classify
 * Body: { text: string }
 * Response: { component: string, confidence: number, reasoning: string, detectedTone: string }
 */
export async function classifyReflection(req, res) {
  try {
    const { text } = req.body;

    // ── Input validation ────────────────────────────────────────────
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "text" field in request body.' });
    }

    const trimmed = text.trim();
    if (trimmed.length < 5) {
      return res.status(400).json({ error: 'Reflection text is too short to classify.' });
    }
    if (trimmed.length > 2000) {
      return res.status(400).json({ error: 'Reflection text exceeds the 2000 character limit.' });
    }

    // ── Build prompt & call Gemini ──────────────────────────────────
    const prompt = buildClassificationPrompt(trimmed);

    console.log(`[Gemini] Classifying reflection (${trimmed.length} chars)...`);
    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    // ── Parse and validate Gemini's JSON response ───────────────────
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error('[Gemini] Failed to parse response as JSON:', raw);
      return res.status(502).json({ error: 'Gemini returned an unparseable response.', raw });
    }

    const { component, confidence, reasoning, detectedTone } = parsed;

    // Guard: ensure component is one of our known keys
    if (!VALID_COMPONENTS.includes(component)) {
      console.warn(`[Gemini] Unknown component returned: "${component}". Defaulting to BoxBreathingCard.`);
      parsed.component = 'BoxBreathingCard';
      parsed.reasoning = `Defaulted — Gemini returned an unrecognized component name. Original: "${component}".`;
    }

    console.log(`[Gemini] ✓ Classified as: ${parsed.component} (confidence: ${confidence}, tone: "${detectedTone}")`);

    // ── Return clean response ───────────────────────────────────────
    return res.status(200).json({
      component: parsed.component,
      confidence: parsed.confidence ?? null,
      reasoning:  parsed.reasoning ?? null,
      detectedTone: parsed.detectedTone ?? null,
    });

  } catch (err) {
    console.error('[Gemini] Unexpected error:', err);
    return res.status(500).json({
      error: 'Internal server error during classification.',
      details: err.message,
    });
  }
}
