import React, { useState, useEffect } from 'react';
import { ExerciseDef, ObserverState, Tone } from '../types';
import { EXERCISE_DEFS, pickTone } from '../services/content';
import {
  recordExerciseSession,
  deleteExerciseEntry,
  calculateStreak,
} from '../services/storage';
import { soundscape } from '../services/soundscape';
import {
  ArrowLeft,
  Flame,
  CheckCircle,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

interface ExerciseViewProps {
  exerciseId: string;
  state: ObserverState;
  tone: Tone;
  onBackToHub: () => void;
  onStateUpdate: (newState: ObserverState) => void;
}

export const ExerciseView: React.FC<ExerciseViewProps> = ({
  exerciseId,
  state,
  tone,
  onBackToHub,
  onStateUpdate,
}) => {
  const def: ExerciseDef | undefined = EXERCISE_DEFS[exerciseId];
  const exState = state.exercises[exerciseId] || { entries: [], sessions: [] };
  const streak = calculateStreak(exState.sessions);
  const currentDay = Math.min(def ? def.daysTotal : 30, exState.sessions.length + 1);

  // General Notification / Save feedback
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ----------------------------------------------------
  // EXERCISE 1: Thought Labeling State
  // ----------------------------------------------------
  const [ex1Counts, setEx1Counts] = useState<Record<string, number>>({});
  const ex1Labels = [
    'Worry',
    'Planning',
    'Self-Judgment',
    'Memory',
    'Fantasy',
    'Sensation',
    'Neutral',
  ];
  const totalLabeled = Object.values(ex1Counts).reduce((a, b) => a + b, 0);

  const handleLabelThought = (label: string) => {
    setEx1Counts((prev) => ({ ...prev, [label]: (prev[label] || 0) + 1 }));
    soundscape.playAwarenessChime(440 + totalLabeled * 15);
  };

  const handleFinishEx1 = () => {
    if (totalLabeled === 0) return;
    const updated = recordExerciseSession('1', {
      type: 'labeling',
      counts: ex1Counts,
      totalObserved: totalLabeled,
    });
    onStateUpdate(updated);
    setSuccessMessage(`Session logged: ${totalLabeled} cognitive proposals labeled.`);
    setEx1Counts({});
  };

  // ----------------------------------------------------
  // EXERCISE 2: Source Tracking State
  // ----------------------------------------------------
  const [ex2Thought, setEx2Thought] = useState('');
  const [ex2Charge, setEx2Charge] = useState(5);
  const [ex2Distortion, setEx2Distortion] = useState('Catastrophizing');
  const [ex2Origin, setEx2Origin] = useState('');

  const handleFinishEx2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ex2Thought.trim()) return;
    const updated = recordExerciseSession('2', {
      type: 'source-tracking',
      thought: ex2Thought,
      charge: ex2Charge,
      distortion: ex2Distortion,
      origin: ex2Origin,
    });
    onStateUpdate(updated);
    setSuccessMessage('Predictive source documented and defused.');
    setEx2Thought('');
    setEx2Origin('');
  };

  // ----------------------------------------------------
  // EXERCISE 3: Awareness Anchor Timer State (4 Blocks)
  // ----------------------------------------------------
  const [anchorBlock, setAnchorBlock] = useState<number>(0); // 0, 1, 2, 3
  const [anchorSecondsLeft, setAnchorSecondsLeft] = useState<number>(150); // 2.5 min = 150s
  const [isAnchorRunning, setIsAnchorRunning] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');

  const anchorBlockNames = [
    { title: 'Settle', prompt: 'Release muscle tension and settle bone weight.' },
    { title: 'Anchor to Breath', prompt: 'Anchor attention at the nostril tip or belly.' },
    { title: 'Widen Awareness', prompt: 'Expand field to all 360-degree sounds and sensations.' },
    { title: 'Rest as Observer', prompt: 'Rest as the unchanging space hosting all perceptions.' },
  ];

  useEffect(() => {
    if (!isAnchorRunning) return;
    const interval = setInterval(() => {
      setAnchorSecondsLeft((prev) => {
        if (prev <= 1) {
          if (anchorBlock < 3) {
            setAnchorBlock((b) => b + 1);
            soundscape.playAwarenessChime(528);
            return 150;
          } else {
            setIsAnchorRunning(false);
            const updated = recordExerciseSession('3', {
              type: 'anchor-timer',
              durationMin: 10,
            });
            onStateUpdate(updated);
            setSuccessMessage('10-minute Awareness Anchor session complete.');
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAnchorRunning, anchorBlock, onStateUpdate]);

  // Gentle 10s breathing rhythm cycle (4s in, 4s out, 2s pause)
  useEffect(() => {
    if (!isAnchorRunning) return;
    const bInterval = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'Inhale') return 'Exhale';
        return 'Inhale';
      });
    }, 5000);
    return () => clearInterval(bInterval);
  }, [isAnchorRunning]);

  // ----------------------------------------------------
  // EXERCISE 4: Thought Origin Sorting State
  // ----------------------------------------------------
  const [ex4Input, setEx4Input] = useState('');
  const [ex4Category, setEx4Category] = useState<'direct' | 'personal' | 'collective'>('personal');
  const [ex4List, setEx4List] = useState<Array<{ text: string; category: string }>>([]);

  const handleAddEx4Thought = () => {
    if (!ex4Input.trim()) return;
    setEx4List((prev) => [...prev, { text: ex4Input.trim(), category: ex4Category }]);
    setEx4Input('');
  };

  const recycledNoisePct =
    ex4List.length > 0
      ? Math.round(
          (ex4List.filter((t) => t.category !== 'direct').length / ex4List.length) * 100
        )
      : 0;

  const handleFinishEx4 = () => {
    if (ex4List.length === 0) return;
    const updated = recordExerciseSession('4', {
      type: 'origin-sorting',
      thoughts: ex4List,
      noisePercentage: recycledNoisePct,
    });
    onStateUpdate(updated);
    setSuccessMessage(`Session logged: ${recycledNoisePct}% calculated as recycled noise.`);
    setEx4List([]);
  };

  // ----------------------------------------------------
  // EXERCISE 5: Reality Response Journal State
  // ----------------------------------------------------
  const [ex5Text, setEx5Text] = useState('');
  const [ex5Openness, setEx5Openness] = useState(7);
  const [ex5Reaction, setEx5Reaction] = useState('');

  const currentPhaseIndex = Math.min(3, Math.floor(exState.sessions.length / 7));
  const phaseNames = [
    'Phase 1: Baseline Observation',
    'Phase 2: Pattern Recognition',
    'Phase 3: Cognitive Defusion',
    'Phase 4: Behavioral Shift',
  ];

  const handleFinishEx5 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ex5Text.trim()) return;
    const updated = recordExerciseSession('5', {
      type: 'reality-response',
      phase: phaseNames[currentPhaseIndex],
      text: ex5Text,
      openness: ex5Openness,
      counterpartReaction: ex5Reaction,
    });
    onStateUpdate(updated);
    setSuccessMessage('Reality response entry recorded.');
    setEx5Text('');
    setEx5Reaction('');
  };

  // ----------------------------------------------------
  // EXERCISE 6: Identity Shift Protocol State
  // ----------------------------------------------------
  const [ex6Narrative, setEx6Narrative] = useState('');
  const [ex6Witness, setEx6Witness] = useState('');

  const handleFinishEx6 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ex6Narrative.trim()) return;
    const updated = recordExerciseSession('6', {
      type: 'identity-shift',
      narrativeStory: ex6Narrative,
      witnessPerspective: ex6Witness,
    });
    onStateUpdate(updated);
    setSuccessMessage('Identity shift logged: Transferred from Content to Context.');
    setEx6Narrative('');
    setEx6Witness('');
  };

  // ----------------------------------------------------
  // EXERCISE 7: Daily Integration State
  // ----------------------------------------------------
  const [ex7Area, setEx7Area] = useState<'Relationships' | 'Work' | 'Health' | 'Finances'>('Relationships');
  const [ex7Reflection, setEx7Reflection] = useState('');

  const handleFinishEx7 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ex7Reflection.trim()) return;
    const updated = recordExerciseSession('7', {
      type: 'daily-integration',
      domain: ex7Area,
      reflection: ex7Reflection,
    });
    onStateUpdate(updated);
    setSuccessMessage(`Integration in ${ex7Area} recorded.`);
    setEx7Reflection('');
  };

  const handleDeleteEntry = (entryId: string) => {
    const updated = deleteExerciseEntry(exerciseId, entryId);
    onStateUpdate(updated);
  };

  if (!def) {
    return (
      <div className="p-12 text-center">
        <p>Exercise protocol not found.</p>
        <button onClick={onBackToHub} className="mt-4 px-4 py-2 bg-stone-800 text-stone-200">
          Back to Hub
        </button>
      </div>
    );
  }

  return (
    <div
      data-testid="exercise-view-container"
      className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10"
    >
      {/* Top Header & Breadcrumbs */}
      <div className="space-y-4">
        <button
          onClick={onBackToHub}
          data-testid="back-to-hub-button"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-400 hover:text-[#E2B859] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Practice Hub</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-b border-white/[0.08] pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 text-xs font-mono uppercase text-stone-400">
              <span className="text-[#E2B859] font-semibold">Protocol 0{def.number}</span>
              <span>·</span>
              <span>Day {currentDay} of {def.daysTotal}</span>
              <span>·</span>
              <span>{def.cadence}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-stone-100 font-light">
              {pickTone(def.name, tone)}
            </h1>
            <p className="text-xs sm:text-sm font-sans text-stone-400 max-w-2xl leading-relaxed">
              {pickTone(def.goal, tone)}
            </p>
          </div>

          {streak > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-xs font-mono text-[#F59E0B] self-start sm:self-auto">
              <Flame className="w-4 h-4" />
              <span>{streak} Day Streak</span>
            </div>
          )}
        </div>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div
          data-testid="exercise-success-banner"
          className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs sm:text-sm flex items-center justify-between animate-in fade-in"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-xs font-mono text-emerald-400 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Protocol Instructions Box */}
      <div className="p-5 rounded-xl bg-[#0B0D13] border border-white/[0.07] space-y-2.5 text-xs text-stone-300 font-sans leading-relaxed">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8]">
          <Info className="w-3.5 h-3.5" />
          <span>Protocol Guidance:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-stone-400">
          {pickTone(def.instructions, tone).map((inst, i) => (
            <li key={i}>{inst}</li>
          ))}
        </ul>
      </div>

      {/* ---------------------------------------------------- */}
      {/* INTERACTIVE WORKSPACE PER EXERCISE                   */}
      {/* ---------------------------------------------------- */}

      {/* EXERCISE 1: Thought Labeling & Widening Gap */}
      {exerciseId === '1' && (
        <div
          data-testid="ex1-workspace"
          className="p-6 sm:p-8 rounded-2xl bg-[#0B0D13] border border-white/10 space-y-8 text-center"
        >
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E2B859]">
              The Metacognitive Gap
            </span>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              Tap the category of each thought that appears. Notice the physical visual separation
              between the observer and the mental impulse.
            </p>
          </div>

          {/* Dual Orb Visualizer (Widening Metacognitive Distance) */}
          <div className="py-6 flex items-center justify-center">
            <div className="flex items-center justify-center transition-all duration-500">
              {/* Orb 1: The Observer */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#E2B859] shadow-[0_0_25px_rgba(226,184,89,0.7)] flex items-center justify-center text-[10px] font-mono text-[#040507] font-bold">
                  YOU
                </div>
                <span className="text-[10px] font-mono text-stone-400">Awareness</span>
              </div>

              {/* The widening space */}
              <div
                className="h-0.5 bg-gradient-to-r from-[#E2B859] via-stone-700 to-[#38BDF8] transition-all duration-300 mx-2"
                style={{
                  width: `${Math.min(260, Math.max(30, 40 + totalLabeled * 16))}px`,
                }}
              />

              {/* Orb 2: The Thought */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.6)] flex items-center justify-center text-[10px] font-mono text-[#040507] font-bold">
                  OBJ
                </div>
                <span className="text-[10px] font-mono text-stone-400">Thought</span>
              </div>
            </div>
          </div>

          <div className="text-xs font-mono text-stone-400">
            Current Session:{' '}
            <span className="text-[#E2B859] font-bold text-sm tabular-nums">{totalLabeled}</span>{' '}
            thoughts defused
          </div>

          {/* Label Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {ex1Labels.map((lbl) => (
              <button
                key={lbl}
                onClick={() => handleLabelThought(lbl)}
                data-testid={`label-chip-${lbl.toLowerCase()}`}
                className="px-4 py-2.5 rounded-full bg-[#040507] hover:bg-stone-900 border border-white/10 hover:border-[#E2B859]/50 text-stone-200 text-xs font-sans font-medium transition-all hover:scale-105 active:scale-95"
              >
                <span>{lbl}</span>
                {ex1Counts[lbl] && (
                  <span className="ml-2 text-[10px] font-mono text-[#E2B859]">
                    ({ex1Counts[lbl]})
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-white/[0.06]">
            <button
              onClick={handleFinishEx1}
              disabled={totalLabeled === 0}
              data-testid="finish-ex1-button"
              className="px-6 py-3 rounded-xl bg-[#E2B859] disabled:opacity-40 disabled:hover:scale-100 hover:bg-[#d6aa46] text-[#040507] font-semibold text-xs font-sans tracking-wide transition-all shadow-[0_0_20px_rgba(226,184,89,0.25)]"
            >
              Log Labeling Session ({totalLabeled} items)
            </button>
          </div>
        </div>
      )}

      {/* EXERCISE 2: Predictive Source Tracking */}
      {exerciseId === '2' && (
        <form
          onSubmit={handleFinishEx2}
          data-testid="ex2-form"
          className="p-6 sm:p-8 rounded-2xl bg-[#0B0D13] border border-white/10 space-y-6 text-left"
        >
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
              1. The Charged Thought (Cognitive Projection)
            </label>
            <textarea
              required
              rows={3}
              value={ex2Thought}
              onChange={(e) => setEx2Thought(e.target.value)}
              placeholder="e.g. 'If this project falters, everyone will realize I have no real competence.'"
              className="w-full p-3.5 rounded-xl bg-[#040507] border border-white/10 text-stone-200 text-sm focus:border-[#38BDF8] outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="uppercase text-stone-400">2. Emotional / Somatic Intensity</span>
              <span className="text-[#38BDF8] tabular-nums font-bold">{ex2Charge} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={ex2Charge}
              onChange={(e) => setEx2Charge(parseInt(e.target.value, 10))}
              className="w-full accent-[#38BDF8] bg-stone-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
              3. Cognitive Distortion Blueprint
            </label>
            <select
              value={ex2Distortion}
              onChange={(e) => setEx2Distortion(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#040507] border border-white/10 text-stone-200 text-sm outline-none cursor-pointer"
            >
              <option value="Catastrophizing">Catastrophizing (Assuming worst-case certainty)</option>
              <option value="Mind-Reading">Mind-Reading (Projecting motives onto others)</option>
              <option value="Imposter/Scarcity">Imposter / Scarcity Syndrome</option>
              <option value="Black-and-White">Black-and-White (All-or-nothing framing)</option>
              <option value="Personalization">Personalization (Taking ambient stress personally)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
              4. Traced Etiology (Whose fear was this originally?)
            </label>
            <textarea
              required
              rows={2}
              value={ex2Origin}
              onChange={(e) => setEx2Origin(e.target.value)}
              placeholder="e.g. 'Inherited from my father's anxiety about financial instability during 2008.'"
              className="w-full p-3.5 rounded-xl bg-[#040507] border border-white/10 text-stone-200 text-sm focus:border-[#38BDF8] outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            data-testid="submit-ex2-button"
            className="w-full py-3.5 rounded-xl bg-[#38BDF8] hover:bg-[#25aee8] text-[#040507] font-semibold text-xs font-sans uppercase tracking-wider transition-all"
          >
            Record Source Analysis
          </button>
        </form>
      )}

      {/* EXERCISE 3: Awareness Anchor 4-Block Timer */}
      {exerciseId === '3' && (
        <div
          data-testid="ex3-workspace"
          className="p-6 sm:p-8 rounded-2xl bg-[#0B0D13] border border-white/10 space-y-8 text-center"
        >
          {/* Block Indicator Dots */}
          <div className="flex items-center justify-center gap-3">
            {anchorBlockNames.map((blk, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === anchorBlock
                      ? 'bg-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.8)] scale-125'
                      : idx < anchorBlock
                      ? 'bg-emerald-500'
                      : 'bg-stone-800'
                  }`}
                />
                <span
                  className={`text-xs font-mono hidden sm:inline ${
                    idx === anchorBlock ? 'text-stone-200 font-medium' : 'text-stone-600'
                  }`}
                >
                  {blk.title}
                </span>
              </div>
            ))}
          </div>

          {/* Breathing Visualizer Ring */}
          <div className="py-6 flex flex-col items-center justify-center">
            <div
              className={`w-44 h-44 rounded-full border-2 border-[#38BDF8]/40 flex flex-col items-center justify-center transition-all duration-1000 ${
                isAnchorRunning && breathPhase === 'Inhale'
                  ? 'scale-110 bg-[#38BDF8]/10 border-[#38BDF8]'
                  : 'scale-90 bg-transparent'
              }`}
            >
              <span className="text-3xl font-serif text-stone-100 tabular-nums">
                {Math.floor(anchorSecondsLeft / 60)}:
                {(anchorSecondsLeft % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8] mt-1">
                {isAnchorRunning ? breathPhase : 'Ready'}
              </span>
            </div>
          </div>

          {/* Current Block Prompt */}
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-serif text-stone-200">
              Block {anchorBlock + 1}: {anchorBlockNames[anchorBlock].title}
            </h3>
            <p className="text-xs text-stone-400 font-sans">
              {anchorBlockNames[anchorBlock].prompt}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setIsAnchorRunning(!isAnchorRunning)}
              data-testid="anchor-play-button"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#38BDF8] hover:bg-[#25aee8] text-[#040507] font-semibold text-xs font-sans tracking-wide transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)]"
            >
              {isAnchorRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isAnchorRunning ? 'Pause Session' : 'Begin 10-Minute Anchor'}</span>
            </button>

            <button
              onClick={() => {
                setIsAnchorRunning(false);
                setAnchorBlock(0);
                setAnchorSecondsLeft(150);
              }}
              data-testid="anchor-reset-button"
              className="p-3 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 border border-white/10"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* EXERCISE 4: Thought Origin Investigation & Recycled Noise Metric */}
      {exerciseId === '4' && (
        <div
          data-testid="ex4-workspace"
          className="p-6 sm:p-8 rounded-2xl bg-[#0B0D13] border border-white/10 space-y-6 text-left"
        >
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E2B859]">
              Memetic Origin Classifier
            </span>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Classify newly arisen thoughts into their root origin: Direct Sensory intelligence,
              Personal biographical memory, or Collective cultural conditioning.
            </p>
          </div>

          {/* Input & Classification Buttons */}
          <div className="space-y-4">
            <input
              type="text"
              value={ex4Input}
              onChange={(e) => setEx4Input(e.target.value)}
              placeholder="Enter a thought that recently arose..."
              className="w-full p-3.5 rounded-xl bg-[#040507] border border-white/10 text-stone-200 text-sm outline-none focus:border-[#E2B859]"
            />

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-stone-500 uppercase">Origin:</span>
              <button
                type="button"
                onClick={() => setEx4Category('direct')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                  ex4Category === 'direct'
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500'
                    : 'bg-[#040507] text-stone-400 border-white/10'
                }`}
              >
                Direct Sensory (Here & Now)
              </button>
              <button
                type="button"
                onClick={() => setEx4Category('personal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                  ex4Category === 'personal'
                    ? 'bg-amber-950/40 text-amber-300 border-amber-500'
                    : 'bg-[#040507] text-stone-400 border-white/10'
                }`}
              >
                Personal History (Past Scars)
              </button>
              <button
                type="button"
                onClick={() => setEx4Category('collective')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                  ex4Category === 'collective'
                    ? 'bg-rose-950/40 text-rose-300 border-rose-500'
                    : 'bg-[#040507] text-stone-400 border-white/10'
                }`}
              >
                Collective / Cultural Noise
              </button>

              <button
                type="button"
                onClick={handleAddEx4Thought}
                className="ml-auto px-4 py-1.5 rounded-lg bg-[#E2B859] text-[#040507] font-semibold text-xs font-mono"
              >
                Add Thought
              </button>
            </div>
          </div>

          {/* List of classified items in this session */}
          {ex4List.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone-400">Classified Stream ({ex4List.length})</span>
                <span className="text-[#F59E0B] font-bold">
                  Recycled Noise: {recycledNoisePct}%
                </span>
              </div>

              <div className="space-y-2">
                {ex4List.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#040507] border border-white/5 flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-stone-300 font-sans">{item.text}</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded capitalize ${
                        item.category === 'direct'
                          ? 'text-emerald-400 bg-emerald-950/30'
                          : item.category === 'personal'
                          ? 'text-amber-400 bg-amber-950/30'
                          : 'text-rose-400 bg-rose-950/30'
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleFinishEx4}
                className="w-full py-3 rounded-xl bg-[#E2B859] text-[#040507] font-semibold text-xs font-mono uppercase tracking-wider"
              >
                Log Origin Audit Session
              </button>
            </div>
          )}
        </div>
      )}

      {/* EXERCISE 5: Reality Response Journal */}
      {exerciseId === '5' && (
        <form
          onSubmit={handleFinishEx5}
          data-testid="ex5-form"
          className="p-6 sm:p-8 rounded-2xl bg-[#0B0D13] border border-white/10 space-y-6 text-left"
        >
          <div className="p-3 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-xs font-mono text-[#38BDF8]">
            Current Curriculum: {phaseNames[currentPhaseIndex]}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
              Internal State & Attentional Gating Observation
            </label>
            <textarea
              required
              rows={4}
              value={ex5Text}
              onChange={(e) => setEx5Text(e.target.value)}
              placeholder="What automatic defensiveness did you witness in yourself today during meetings or conversations?"
              className="w-full p-3.5 rounded-xl bg-[#040507] border border-white/10 text-stone-200 text-sm focus:border-[#38BDF8] outline-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="uppercase text-stone-400">Openness / Non-Reactivity Rating</span>
              <span className="text-[#38BDF8] tabular-nums font-bold">{ex5Openness} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={ex5Openness}
              onChange={(e) => setEx5Openness(parseInt(e.target.value, 10))}
              className="w-full accent-[#38BDF8] bg-stone-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
              How did the external environment/counterpart respond?
            </label>
            <textarea
              rows={2}
              value={ex5Reaction}
              onChange={(e) => setEx5Reaction(e.target.value)}
              placeholder="e.g. 'When I dropped the urge to defend myself, they visibly softened within 30 seconds.'"
              className="w-full p-3.5 rounded-xl bg-[#040507] border border-white/10 text-stone-200 text-sm focus:border-[#38BDF8] outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#38BDF8] text-[#040507] font-semibold text-xs font-sans uppercase tracking-wider transition-all"
          >
            Save Reality Response Log
          </button>
        </form>
      )}

      {/* EXERCISE 6: Identity Shift Protocol */}
      {exerciseId === '6' && (
        <form
          onSubmit={handleFinishEx6}
          data-testid="ex6-form"
          className="p-6 sm:p-8 rounded-2xl bg-[#0B0D13] border border-white/10 space-y-6 text-left"
        >
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
              Self-As-Content (The Story)
            </label>
            <textarea
              required
              rows={3}
              value={ex6Narrative}
              onChange={(e) => setEx6Narrative(e.target.value)}
              placeholder="Write the narrative ego story: 'I am someone who struggles with...'"
              className="w-full p-3.5 rounded-xl bg-[#040507] border border-white/10 text-stone-200 text-sm outline-none focus:border-[#E2B859]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
              Self-As-Context (The Witnessing Space)
            </label>
            <textarea
              required
              rows={3}
              value={ex6Witness}
              onChange={(e) => setEx6Witness(e.target.value)}
              placeholder="Rewrite from the invariant sky: 'Awareness is noticing the weather of anxiety passing through without harm...'"
              className="w-full p-3.5 rounded-xl bg-[#040507] border border-white/10 text-stone-200 text-sm outline-none focus:border-[#E2B859]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#E2B859] text-[#040507] font-semibold text-xs font-mono uppercase tracking-wider"
          >
            Commit Identity Reframe
          </button>
        </form>
      )}

      {/* EXERCISE 7: Daily Integration Multi-Domain */}
      {exerciseId === '7' && (
        <form
          onSubmit={handleFinishEx7}
          data-testid="ex7-form"
          className="p-6 sm:p-8 rounded-2xl bg-[#0B0D13] border border-white/10 space-y-6 text-left"
        >
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
              Choose Life Domain
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Relationships', 'Work', 'Health', 'Finances'] as const).map((dom) => (
                <button
                  key={dom}
                  type="button"
                  onClick={() => setEx7Area(dom)}
                  className={`py-2 px-3 rounded-lg text-xs font-mono border text-center transition-all ${
                    ex7Area === dom
                      ? 'bg-[#E2B859] text-[#040507] border-[#E2B859] font-bold'
                      : 'bg-[#040507] text-stone-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
              4-Step Integration Sequence (Orient → Observe → Choose → Embody)
            </label>
            <textarea
              required
              rows={4}
              value={ex7Reflection}
              onChange={(e) => setEx7Reflection(e.target.value)}
              placeholder={`How will you anchor the unreactive observer in your ${ex7Area} today?`}
              className="w-full p-3.5 rounded-xl bg-[#040507] border border-white/10 text-stone-200 text-sm outline-none focus:border-[#E2B859]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#E2B859] text-[#040507] font-semibold text-xs font-mono uppercase tracking-wider"
          >
            Complete Daily Integration
          </button>
        </form>
      )}

      {/* ---------------------------------------------------- */}
      {/* HISTORICAL JOURNAL ENTRIES LIST                      */}
      {/* ---------------------------------------------------- */}
      <div className="pt-8 border-t border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-serif text-stone-200">
            Historical Journal Entries ({exState.entries.length})
          </h3>
        </div>

        {exState.entries.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#0B0D13] border border-white/[0.05] text-center text-xs font-mono text-stone-500">
            No entries recorded for this protocol yet. Complete your first session above.
          </div>
        ) : (
          <div className="space-y-3">
            {exState.entries.map((entry) => (
              <div
                key={entry.id}
                data-testid={`journal-entry-${entry.id}`}
                className="p-4 rounded-xl bg-[#0B0D13] border border-white/[0.06] flex items-start justify-between gap-4 text-xs font-sans"
              >
                <div className="space-y-1 text-stone-300">
                  <div className="text-[11px] font-mono text-stone-500">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </div>

                  {/* Render based on exercise type */}
                  {entry.thought && (
                    <p>
                      <strong className="text-stone-400">Thought:</strong> "{entry.thought}"
                    </p>
                  )}
                  {entry.origin && (
                    <p>
                      <strong className="text-stone-400">Origin:</strong> {entry.origin}
                    </p>
                  )}
                  {entry.distortion && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-[#38BDF8]">
                      {entry.distortion}
                    </span>
                  )}
                  {entry.totalObserved && (
                    <p>
                      <strong className="text-stone-400">Total Labeled:</strong>{' '}
                      {entry.totalObserved}
                    </p>
                  )}
                  {entry.text && <p className="leading-relaxed">{entry.text}</p>}
                  {entry.narrativeStory && (
                    <p>
                      <strong className="text-stone-400">Story:</strong> {entry.narrativeStory}
                    </p>
                  )}
                  {entry.witnessPerspective && (
                    <p className="text-[#E2B859]">
                      <strong>Context:</strong> {entry.witnessPerspective}
                    </p>
                  )}
                  {entry.domain && (
                    <p>
                      <strong className="text-stone-400">Domain:</strong> {entry.domain} —{' '}
                      {entry.reflection}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteEntry(entry.id)}
                  title="Delete Entry"
                  data-testid={`delete-entry-${entry.id}`}
                  className="p-1.5 text-stone-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
