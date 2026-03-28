/**
 * geminiController.js
 *
 * Handles POST /api/classify
 * Sends the user's reflection text to Gemini Flash and returns
 * which shortform component to display.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildClassificationPrompt, COMPONENT_REGISTRY, LONGFORM_REGISTRY } from '../classificationPrompt.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use gemini-2.5-flash — fast, cheap, perfect for classification tasks
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.3,       // Low temp = consistent, deterministic classification
    responseMimeType: 'application/json',
  },
});

const VALID_COMPONENTS = Object.keys(COMPONENT_REGISTRY);
const VALID_LONGFORM = Object.keys(LONGFORM_REGISTRY);

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
      // Extract just the JSON object from the response string, ignoring any markdown or text
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON object found in response");
      parsed = JSON.parse(match[0]);
    } catch {
      console.error('[Gemini] Failed to parse response as JSON:', raw);
      return res.status(502).json({ error: 'Gemini returned an unparseable response.', raw });
    }

    const { component, longformComponents, confidence, reasoning, detectedTone } = parsed;

    // Guard: ensure component is one of our known keys
    if (!VALID_COMPONENTS.includes(component)) {
      console.warn(`[Gemini] Unknown component returned: "${component}". Defaulting to BoxBreathingCard.`);
      parsed.component = 'BoxBreathingCard';
      parsed.reasoning = `Defaulted — Gemini returned an unrecognized component name. Original: "${component}".`;
    }

    // Guard: ensure longformComponents are valid
    let validLongform = [];
    if (Array.isArray(longformComponents)) {
      validLongform = longformComponents.filter(c => VALID_LONGFORM.includes(c));
    }
    if (validLongform.length < 2) {
      console.warn(`[Gemini] Invalid or missing longformComponents returned: ${JSON.stringify(longformComponents)}. Defaulting.`);
      validLongform = ["The Buddy Circle", "Morning Walk & Talk"];
    }

    console.log(`[Gemini] ✓ Classified as: ${parsed.component} and ${validLongform.join(', ')} (confidence: ${confidence}, tone: "${detectedTone}")`);

    // ── Return clean response ───────────────────────────────────────
    return res.status(200).json({
      component: parsed.component,
      longformComponents: validLongform.slice(0, 2),
      confidence: parsed.confidence ?? null,
      reasoning: parsed.reasoning ?? null,
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
