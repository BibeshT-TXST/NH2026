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
};

/**
 * Builds the classification prompt sent to Gemini.
 * Returns strict JSON — no markdown, no prose.
 */
export function buildClassificationPrompt(reflectionText) {
  const componentDescriptions = Object.values(COMPONENT_REGISTRY)
    .map(c => `- ${c.name}: ${c.description}`)
    .join('\n');

  return `You are a compassionate clinical psychologist AI assistant embedded in a mental wellness app called "Lets Build Us".

A user has just completed their daily reflection. Your task is to read their reflection text and classify which ONE therapeutic micro-intervention component is most appropriate to show them right now.

## Available Components
${componentDescriptions}

## User's Reflection
"""
${reflectionText}
"""

## Instructions
1. Analyze the emotional tone, language patterns, and psychological state expressed in the reflection.
2. Choose EXACTLY ONE component from the list above that would be most beneficial for this user RIGHT NOW.
3. Consider: acute vs. cognitive vs. grounding needs. Prioritize the user's most pressing state.
4. If the reflection is generally positive/neutral with no clear distress, default to BoxBreathingCard as a positive reinforcement practice.

## Response Format
Respond with ONLY valid JSON. No markdown. No explanation outside the JSON. Exactly this structure:
{
  "component": "<ComponentName>",
  "confidence": <0.0 to 1.0>,
  "reasoning": "<One sentence: why this component fits this user's state>",
  "detectedTone": "<2-3 word emotional tone summary>"
}`;
}
