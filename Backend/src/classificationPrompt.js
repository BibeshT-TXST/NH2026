/**
 * classificationPrompt.js
 *
 * The single source of truth for what Gemini knows about each component.
 * Adding a new component = adding one entry here. Nothing else changes.
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
/**
 * Builds the classification prompt sent to Gemini.
 * Returns strict JSON — no markdown, no prose.
 */
export function buildClassificationPrompt(reflectionText) {
  const componentDescriptions = Object.values(COMPONENT_REGISTRY)
    .map(c => `- ${c.name}: ${c.description}`)
    .join('\n');

  const longformDescriptions = Object.values(LONGFORM_REGISTRY)
    .map(c => `- ${c.name}: ${c.description}`)
    .join('\n');

  return `You are a compassionate clinical psychologist AI assistant embedded in a mental wellness app called "Lets Build Us".

A user has just completed their daily reflection. Your task is to read their reflection text and classify which therapeutic micro-intervention component (shortform) AND which two campus events (longform) are most appropriate to show them right now.

## Available Shortform Components
${componentDescriptions}

## Available Longform Components (Events)
${longformDescriptions}

## User's Reflection
"""
${reflectionText}
"""

## Instructions
1. Analyze the emotional tone, language patterns, and psychological state expressed in the reflection.
2. Choose EXACTLY ONE shortform component from the list above that would be most beneficial for this user RIGHT NOW.
3. Choose EXACTLY TWO longform components (events) from the list above that would best support the user.
4. Consider: acute vs. cognitive vs. grounding needs. Prioritize the user's most pressing state.
5. If the reflection is generally positive/neutral with no clear distress, default to BoxBreathingCard as a positive reinforcement practice, and pick two generally uplifting events.

## Response Format
Respond with ONLY valid JSON. No markdown. No explanation outside the JSON. Exactly this structure:
{
  "component": "<ShortformComponentName>",
  "longformComponents": ["<EventName1>", "<EventName2>"],
  "confidence": <0.0 to 1.0>,
  "reasoning": "<One sentence: concise analytical reason for the backend logs>",
  "messageToUser": "<A short, compassionate, first-person message directly addressed to the user explaining why these are recommended (e.g. 'It sounds like you're carrying a lot today, so I thought these might help.')>",
  "detectedTone": "<2-3 word emotional tone summary>"
}`;
}
