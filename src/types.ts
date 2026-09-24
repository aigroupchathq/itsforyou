export type Tone = 'grounded' | 'poetic';

export interface UserSettings {
  muted: boolean;
  silenceMode: boolean;
  readingMode: boolean;
  volume: number;
  soundMode?: 'drone' | 'alpha' | 'theta' | 'solfeggio' | 'brown';
}

export interface TestHistoryEntry {
  id: string;
  date: string;
  thoughts: number;
  durationSec: number;
  mindVelocity: string;
}

export interface GapLogEntry {
  date: string;
  value: number;
  exerciseId?: string;
  label?: string;
}

export interface ExerciseEntry {
  id: string;
  date: string;
  [key: string]: any;
}

export interface ExerciseState {
  startedAt?: string;
  entries: ExerciseEntry[];
  sessions: string[]; // YYYY-MM-DD
}

// ----------------------------------------------------
// PSYCHOMETRIC & CLINICAL DIAGNOSTICS TYPES
// ----------------------------------------------------
export interface AssessmentItem {
  id: string;
  question: string;
  category: 'fusion' | 'mindfulness' | 'interoception' | 'threatBias' | 'selfAsContext' | 'nonReactivity';
  reverse?: boolean;
}

export interface DiagnosticRadarData {
  defusion: number; // 0 - 100 (Higher = more defused/sovereign)
  interoception: number; // 0 - 100
  nonReactivity: number; // 0 - 100
  predictiveFlexibility: number; // 0 - 100
  contextualSelf: number; // 0 - 100
  presentGating: number; // 0 - 100
  overallScore: number;
  clinicalLevel: 'Acute Cognitive Fusion' | 'Moderate Entanglement' | 'Emerging Metacognitive Plasticity' | 'High Observer Sovereignty';
  clinicalSummary: string;
  recommendations: string[];
  date: string;
}

export interface DiagnosticHistoryEntry {
  id: string;
  date: string;
  radar: DiagnosticRadarData;
  answers: Record<string, number>;
}

// ----------------------------------------------------
// THOUGHT LABORATORY TYPES
// ----------------------------------------------------
export interface SiftedThought {
  id: string;
  date: string;
  rawThought: string;
  sensoryFact: string;
  corticalStory: string;
  somaticCharge: string;
  impulsiveUrge: string;
  defusionRating: number; // 1 to 10
}

export interface TitchenerSession {
  id: string;
  date: string;
  word: string;
  preCharge: number;
  postCharge: number;
  durationSec: number;
}

export interface SocraticSession {
  id: string;
  date: string;
  belief: string;
  isAutomatic: boolean;
  costAssessment: string;
  contextualAction: string;
}

// ----------------------------------------------------
// STACK & CLOUD INTEGRATION TYPES (Supabase, CF, Figma)
// ----------------------------------------------------
export interface SupabaseConfig {
  url: string;
  anonKey: string;
  connected: boolean;
  lastSyncedAt?: string;
}

export interface ObserverState {
  version: number;
  createdAt: string;
  tone: Tone;
  onboarded: boolean;
  settings: UserSettings;
  test: {
    best: number | null;
    history: TestHistoryEntry[];
  };
  gapLog: GapLogEntry[];
  exercises: Record<string, ExerciseState>;
  diagnostics: {
    latestRadar: DiagnosticRadarData | null;
    history: DiagnosticHistoryEntry[];
  };
  thoughtLab: {
    siftedThoughts: SiftedThought[];
    titchenerSessions: TitchenerSession[];
    socraticSessions: SocraticSession[];
  };
  supabaseConfig?: SupabaseConfig;
}

export interface GlobalStats {
  totalThoughtsObserved: number;
  totalTests: number;
  thoughtsToday: number;
  testsToday: number;
}

export interface Citation {
  id: string;
  type: 'science' | 'contemplative';
  title: string;
  authorOrSource: string;
  year?: string;
  summary: {
    grounded: string;
    poetic: string;
  };
  keyTakeaway: string;
}

export interface Chapter {
  id: string;
  number: string;
  exerciseId: string;
  canvasMode: 'static' | 'prediction' | 'coherence' | 'collective' | 'response' | 'observer' | 'integration';
  kicker: {
    grounded: string;
    poetic: string;
  };
  title: {
    grounded: string;
    poetic: string;
  };
  subtitle: {
    grounded: string;
    poetic: string;
  };
  paragraphs: {
    grounded: string[];
    poetic: string[];
  };
  citations: string[]; // citation IDs
  exercisePrompt: {
    grounded: string;
    poetic: string;
  };
}

export interface ExerciseDef {
  id: string;
  number: number;
  type: 'labeling' | 'journal' | 'timer' | 'sorting' | 'phased-journal';
  daysTotal: number;
  cadence: string;
  name: {
    grounded: string;
    poetic: string;
  };
  goal: {
    grounded: string;
    poetic: string;
  };
  scienceBasis: string;
  instructions: {
    grounded: string[];
    poetic: string[];
  };
}
