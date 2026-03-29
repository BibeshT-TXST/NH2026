/**
 * test_models.js 
 * 
 * A simple diagnostic script to verify Gemini API connectivity
 * and model availability outside of the Express lifecycle.
 *
 * Usage: node test_models.js
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

// ── Diagnostics ───────────────────────────────────────────────────────────

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    // Attempt 1: Gemini 1.5 Flash (Preferred for speed/cost)
    const result = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }).generateContent("ping");
    console.log("✓ Success with gemini-1.5-flash");
    
  } catch (e) {
    console.log("✗ Failed with gemini-1.5-flash:", e.status, e.statusText);
    
    try {
      // Attempt 2: Legacy Gemini Pro
      const legacyResult = await genAI.getGenerativeModel({ model: 'gemini-pro' }).generateContent("ping");
      console.log("✓ Success with gemini-pro");
      
    } catch (e2) {
      console.log("✗ Failed with gemini-pro:", e2.status, e2.statusText);
    }
  }
}

// Execute the test suite
test();

