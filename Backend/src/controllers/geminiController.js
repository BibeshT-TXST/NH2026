/**
 * geminiController.js
 *
 * This controller handles the primary AI analysis for user reflections.
 * It interfaces with Google Generative AI (Gemini) to perform semantic 
 * classification and mapping to therapeutic components.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  buildClassificationPrompt, 
  COMPONENT_REGISTRY, 
  LONGFORM_REGISTRY 
} from '../classificationPrompt.js';

// ── AI Configuration ──────────────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generative Model Instance.
 * Configures the specific Gemini model and its generation parameters.
 */
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.3,       // Low temperature for deterministic classification
    responseMimeType: 'application/json',
  },
});

// Cache registry keys for validation performance
const VALID_COMPONENTS = Object.keys(COMPONENT_REGISTRY);
const VALID_LONGFORM   = Object.keys(LONGFORM_REGISTRY);

// ── Main Controller ───────────────────────────────────────────────────────

/**
 * POST /api/classify
 * 
 * Takes raw reflection text, processes it via Gemini, and returns 
 * a structured intervention plan.
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export async function classifyReflection(req, res) {
  try {
    const { text } = req.body;

    // 1. Input Integrity Checks
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "text" field in request body.' });
    }

    const trimmed = text.trim();
    if (trimmed.length < 5) {
      return res.status(400).json({ error: 'Reflection text is too short to classify safely.' });
    }

    if (trimmed.length > 2000) {
      return res.status(400).json({ error: 'Reflection text exceeds the 2000 character limit.' });
    }

    // 2. Intelligence Layer
    const prompt = buildClassificationPrompt(trimmed);
    console.log(`[Gemini] Classifying reflection (${trimmed.length} chars)...`);
    
    const result = await model.generateContent(prompt);
    const rawContent = result.response.text();

    // 3. Response Parsing & Extraction
    let parsed;
    try {
      // Regex to extract JSON from potential AI prose or markdown wrappers
      const match = rawContent.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON object found in response");
      parsed = JSON.parse(match[0]);
    } catch (parseErr) {
      console.error('[Gemini] Failed to parse model response:', rawContent);
      return res.status(502).json({ error: 'Gemini returned an unparseable response.', raw: rawContent });
    }

    const { 
      component, 
      longformComponents, 
      confidence, 
      reasoning, 
      messageToUser, 
      detectedTone 
    } = parsed;

    // 4. Schema Validation & Fail-safes
    
    // Validate Shortform Component Mapping
    if (!VALID_COMPONENTS.includes(component)) {
      console.warn(`[Gemini] Unrecognized component: "${component}". Defaulting.`);
      parsed.component = 'BoxBreathingCard';
      parsed.reasoning = `Fallback: Gemini returned unrecognizable key "${component}".`;
    }

    // Validate Longform Event Mapping
    let validLongform = [];
    if (Array.isArray(longformComponents)) {
      validLongform = longformComponents.filter(c => VALID_LONGFORM.includes(c));
    }

    if (validLongform.length < 2) {
      console.warn(`[Gemini] Insufficient events. Using fallbacks.`);
      validLongform = ["The Buddy Circle", "Morning Walk & Talk"];
    }

    console.log(`[Gemini] ✓ Classified: ${parsed.component} | Confidence: ${confidence}`);

    // 5. Final Dispatch
    return res.status(200).json({
      component: parsed.component,
      longformComponents: validLongform.slice(0, 2),
      confidence: parsed.confidence ?? null,
      reasoning: parsed.reasoning ?? null,
      messageToUser: parsed.messageToUser ?? "Here is my recommendation for you.",
      detectedTone: parsed.detectedTone ?? null,
    });

  } catch (err) {
    console.error('[Gemini] Internal Controller Error:', err);
    return res.status(500).json({
      error: 'Internal server error during classification.',
      details: err.message,
    });
  }
}

