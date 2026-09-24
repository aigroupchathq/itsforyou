# The Observer — Technical Specification & Psychological Architecture Blueprint

## Executive Summary
**"The Observer"** is an immersive, cinematic interactive experience bridging cognitive neuroscience, Acceptance & Commitment Therapy (ACT), Bayesian predictive processing, and contemplative awareness. It transforms long-form philosophical inquiry into an embodied, measurable digital laboratory.

Users do not merely read concepts—they observe their own cortical impulses in real time through the **60-Second Cognitive Test**, track the **350–500ms Libet readiness potential delay**, defuse from intrusive thoughts via dedicated **7-track metacognitive exercises**, and monitor the widening of the **metacognitive gap** without creating accounts or transmitting personal data.

---

## 1. Psychological & Neurocognitive Foundation

### 1.1 The Bereitschaftspotential (Libet Readiness Potential)
- **Empirical Basis**: Benjamin Libet (1983); Haggard & Eimer (1999); Soon et al. (2008).
- **Phenomenological Reality**: Scalp electroencephalography (EEG) detects cortical readiness potential (Bereitschaftspotential) in the supplementary motor area (SMA) approximately **350ms to 550ms before** subjects report conscious awareness of their intention to act (W-judgment).
- **Core Cognitive Shift**: Conscious awareness is not the original author of spontaneous thought impulses; it is a retrospective witness with a selective inhibitory veto window ("Free Won't").

### 1.2 Hierarchical Predictive Processing (The Bayesian Brain)
- **Empirical Basis**: Karl Friston (Free Energy Principle, 2010); Andy Clark (2013).
- **Mechanism**: The brain is not a passive input-receiver. It continuously synthesizes top-down predictive simulations of reality and uses sensory afferents merely to compute prediction error.
- **Suffering as Prediction Error Failure**: Unexamined cognitive loops project historical emotional trauma forward, reacting to internalized ghosts rather than raw present encounters.

### 1.3 Cognitive Fusion vs. Cognitive Defusion (ACT)
- **Empirical Basis**: Steven C. Hayes (Acceptance & Commitment Therapy, 2004).
- **Mechanism**: Cognitive fusion occurs when awareness collapses into verbal thoughts ("I am inadequate"). Cognitive defusion creates metacognitive distance, transforming the thought into an objective perceptual object ("I am noticing the thought that I am inadequate").
- **Visual Representation**: The dual-orb visualizer widens the spatial gap between "Self" and "Cognitive Proposal" with every labeled impulse.

### 1.4 Default Mode Network (DMN) vs. Task-Positive / Metacognitive Networks
- **Empirical Basis**: Marcus Raichle et al. (2001); Brewer et al. (2011).
- **Mechanism**: The DMN (medial prefrontal cortex, posterior cingulate) fires during self-referential past/future rumination. Activating open metacognitive monitoring deactivates DMN hyper-activity, settling cortisol and sympathetic tone.

### 1.5 Dual-Tone Cognitive Architecture (Grounded ↔ Poetic)
- **Grounded (Empirical / Science Lens)**: Formulated in the language of cognitive science, neurobiology, signal detection theory, and clinical psychology.
- **Poetic (Contemplative / Experiential Lens)**: Formulated in the language of non-dual awareness, spatial void, resonance, and direct phenomenological presence.
- **Mechanism**: A unified state toggle (`tone: 'grounded' | 'poetic'`) dynamically translates all prompts, headings, and exercise instructions without altering the underlying neuro-somatic mechanics.

---

## 2. Technical Stack & System Architecture

| Layer | Technology | Specification |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript | Strict typing, functional components, zero dead clicks |
| **Styling** | Tailwind CSS v4 | Dark void palette (`#040507`, `#0B0D13`, `#12151F`, gold `#E2B859`, cyan `#38BDF8`) |
| **Typography** | Google Fonts | Display: *Cormorant Garamond*; UI: *Plus Jakarta Sans*; Data: *JetBrains Mono* |
| **Interactive Canvas** | HTML5 2D Canvas | Multi-mode particle system with DPR scaling and reduced-motion fallback |
| **Generative Audio** | Web Audio API | Live detuned sub-drones (55Hz/110Hz), resonant lowpass filter, 0.08Hz LFO, 432Hz crystal chime |
| **Persistence** | Browser `localStorage` | Schema key `observer_state_v1`, JSON import/export, complete zero-account privacy |
| **Global Analytics** | Anonymous counters | Local fallback with asynchronous background sync (`/api/stats/thoughts`) |

---

## 3. Information Architecture & Key Routes

1. **Void Landing (`/`)**:
   - Staggered cold open hook ("Notice the last thought...").
   - Interactive Libet Timeline (-600ms to 0ms scrubber, Bereitschaftspotential visualization, replay, science citation modal).
   - Fast direct CTAs to Test, Essay, and Practice Hub.
2. **The 60-Second Test (`/test`)**:
   - Flagship test measuring personal thought impulse velocity.
   - Reactive ripple canvas responsive to screen taps or spacebar hits.
   - Real-time live countdown and large digit counter.
   - Offscreen Canvas engine generating a downloadable high-resolution PNG result card.
   - Web Share API and clipboard copy integration.
3. **Scrollytelling Essay (`/essay`)**:
   - 7 chapters accompanied by reactive canvas background modes:
     - 01. The Radio (Signal vs. Static)
     - 02. The Prediction Machine (Bayesian Grid)
     - 03. From Noise to Coherence (Interactive Coherence Slider)
     - 04. The Collective Pool (Inherited Memetic Noise)
     - 05. Reality Responds (Attentional Gating)
     - 06. The Unshakable Observer (Self-as-Context)
     - 07. Integration (Multi-Domain Sovereignty)
   - Credibility Layer: Science citations (cyan flask) vs. Contemplative lenses (amber sparkle).
   - Closing Void with breathing typography.
4. **Practice Hub (`/practice`)**:
   - Stat cards: Day streak, total days, personal thoughts caught, best 60s score.
   - "The Metacognitive Gap Widening" interactive SVG area chart.
   - 30-day practice calendar heatmap.
   - Collective community presence counter.
   - JSON Backup Export / Import / Reset Modal.
   - 7 Exercise cards with individual curriculum progression.
5. **Dedicated Exercise Views (`/practice/:id`)**:
   - 1. Thought Labeling (ACT defusion chips + widening gap dual-orb visualizer).
   - 2. Predictive Source Tracking (Intensity slider, cognitive distortion matrix, etiology tracing).
   - 3. Awareness Anchor (Guided 4-block meditation timer with breathing circle visualizer and ambient drone).
   - 4. Thought Origin Sorting (Direct sensory vs. Personal memory vs. Collective conditioning, live recycled noise % metric).
   - 5. Reality Response Journal (30-day phased journal with openness slider).
   - 6. Identity Shift Protocol (Narrative Self-as-Content vs. Invariant Self-as-Context).
   - 7. Daily Integration (Relationships, Work, Health, Finances with 4-step sequence).

---

## 4. LocalStorage State Schema (`observer_state_v1`)

```typescript
interface ObserverState {
  version: number;
  createdAt: string;
  tone: 'grounded' | 'poetic';
  onboarded: boolean;
  settings: {
    muted: boolean;
    silenceMode: boolean;
    readingMode: boolean;
    volume: number;
  };
  test: {
    best: number | null;
    history: Array<{
      id: string;
      date: string;
      thoughts: number;
      durationSec: number;
      mindVelocity: string;
    }>;
  };
  gapLog: Array<{
    date: string;
    value: number;
    exerciseId?: string;
    label?: string;
  }>;
  exercises: Record<string, {
    startedAt?: string;
    entries: Array<Record<string, any>>;
    sessions: string[]; // YYYY-MM-DD
  }>;
}
```

---

## 5. Acceptance & Verification Criteria
- [x] Zero-account privacy: All personal data persists in client `localStorage`.
- [x] 60-Second Test registers clicks and spacebar, tracks count, renders offscreen canvas PNG card download.
- [x] Libet timeline models -550ms readiness potential, -200ms conscious intent, and 0ms action.
- [x] All 7 chapters transition canvas visual modes smoothly via IntersectionObserver.
- [x] Grounded ↔ Poetic tone toggle seamlessly changes copy across all views in real time.
- [x] Web Audio ambient soundscape plays detuned drone without external audio files.
- [x] Reading mode and Silence mode collapse interface cleanly.
- [x] Full TypeScript compilation with zero lint or build errors.
