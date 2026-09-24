/**
 * Clinical Psychometrics Battery & Diagnostic Profiler for The Observer.
 * Incorporates:
 * - CFQ-7 (Cognitive Fusion Questionnaire - Gillanders et al., 2014)
 * - FFMQ / MAAS (Five Facet Mindfulness Questionnaire - Baer et al.)
 * - Bayesian Predictive Distortion Index (Clark et al., Predictive Processing)
 * - Self-as-Context ACT Index (Hayes et al.)
 */

import { AssessmentItem, DiagnosticRadarData } from '../types';

export const DIAGNOSTIC_ITEMS: AssessmentItem[] = [
  // Cognitive Defusion (CFQ-7 adapted)
  {
    id: 'cfq_1',
    question: 'My thoughts frequently cause me emotional tension, friction, or mental fatigue.',
    category: 'fusion',
    reverse: true,
  },
  {
    id: 'cfq_2',
    question: 'I get so caught up in repetitive thoughts that I lose track of what I actually value doing.',
    category: 'fusion',
    reverse: true,
  },
  {
    id: 'cfq_3',
    question: 'I struggle or argue with the thoughts that my brain generates about my identity or self-worth.',
    category: 'fusion',
    reverse: true,
  },
  {
    id: 'cfq_4',
    question: 'When an unsettling thought appears, I instinctively treat it as an urgent emergency that must be solved.',
    category: 'fusion',
    reverse: true,
  },
  // Interoceptive Somatic Accuracy
  {
    id: 'intero_1',
    question: 'I can clearly feel the visceral bodily sensation (throat constriction, solar plexus flutter, jaw clench) before naming the emotion.',
    category: 'interoception',
  },
  {
    id: 'intero_2',
    question: 'I can breathe into uncomfortable physical contractions without needing them to dissipate instantly.',
    category: 'interoception',
  },
  // Non-Reactivity to Rumination
  {
    id: 'react_1',
    question: 'When a disturbing mental scenario arises, I can step back and observe it pass like a drifting particle.',
    category: 'nonReactivity',
  },
  {
    id: 'react_2',
    question: 'I can experience a surge of anxiety or frustration without instinctively lashing out or impulsively reacting.',
    category: 'nonReactivity',
  },
  // Predictive Flexibility & Bayesian Plasticity
  {
    id: 'pred_1',
    question: 'When sudden friction occurs, my mind treats its automatic worst-case prediction as an infallible prophecy.',
    category: 'threatBias',
    reverse: true,
  },
  {
    id: 'pred_2',
    question: 'I easily recognize that my brain is a prediction engine constructing models, not a recording camera.',
    category: 'threatBias',
  },
  // Self-As-Context (The Sovereign Observer)
  {
    id: 'ctx_1',
    question: 'I have experiential awareness of a quiet, unshakable "Observer" that remains undisturbed behind the noise of my thinking.',
    category: 'selfAsContext',
  },
  {
    id: 'ctx_2',
    question: 'I distinguish between "I am broken" and "My brain is producing a sentence claiming I am broken".',
    category: 'selfAsContext',
  },
  // Present-Moment Attentional Gating
  {
    id: 'gate_1',
    question: 'I can notice when my attention has been hijacked into past rumination or future simulation within seconds.',
    category: 'mindfulness',
  },
  {
    id: 'gate_2',
    question: 'I am able to anchor my awareness to raw sensory input (sound, touch, breath) even during high cognitive load.',
    category: 'mindfulness',
  },
];

export function calculateDiagnosticRadar(answers: Record<string, number>): DiagnosticRadarData {
  // Score range per question is 1 to 5 (1 = Never/Strongly Disagree, 5 = Always/Strongly Agree)
  const getNormalizedScore = (id: string, reverse: boolean = false): number => {
    const raw = answers[id] ?? 3;
    const effective = reverse ? 6 - raw : raw; // 1-5 scale -> 1 is lowest, 5 is highest
    return ((effective - 1) / 4) * 100; // 0 to 100
  };

  // 1. Defusion Score (from CFQ items)
  const defusion = Math.round(
    (getNormalizedScore('cfq_1', true) +
      getNormalizedScore('cfq_2', true) +
      getNormalizedScore('cfq_3', true) +
      getNormalizedScore('cfq_4', true)) /
      4
  );

  // 2. Interoceptive Accuracy
  const interoception = Math.round(
    (getNormalizedScore('intero_1', false) + getNormalizedScore('intero_2', false)) / 2
  );

  // 3. Non-Reactivity
  const nonReactivity = Math.round(
    (getNormalizedScore('react_1', false) + getNormalizedScore('react_2', false)) / 2
  );

  // 4. Predictive Flexibility
  const predictiveFlexibility = Math.round(
    (getNormalizedScore('pred_1', true) + getNormalizedScore('pred_2', false)) / 2
  );

  // 5. Contextual Self (Observer)
  const contextualSelf = Math.round(
    (getNormalizedScore('ctx_1', false) + getNormalizedScore('ctx_2', false)) / 2
  );

  // 6. Present-Moment Gating
  const presentGating = Math.round(
    (getNormalizedScore('gate_1', false) + getNormalizedScore('gate_2', false)) / 2
  );

  const overallScore = Math.round(
    (defusion + interoception + nonReactivity + predictiveFlexibility + contextualSelf + presentGating) / 6
  );

  let clinicalLevel: DiagnosticRadarData['clinicalLevel'] = 'Moderate Entanglement';
  let clinicalSummary = '';
  const recommendations: string[] = [];

  if (overallScore < 35) {
    clinicalLevel = 'Acute Cognitive Fusion';
    clinicalSummary =
      'High cortical entanglement with automatic thoughts. The neurological prediction loop dominates awareness, mistaking transient electrical mental models for literal reality and physical threats.';
    recommendations.push(
      'Priority 1: Practice Exercise 1 (Thought Labeling) to separate perception from identification.',
      'Priority 2: Use the Neuro-Somatic SOS Physiological Sigh during hyper-arousal surges.',
      'Priority 3: Run the Titchener Semantic Saturation protocol on core trigger words in the Thought Lab.'
    );
  } else if (overallScore < 60) {
    clinicalLevel = 'Moderate Entanglement';
    clinicalSummary =
      'Developing metacognitive capacity. You recognize that thoughts are events in consciousness, but intense emotional charge or unexpected ambiguity periodically collapses your witness sovereignty.';
    recommendations.push(
      'Practice Exercise 4 (Origin Sorting) to catch predictive impulses before emotional escalation.',
      'Utilize The Thought Sifter to dissect thoughts into Sensory Fact vs. Cortical Fiction.',
      'Engage in daily 60-second Stillness Tests to widen the inter-thought temporal gap.'
    );
  } else if (overallScore < 82) {
    clinicalLevel = 'Emerging Metacognitive Plasticity';
    clinicalSummary =
      'Robust metacognitive stability. High ability to hold distressing stimuli without compulsive reaction. You experience the space between stimulus and response with reliable lucidity.';
    recommendations.push(
      'Deepen Exercise 5 (Reality Response Journal) to observe subtle behavioral ripple effects.',
      'Explore Theta & Alpha soundscape brainwave entrainment during reflective sessions.',
      'Maintain continuous interoceptive monitoring during interpersonal friction.'
    );
  } else {
    clinicalLevel = 'High Observer Sovereignty';
    clinicalSummary =
      'Exemplary psychological flexibility and non-dual metacognitive awareness. Thoughts are experienced cleanly as passing acoustic/linguistic epiphenomena in the field of awareness.';
    recommendations.push(
      'Exercise 6 & 7 (Identity Shift & Daily Integration) as sustained baseline living.',
      'Sustain contemplative presence as an unshakeable ground for creative and value-aligned action.'
    );
  }

  return {
    defusion,
    interoception,
    nonReactivity,
    predictiveFlexibility,
    contextualSelf,
    presentGating,
    overallScore,
    clinicalLevel,
    clinicalSummary,
    recommendations,
    date: new Date().toISOString(),
  };
}
