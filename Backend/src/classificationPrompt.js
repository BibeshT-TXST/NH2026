/**
 * classificationPrompt.js
 *
 * This file acts as the "Behavioral Knowledge Base" for the AI.
 * It contains the definitions of all available therapeutic components 
 * and campus events, alongside the logic for building the systemic 
 * prompt sent to Gemini.
 */

// ── Registry Definitions ──────────────────────────────────────────────────

/**
 * COMPONENT_REGISTRY
 * 
 * Maps internal component keys to their clinical descriptions and 
 * targeted keywords. This is used to ground the AI's classification 
 * in specific therapeutic use-cases.
 */
export const COMPONENT_REGISTRY = {
  BoxBreathingCard: {
    name: 'BoxBreathingCard',
    description: 'A guided box-breathing exercise (4-4-4 inhale-hold-exhale cycle). Best for acute anxiety, stress, physical tension, feeling overwhelmed, work pressure, heart racing, or any state where the body needs physiological regulation.',
    keywords: ['anxious', 'stressed', 'overwhelmed', 'nervous', 'tense', 'racing', 'pressure', 'panicking', 'tight', 'restless', 'deadline', 'breathe', 'calm down'],
  },
  CognitiveDefusionCard: {
    name: 'CognitiveDefusionCard',
    description: 'An ACT (Acceptance & Commitment Therapy) cognitive defusion exercise. The user types a negative/intrusive thought and watches it dissolve. Best for rumination, mental loops, self-critical thoughts, overthinking, intrusive thoughts, or feeling stuck in a thought spiral.',
    keywords: ['ruminating', 'overthinking', 'stuck', 'intrusive', 'can\'t stop thinking', 'negative thoughts', 'self-critical', 'obsessing', 'mental loop', 'replaying', 'spiraling thoughts', 'mind racing'],
  },
  GroundingCarouselCard: {
    name: 'GroundingCarouselCard',
    description: 'A 5-4-3-2-1 sensory grounding exercise. The user names things they can see, touch, hear, smell, and taste. Best for dissociation, feeling disconnected from reality, panic attacks, feeling not present, emotional numbness, or when someone needs to anchor to the current moment.',
    keywords: ['disconnected', 'not present', 'dissociated', 'numb', 'floating', 'unreal', 'panic', 'spaced out', 'lost', 'fog', 'not myself', 'detached'],
  },
  FractalFlowCard: {
    name: 'FractalFlowCard',
    description: 'A neuro-visual relaxation exercise using fractal geometry. Triggers parasympathetic relaxation and effortless attention. Best for brain fog, screen fatigue, sensory overload, mental exhaustion, or needing a gentle transition from high stress to calm.',
    keywords: ['fatigue', 'tired eyes', 'brain fog', 'screen fatigue', 'sensory overload', 'exhausted', 'mental block', 'unwind', 'soften focus', 'visual stress'],
  },
  PMRCard: {
    name: 'PMRCard',
    description: 'A Progressive Muscle Relaxation (PMR) exercise. Uses intense muscle tensing followed by sudden release to create a rebound effect that lowers cortisol. Best for physical somatic anxiety, muscle tension, clenching, stored physical stress, or resetting a highly activated nervous system.',
    keywords: ['tense muscles', 'clenching', 'tight shoulders', 'physical stress', 'tightness', 'somatic', 'stressed body', 'body tension', 'need a reset'],
  },
};

/**
 * LONGFORM_REGISTRY
 * 
 * Contains a curated list of campus-based events and long-term 
 * community support groups that the AI can suggest for social grounding.
 */
export const LONGFORM_REGISTRY = {
  "The Buddy Circle": {
    name: "The Buddy Circle",
    description: "A warm, no-pressure hangout for students and young people who find it hard to make friends in the city. Share stories, play light games, and build genuine connections at your own pace."
  },
  "Study Together Club": {
    name: "Study Together Club",
    description: "Struggle with coursework or exam prep? Join peers who understand the pressure. We pair you with patient study partners and break tough subjects into manageable pieces — no judgement."
  },
  "Safe Space Sessions": {
    name: "Safe Space Sessions",
    description: "Guided group sessions by trained counselors. Talk about loneliness, academic stress, or just listen. Everything shared here stays here."
  },
  "Quiet Coffee Corner": {
    name: "Quiet Coffee Corner",
    description: "Not everyone thrives in loud crowds. Enjoy a calm café atmosphere with lo-fi music, affordable coffee, and friendly faces who understand introversion and city life. Regular informal meetups happen here."
  },
  "Mindful Focus Workshop": {
    name: "Mindful Focus Workshop",
    description: "Learn practical techniques for managing exam anxiety, improving concentration, and building a study routine — with guided meditation and discussion groups at Kopan Monastery."
  },
  "Morning Walk & Talk": {
    name: "Morning Walk & Talk",
    description: "Start your day with a gentle walk alongside others in the fresh Kathmandu air. Movement eases anxiety, and a little morning sunlight goes a long way for your mood. Open to all."
  }
};

// ── Prompt Engineering Layer ───────────────────────────────────────────────

/**
 * buildClassificationPrompt
 * 
 * Generates the full systemic instruction for the Gemini model.
 * 
 * @param {string} reflectionText - The raw text entered by the user.
 * @returns {string} A string containing strict JSON requirements and context.
 */
export function buildClassificationPrompt(reflectionText) {
  // Format registries for ingestion
  const componentDescriptions = Object.values(COMPONENT_REGISTRY)
    .map(c => `- ${c.name}: ${c.description}`)
    .join('\n');

  const longformDescriptions = Object.values(LONGFORM_REGISTRY)
    .map(c => `- ${c.name}: ${c.description}`)
    .join('\n');

  // Multi-line systemic prompt block
  return `You are a compassionate clinical psychologist AI assistant embedded in a mental wellness app called "Lets Build Us".

A user has just completed their daily reflection. Your task is to analyze their state and classify the most beneficial therapeutic interventions.

## Available Shortform Components
${componentDescriptions}

## Available Longform Components (Events)
${longformDescriptions}

## User's Reflection
"""
${reflectionText}
"""

## Analytical Instructions
1. Analyze the emotional tone, language patterns, and psychological state expressed in the reflection.
2. Choose EXACTLY ONE shortform component from the list above based on immediate therapeutic need.
3. Choose EXACTLY TWO longform components (events) that provide social anchoring.
4. Prioritize acute physiological needs (Breathing/PMR) if high distress is detected.
5. If the reflection is positive, focus on reinforcement and community events.

## Response Requirements
Respond with ONLY valid JSON. Exactly this structure:
{
  "component": "<ShortformComponentName>",
  "longformComponents": ["<EventName1>", "<EventName2>"],
  "confidence": <0.0 to 1.0>,
  "reasoning": "<Short analytical reasoning>",
  "messageToUser": "<Compassionate message addressed to the user>",
  "detectedTone": "<Short emotional tone summary>"
}`;
}

