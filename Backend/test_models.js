import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const models = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }).generateContent("ping");
    console.log("Success with gemini-1.5-flash");
  } catch (e) {
    console.log("Failed with gemini-1.5-flash:", e.status, e.statusText);
    try {
      const models = await genAI.getGenerativeModel({ model: 'gemini-pro' }).generateContent("ping");
      console.log("Success with gemini-pro");
    } catch (e2) {
      console.log("Failed with gemini-pro:", e2.status, e2.statusText);
    }
  }
}

test();
