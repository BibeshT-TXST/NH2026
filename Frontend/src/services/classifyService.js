/**
 * classifyService.js
 *
 * Thin wrapper around POST /api/classify.
 * Import this wherever you need a component recommendation.
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

/**
 * Sends the reflection text to the backend classifier.
 * Returns { component, confidence, reasoning, detectedTone } on success.
 * Throws an Error on network/server failure.
 *
 * @param {string} reflectionText
 * @returns {Promise<{ component: string, confidence: number, reasoning: string, detectedTone: string }>}
 */
export async function classifyReflection(reflectionText) {
  const response = await fetch(`${BACKEND_URL}/api/classify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: reflectionText }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown server error' }));
    throw new Error(err.error || `Server responded with ${response.status}`);
  }

  return response.json();
}
