/**
 * classifyService.js — AI Integration Layer
 *
 * Implements the client-side communication with the Gemini-powered 
 * classification engine. This service handles the transport of 
 * reflection data and provides robust error handling for API 
 * availability.
 */

// ── Configuration ──────────────────────────────────────────────────────────

/**
 * Backend Endpoint Resolution
 * Prioritizes environment-specific URIs, defaulting to local development.
 */
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';


// ── Service Implementation ────────────────────────────────────────────────

/**
 * classifyReflection
 * Sends the user's reflection text to the backend for sentiment 
 * and thematic analysis.
 * 
 * @param {string} reflectionText — The raw text captured from the writing canvas.
 * @returns {Promise<{ 
 *   component: string, 
 *   confidence: number, 
 *   reasoning: string, 
 *   detectedTone: string,
 *   longformComponents: string[]
 * }>} - The AI recommendation payload.
 */
export async function classifyReflection(reflectionText) {
  const response = await fetch(`${BACKEND_URL}/api/classify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: reflectionText }),
  });

  // Handle non-200 responses with descriptive error messages
  if (!response.ok) {
    const err = await response.json().catch(() => ({ 
      error: 'Inference engine is currently unavailable.' 
    }));
    
    throw new Error(err.error || `Classification failed: ${response.status}`);
  }

  return response.json();
}

