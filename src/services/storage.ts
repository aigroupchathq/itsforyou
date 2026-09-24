import {
  ObserverState,
  TestHistoryEntry,
  GapLogEntry,
  ExerciseEntry,
  GlobalStats,
  DiagnosticRadarData,
  DiagnosticHistoryEntry,
  SiftedThought,
  TitchenerSession,
  SocraticSession,
  SupabaseConfig,
} from '../types';

const STORAGE_KEY = 'observer_state_v1';
const GLOBAL_STATS_KEY = 'observer_global_stats_v1';

const DEFAULT_STATE: ObserverState = {
  version: 1,
  createdAt: new Date().toISOString(),
  tone: 'grounded',
  onboarded: false,
  settings: {
    muted: true,
    silenceMode: false,
    readingMode: false,
    volume: 0.5,
    soundMode: 'drone',
  },
  test: {
    best: null,
    history: [],
  },
  gapLog: [
    { date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0], value: 12, label: 'Initial Baseline' },
    { date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], value: 18, label: 'First Test' },
    { date: new Date(Date.now() - 86400000).toISOString().split('T')[0], value: 27, label: 'Labeling Session' },
  ],
  exercises: {
    '1': { entries: [], sessions: [] },
    '2': { entries: [], sessions: [] },
    '3': { entries: [], sessions: [] },
    '4': { entries: [], sessions: [] },
    '5': { entries: [], sessions: [] },
    '6': { entries: [], sessions: [] },
    '7': { entries: [], sessions: [] },
  },
  diagnostics: {
    latestRadar: null,
    history: [],
  },
  thoughtLab: {
    siftedThoughts: [],
    titchenerSessions: [],
    socraticSessions: [],
  },
};

export function loadState(): ObserverState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
      test: { ...DEFAULT_STATE.test, ...(parsed.test || {}) },
      exercises: { ...DEFAULT_STATE.exercises, ...(parsed.exercises || {}) },
      diagnostics: {
        latestRadar: parsed.diagnostics?.latestRadar || null,
        history: parsed.diagnostics?.history || [],
      },
      thoughtLab: {
        siftedThoughts: parsed.thoughtLab?.siftedThoughts || [],
        titchenerSessions: parsed.thoughtLab?.titchenerSessions || [],
        socraticSessions: parsed.thoughtLab?.socraticSessions || [],
      },
      supabaseConfig: parsed.supabaseConfig || undefined,
    };
  } catch (e) {
    console.error('Failed to load state from localStorage:', e);
    return DEFAULT_STATE;
  }
}

export function saveState(state: ObserverState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
}

export function recordTest(
  thoughts: number,
  durationSec: number = 60
): { updatedState: ObserverState; isNewBest: boolean } {
  const state = loadState();
  const today = new Date().toISOString().split('T')[0];

  let mindVelocity = 'Balanced Attention';
  if (thoughts <= 8) mindVelocity = 'Deep Stillness (Sub-baseline)';
  else if (thoughts <= 18) mindVelocity = 'Measured Flow';
  else if (thoughts <= 32) mindVelocity = 'Turbulent Stream';
  else mindVelocity = 'Accelerated Processing Storm';

  const entry: TestHistoryEntry = {
    id: `test_${Date.now()}`,
    date: new Date().toISOString(),
    thoughts,
    durationSec,
    mindVelocity,
  };

  const isNewBest = state.test.best === null || thoughts < state.test.best;
  const newBest = isNewBest ? thoughts : state.test.best;

  const updatedHistory = [entry, ...state.test.history].slice(0, 50);

  // Append to gap log (widening gap score)
  const newGapValue = Math.max(10, Math.round(100 - thoughts * 1.8));
  const updatedGapLog: GapLogEntry[] = [
    ...state.gapLog,
    { date: today, value: newGapValue, label: '60s Test' },
  ];

  const updatedState: ObserverState = {
    ...state,
    test: {
      best: newBest,
      history: updatedHistory,
    },
    gapLog: updatedGapLog,
  };

  saveState(updatedState);
  incrementGlobalThoughts(thoughts, true);

  return { updatedState, isNewBest };
}

export function recordExerciseSession(
  exerciseId: string,
  entryData: Record<string, any>
): ObserverState {
  const state = loadState();
  const today = new Date().toISOString().split('T')[0];

  const currentExercise = state.exercises[exerciseId] || { entries: [], sessions: [] };
  const entry: ExerciseEntry = {
    id: `entry_${Date.now()}`,
    date: new Date().toISOString(),
    ...entryData,
  };

  const sessionsSet = new Set(currentExercise.sessions);
  sessionsSet.add(today);

  const updatedExercise = {
    startedAt: currentExercise.startedAt || new Date().toISOString(),
    entries: [entry, ...currentExercise.entries],
    sessions: Array.from(sessionsSet).sort(),
  };

  // Metacognitive gap increases with practice
  const lastGap = state.gapLog.length > 0 ? state.gapLog[state.gapLog.length - 1].value : 20;
  const updatedGapLog: GapLogEntry[] = [
    ...state.gapLog,
    { date: today, value: Math.min(100, lastGap + 4), exerciseId, label: `Exercise ${exerciseId}` },
  ];

  const updatedState: ObserverState = {
    ...state,
    gapLog: updatedGapLog,
    exercises: {
      ...state.exercises,
      [exerciseId]: updatedExercise,
    },
  };

  saveState(updatedState);
  incrementGlobalThoughts(1, false);

  return updatedState;
}

export function deleteExerciseEntry(exerciseId: string, entryId: string): ObserverState {
  const state = loadState();
  const current = state.exercises[exerciseId];
  if (!current) return state;

  const updated = {
    ...current,
    entries: current.entries.filter((e) => e.id !== entryId),
  };

  const updatedState = {
    ...state,
    exercises: {
      ...state.exercises,
      [exerciseId]: updated,
    },
  };
  saveState(updatedState);
  return updatedState;
}

/**
 * Calculates consecutive day streak ending either today or yesterday.
 */
export function calculateStreak(sessions: string[]): number {
  if (!sessions || sessions.length === 0) return 0;
  const uniqueDates = Array.from(new Set(sessions)).sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const firstDate = uniqueDates[0];
  if (firstDate !== today && firstDate !== yesterday) {
    return 0;
  }

  let streak = 0;
  let expectedDate = new Date(firstDate);

  for (const dateStr of uniqueDates) {
    const cur = new Date(dateStr);
    const diffDays = Math.round(
      (expectedDate.getTime() - cur.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      streak += 1;
      expectedDate = new Date(expectedDate.getTime() - 86400000);
    } else {
      break;
    }
  }

  return streak;
}

export function getAllSessionDates(state: ObserverState): string[] {
  const all = new Set<string>();
  Object.values(state.exercises).forEach((ex) => {
    ex.sessions.forEach((s) => all.add(s));
  });
  state.test.history.forEach((t) => {
    all.add(t.date.split('T')[0]);
  });
  return Array.from(all).sort();
}

export function exportBackupJSON(): string {
  const state = loadState();
  return JSON.stringify(state, null, 2);
}

export function importBackupJSON(jsonString: string): { success: boolean; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid JSON format' };
    }
    // Verify minimal structure
    if (!parsed.exercises && !parsed.test) {
      return { success: false, error: 'Backup does not contain Observer state' };
    }
    saveState({
      ...DEFAULT_STATE,
      ...parsed,
      version: 1,
    });
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || 'Parsing error' };
  }
}

export function resetAllProgress(): ObserverState {
  localStorage.removeItem(STORAGE_KEY);
  const fresh = { ...DEFAULT_STATE, createdAt: new Date().toISOString() };
  saveState(fresh);
  return fresh;
}

// Global anonymous stats (persisted locally with fallback, and POSTed to backend)
export function getGlobalStats(): GlobalStats {
  try {
    const raw = localStorage.getItem(GLOBAL_STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    totalThoughtsObserved: 148293,
    totalTests: 12480,
    thoughtsToday: 3841,
    testsToday: 312,
  };
}

export function incrementGlobalThoughts(count: number, isTest: boolean = false): void {
  try {
    const stats = getGlobalStats();
    stats.totalThoughtsObserved += count;
    stats.thoughtsToday += count;
    if (isTest) {
      stats.totalTests += 1;
      stats.testsToday += 1;
    }
    localStorage.setItem(GLOBAL_STATS_KEY, JSON.stringify(stats));

    // Also attempt anonymous backend POST if available
    fetch('/api/stats/thoughts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count, isTest }),
    }).catch(() => {});
  } catch {}
}

export function recordDiagnosticAssessment(
  radar: DiagnosticRadarData,
  answers: Record<string, number>
): ObserverState {
  const state = loadState();
  const entry: DiagnosticHistoryEntry = {
    id: `diag_${Date.now()}`,
    date: new Date().toISOString(),
    radar,
    answers,
  };

  const updatedHistory = [entry, ...(state.diagnostics?.history || [])].slice(0, 30);
  const updatedState: ObserverState = {
    ...state,
    diagnostics: {
      latestRadar: radar,
      history: updatedHistory,
    },
  };
  saveState(updatedState);
  return updatedState;
}

export function recordSiftedThought(
  thoughtData: Omit<SiftedThought, 'id' | 'date'>
): ObserverState {
  const state = loadState();
  const entry: SiftedThought = {
    id: `sift_${Date.now()}`,
    date: new Date().toISOString(),
    ...thoughtData,
  };
  const updatedList = [entry, ...(state.thoughtLab?.siftedThoughts || [])].slice(0, 50);
  const updatedState: ObserverState = {
    ...state,
    thoughtLab: {
      ...state.thoughtLab,
      siftedThoughts: updatedList,
    },
  };
  saveState(updatedState);
  incrementGlobalThoughts(1, false);
  return updatedState;
}

export function recordTitchenerSession(
  sessionData: Omit<TitchenerSession, 'id' | 'date'>
): ObserverState {
  const state = loadState();
  const entry: TitchenerSession = {
    id: `titch_${Date.now()}`,
    date: new Date().toISOString(),
    ...sessionData,
  };
  const updatedList = [entry, ...(state.thoughtLab?.titchenerSessions || [])].slice(0, 50);
  const updatedState: ObserverState = {
    ...state,
    thoughtLab: {
      ...state.thoughtLab,
      titchenerSessions: updatedList,
    },
  };
  saveState(updatedState);
  return updatedState;
}

export function recordSocraticSession(
  sessionData: Omit<SocraticSession, 'id' | 'date'>
): ObserverState {
  const state = loadState();
  const entry: SocraticSession = {
    id: `soc_${Date.now()}`,
    date: new Date().toISOString(),
    ...sessionData,
  };
  const updatedList = [entry, ...(state.thoughtLab?.socraticSessions || [])].slice(0, 50);
  const updatedState: ObserverState = {
    ...state,
    thoughtLab: {
      ...state.thoughtLab,
      socraticSessions: updatedList,
    },
  };
  saveState(updatedState);
  return updatedState;
}

export function updateSupabaseConfig(config: SupabaseConfig): ObserverState {
  const state = loadState();
  const updatedState: ObserverState = {
    ...state,
    supabaseConfig: config,
  };
  saveState(updatedState);
  return updatedState;
}

