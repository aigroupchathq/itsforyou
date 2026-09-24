import React, { useState, useEffect } from 'react';
import { ObserverState, Tone, SiftedThought, TitchenerSession, SocraticSession } from '../types';
import {
  recordSiftedThought,
  recordTitchenerSession,
  recordSocraticSession,
} from '../services/storage';
import { soundscape } from '../services/soundscape';
import {
  Cpu,
  Flame,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Scissors,
  ArrowRight,
  Shield,
  Volume2,
} from 'lucide-react';

interface ThoughtLabViewProps {
  state: ObserverState;
  tone: Tone;
  onUpdateState: (newState: ObserverState) => void;
}

export const ThoughtLabView: React.FC<ThoughtLabViewProps> = ({
  state,
  tone,
  onUpdateState,
}) => {
  const [activeTab, setActiveTab] = useState<'sifter' | 'titchener' | 'socratic'>('sifter');

  // ------------------------------------------------------------------
  // TAB 1: THOUGHT SIFTER (ANATOMY DISSECTOR)
  // ------------------------------------------------------------------
  const [sifterRaw, setSifterRaw] = useState('');
  const [sifterFact, setSifterFact] = useState('');
  const [sifterStory, setSifterStory] = useState('');
  const [sifterSomatic, setSifterSomatic] = useState('');
  const [sifterUrge, setSifterUrge] = useState('');
  const [sifterRating, setSifterRating] = useState(7);
  const [sifterSavedSuccess, setSifterSavedSuccess] = useState(false);

  const handleSaveSifter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sifterRaw.trim()) return;

    const newState = recordSiftedThought({
      rawThought: sifterRaw,
      sensoryFact: sifterFact || 'Direct sensory observation without narrative interpretation',
      corticalStory: sifterStory || 'Brain automatic threat simulation',
      somaticCharge: sifterSomatic || 'Subtle sympathetic nervous arousal',
      impulsiveUrge: sifterUrge || 'Compulsion to fix, avoid, or ruminate',
      defusionRating: sifterRating,
    });
    onUpdateState(newState);
    setSifterSavedSuccess(true);
    setTimeout(() => setSifterSavedSuccess(false), 3000);
    setSifterRaw('');
    setSifterFact('');
    setSifterStory('');
    setSifterSomatic('');
    setSifterUrge('');
  };

  // ------------------------------------------------------------------
  // TAB 2: TITCHENER RAPID SATURATION PACER (JAMAIS VU)
  // ------------------------------------------------------------------
  const [titchenerWord, setTitchenerWord] = useState('FAILURE');
  const [titchenerPre, setTitchenerPre] = useState(8);
  const [titchenerPost, setTitchenerPost] = useState(3);
  const [titchenerRunning, setTitchenerRunning] = useState(false);
  const [titchenerTimer, setTitchenerTimer] = useState(30);
  const [pulsePhase, setPulsePhase] = useState(false);
  const [titchenerComplete, setTitchenerComplete] = useState(false);

  useEffect(() => {
    let interval: any = null;
    let pulseInterval: any = null;

    if (titchenerRunning && titchenerTimer > 0) {
      interval = setInterval(() => {
        setTitchenerTimer((prev) => {
          if (prev <= 1) {
            setTitchenerRunning(false);
            setTitchenerComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Fast pulse 1.8 Hz
      pulseInterval = setInterval(() => {
        setPulsePhase((prev) => !prev);
        soundscape.playAwarenessChime(220);
      }, 550);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (pulseInterval) clearInterval(pulseInterval);
    };
  }, [titchenerRunning, titchenerTimer]);

  const startTitchener = () => {
    if (!titchenerWord.trim()) return;
    setTitchenerTimer(30);
    setTitchenerComplete(false);
    setTitchenerRunning(true);
  };

  const handleSaveTitchener = () => {
    const newState = recordTitchenerSession({
      word: titchenerWord,
      preCharge: titchenerPre,
      postCharge: titchenerPost,
      durationSec: 30,
    });
    onUpdateState(newState);
    setTitchenerComplete(false);
    setTitchenerWord('');
  };

  // ------------------------------------------------------------------
  // TAB 3: SOCRATIC & MCT DISPUTATION ENGINE
  // ------------------------------------------------------------------
  const [socraticBelief, setSocraticBelief] = useState('');
  const [socraticIsAuto, setSocraticIsAuto] = useState<boolean>(true);
  const [socraticCost, setSocraticCost] = useState('');
  const [socraticAction, setSocraticAction] = useState('');
  const [socraticSaved, setSocraticSaved] = useState(false);

  const handleSaveSocratic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socraticBelief.trim()) return;
    const newState = recordSocraticSession({
      belief: socraticBelief,
      isAutomatic: socraticIsAuto,
      costAssessment: socraticCost,
      contextualAction: socraticAction,
    });
    onUpdateState(newState);
    setSocraticSaved(true);
    setTimeout(() => setSocraticSaved(false), 3000);
    setSocraticBelief('');
    setSocraticCost('');
    setSocraticAction('');
  };

  return (
    <div className="relative min-h-screen bg-[#040507] text-stone-200 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background subtle illumination */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(226,184,89,0.05),transparent_60%)]" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-mono tracking-widest uppercase rounded-full border border-white/10 bg-[#0B0D13] text-[#E2B859] mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive Metacognitive Defusion Instruments</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-stone-100 font-light tracking-tight">
            The Thought Laboratory
          </h1>
          <p className="mt-3 text-stone-400 text-sm sm:text-base max-w-2xl mx-auto font-sans">
            {tone === 'grounded'
              ? 'Clinical tools derived from Acceptance & Commitment Therapy (ACT) and Metacognitive Therapy (MCT) to dismantle automatic cognitive loops.'
              : 'The alchemical furnace where sticky thoughts are dissolved back into harmless acoustic vibrations and passing light.'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 p-1.5 bg-[#0B0D13] border border-white/10 rounded-xl max-w-xl mx-auto mb-10">
          <button
            onClick={() => setActiveTab('sifter')}
            className={`flex-1 py-2.5 px-3 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'sifter'
                ? 'bg-[#12151F] text-[#E2B859] border border-[#E2B859]/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            The Thought Sifter
          </button>
          <button
            onClick={() => setActiveTab('titchener')}
            className={`flex-1 py-2.5 px-3 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'titchener'
                ? 'bg-[#12151F] text-[#38BDF8] border border-[#38BDF8]/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Semantic Saturation
          </button>
          <button
            onClick={() => setActiveTab('socratic')}
            className={`flex-1 py-2.5 px-3 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'socratic'
                ? 'bg-[#12151F] text-amber-400 border border-amber-400/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Socratic MCT Engine
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: THE THOUGHT SIFTER                                      */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'sifter' && (
          <div className="space-y-8">
            <div className="bg-[#0B0D13]/90 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
              <div className="flex items-center gap-2 mb-2 text-[#E2B859] font-mono text-xs uppercase tracking-wider">
                <Scissors className="w-4 h-4" />
                <span>Cognitive Anatomy Dissector</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif text-stone-100 mb-2">
                Sift Thought Into Raw Layers
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mb-6 font-sans">
                The suffering brain conflates objective physical reality with internal cortical narratives.
                Deconstruct any distressing sentence into its 4 constituent layers.
              </p>

              <form onSubmit={handleSaveSifter} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1.5">
                    1. Raw Entangled Thought
                  </label>
                  <input
                    type="text"
                    required
                    value={sifterRaw}
                    onChange={(e) => setSifterRaw(e.target.value)}
                    placeholder='e.g., "I am failing at my career and people are losing respect for me"'
                    className="w-full px-4 py-3 rounded-xl bg-[#12151F] border border-white/10 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#E2B859] text-sm font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#12151F]/60 border border-white/5 space-y-2">
                    <label className="block text-xs font-mono uppercase text-emerald-400">
                      Layer A: Sensory Fact (What a camera would record)
                    </label>
                    <textarea
                      rows={2}
                      value={sifterFact}
                      onChange={(e) => setSifterFact(e.target.value)}
                      placeholder='e.g., "Received an email asking for revision on slide 4."'
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0D13] border border-white/10 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-emerald-400 font-sans resize-none"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#12151F]/60 border border-white/5 space-y-2">
                    <label className="block text-xs font-mono uppercase text-rose-400">
                      Layer B: Cortical Projection (The brain's horror story)
                    </label>
                    <textarea
                      rows={2}
                      value={sifterStory}
                      onChange={(e) => setSifterStory(e.target.value)}
                      placeholder='e.g., "They think I am incompetent and I will be abandoned."'
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0D13] border border-white/10 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-rose-400 font-sans resize-none"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#12151F]/60 border border-white/5 space-y-2">
                    <label className="block text-xs font-mono uppercase text-[#38BDF8]">
                      Layer C: Visceral Somatic Charge (Where it burns)
                    </label>
                    <textarea
                      rows={2}
                      value={sifterSomatic}
                      onChange={(e) => setSifterSomatic(e.target.value)}
                      placeholder='e.g., "Solar plexus constriction, rapid breathing, hot cheeks."'
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0D13] border border-white/10 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[#38BDF8] font-sans resize-none"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#12151F]/60 border border-white/5 space-y-2">
                    <label className="block text-xs font-mono uppercase text-amber-400">
                      Layer D: Impulsive Urge (Survival reflex)
                    </label>
                    <textarea
                      rows={2}
                      value={sifterUrge}
                      onChange={(e) => setSifterUrge(e.target.value)}
                      placeholder='e.g., "Compulsively rewrite document at 2 AM, over-explain."'
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0D13] border border-white/10 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-400 font-sans resize-none"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#12151F] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="w-full sm:w-auto">
                    <span className="block text-xs font-mono uppercase text-stone-400">
                      Metacognitive Defusion Rating (Post-Sifting)
                    </span>
                    <span className="text-[11px] text-stone-500">
                      How separate do you feel from this thought now? (1 = Fully fused, 10 = Pure witness)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={sifterRating}
                      onChange={(e) => setSifterRating(Number(e.target.value))}
                      className="w-32 accent-[#E2B859]"
                    />
                    <span className="text-sm font-mono font-bold text-[#E2B859] w-6 text-right">
                      {sifterRating}/10
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {sifterSavedSuccess ? (
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Sifted thought cataloged in the laboratory.
                    </span>
                  ) : <div />}

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#E2B859] hover:bg-[#c99f43] text-stone-950 text-xs font-mono uppercase font-semibold tracking-wider transition-all shadow-[0_0_15px_rgba(226,184,89,0.3)] cursor-pointer"
                  >
                    Commit Sifted Breakdown
                  </button>
                </div>
              </form>
            </div>

            {/* Sifted thoughts archive */}
            {state.thoughtLab?.siftedThoughts?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-widest text-stone-400">
                  Recent Sifted Dissections ({state.thoughtLab.siftedThoughts.length})
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {state.thoughtLab.siftedThoughts.map((st) => (
                    <div
                      key={st.id}
                      className="p-4 rounded-xl bg-[#0B0D13] border border-white/5 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-sm text-stone-200 font-medium">
                          "{st.rawThought}"
                        </span>
                        <span className="font-mono text-[#E2B859] font-bold">
                          Defusion: {st.defusionRating}/10
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-400 pt-1 text-[11px]">
                        <div><strong className="text-emerald-400">Fact:</strong> {st.sensoryFact}</div>
                        <div><strong className="text-rose-400">Story:</strong> {st.corticalStory}</div>
                        <div><strong className="text-[#38BDF8]">Sensation:</strong> {st.somaticCharge}</div>
                        <div><strong className="text-amber-400">Urge:</strong> {st.impulsiveUrge}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: TITCHENER RAPID SATURATION PACER                       */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'titchener' && (
          <div className="space-y-8">
            <div className="bg-[#0B0D13]/90 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
              <div className="flex items-center gap-2 mb-2 text-[#38BDF8] font-mono text-xs uppercase tracking-wider">
                <Volume2 className="w-4 h-4" />
                <span>Titchener Semantic Satiation Protocol (1915)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif text-stone-100 mb-2">
                Dissolve Meaning Into Raw Phonetics
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mb-6 font-sans">
                When a dreaded trigger word (e.g. "Failure", "Unworthy", "Alone") is repeated continuously at 2 Hz,
                the cortical neural pattern fatiguing the semantic network gives out. The word is stripped down to mere phonetic vibrating air.
              </p>

              {!titchenerRunning && !titchenerComplete && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-400 mb-1.5">
                      Target Feared Word (1 or 2 words maximum)
                    </label>
                    <input
                      type="text"
                      value={titchenerWord}
                      onChange={(e) => setTitchenerWord(e.target.value.toUpperCase())}
                      placeholder="FAILURE"
                      className="w-full px-4 py-3 rounded-xl bg-[#12151F] border border-white/10 text-stone-100 font-mono tracking-widest text-lg uppercase focus:outline-none focus:border-[#38BDF8]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono text-stone-400 mb-2">
                      <span>Baseline Emotional Distress (Pre-Test)</span>
                      <span className="text-[#38BDF8] font-bold">{titchenerPre} / 10</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={titchenerPre}
                      onChange={(e) => setTitchenerPre(Number(e.target.value))}
                      className="w-full accent-[#38BDF8]"
                    />
                  </div>

                  <button
                    onClick={startTitchener}
                    disabled={!titchenerWord.trim()}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#38BDF8] to-cyan-500 text-stone-950 font-mono font-bold uppercase tracking-wider transition-all hover:opacity-95 shadow-[0_0_20px_rgba(56,189,248,0.3)] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-stone-950" />
                    <span>Begin 30-Second Rapid Pulse</span>
                  </button>
                </div>
              )}

              {/* ACTIVE RUNNING STROBE / PULSE */}
              {titchenerRunning && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="text-xs font-mono text-stone-500 tracking-widest">
                    WATCH & REPEAT OUT LOUD • TIME REMAINING: {titchenerTimer}s
                  </div>

                  {/* Pulsing Word Container */}
                  <div
                    className={`text-4xl sm:text-6xl lg:text-7xl font-mono font-black tracking-widest uppercase transition-all duration-150 ${
                      pulsePhase
                        ? 'text-[#38BDF8] scale-110 drop-shadow-[0_0_35px_rgba(56,189,248,0.8)]'
                        : 'text-stone-700 scale-95'
                    }`}
                  >
                    {titchenerWord}
                  </div>

                  <p className="text-xs font-sans text-stone-400 max-w-md">
                    Notice how the terror is an illusion of association. It is merely a mouth making shapes and pushing air through vocal cords.
                  </p>
                </div>
              )}

              {/* POST-TEST RATING & SAVE */}
              {titchenerComplete && (
                <div className="space-y-6 text-center py-6">
                  <h3 className="text-xl font-serif text-stone-100">
                    Protocol Complete. How much emotional power does "{titchenerWord}" have now?
                  </h3>

                  <div className="max-w-md mx-auto">
                    <div className="flex justify-between text-xs font-mono text-stone-400 mb-2">
                      <span>Post-Saturation Distress</span>
                      <span className="text-emerald-400 font-bold">{titchenerPost} / 10</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={titchenerPost}
                      onChange={(e) => setTitchenerPost(Number(e.target.value))}
                      className="w-full accent-emerald-400"
                    />
                    <div className="mt-2 text-xs font-mono text-stone-400">
                      Distress reduction: <span className="text-emerald-400 font-bold">-{titchenerPre - titchenerPost} points</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={handleSaveTitchener}
                      className="px-6 py-2.5 rounded-xl bg-emerald-400 text-stone-950 font-mono text-xs font-bold uppercase tracking-wider hover:bg-emerald-300 transition-all cursor-pointer"
                    >
                      Save Result to History
                    </button>
                    <button
                      onClick={() => setTitchenerComplete(false)}
                      className="px-5 py-2.5 rounded-xl border border-white/10 text-stone-300 hover:text-stone-100 text-xs font-mono uppercase transition-all"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: SOCRATIC & MCT METAGENIC DISPUTATION                   */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'socratic' && (
          <div className="space-y-8">
            <div className="bg-[#0B0D13]/90 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
              <div className="flex items-center gap-2 mb-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Metacognitive Inquiry & Socratic Disputation</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif text-stone-100 mb-2">
                Audit The Computational Cost of Rumination
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mb-6 font-sans">
                In Metacognitive Therapy (Wells, 2009), psychological suffering is maintained by positive beliefs about rumination
                (e.g., "Worrying keeps me safe") and negative beliefs about uncontrollability. Interrogate these premises directly.
              </p>

              <form onSubmit={handleSaveSocratic} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1.5">
                    1. Automatic Thought / Feared Proposition
                  </label>
                  <input
                    type="text"
                    required
                    value={socraticBelief}
                    onChange={(e) => setSocraticBelief(e.target.value)}
                    placeholder='e.g., "If I do not obsessively rehearse this meeting, I will be exposed."'
                    className="w-full px-4 py-3 rounded-xl bg-[#12151F] border border-white/10 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 text-sm font-sans"
                  />
                </div>

                <div className="p-4 rounded-xl bg-[#12151F] border border-white/5 space-y-3">
                  <span className="block text-xs font-mono uppercase text-stone-300">
                    2. Neuro-Origin Question: Did you deliberately author this thought, or did it fire autonomously?
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSocraticIsAuto(true)}
                      className={`p-3 rounded-lg border text-xs font-mono text-left transition-all ${
                        socraticIsAuto
                          ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                          : 'border-white/10 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <span className="font-bold block mb-0.5">Autonomous Cortical Spark</span>
                      <span>It fired without permission based on past trauma or survival wiring.</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSocraticIsAuto(false)}
                      className={`p-3 rounded-lg border text-xs font-mono text-left transition-all ${
                        !socraticIsAuto
                          ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                          : 'border-white/10 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <span className="font-bold block mb-0.5">Deliberate Voluntary Creation</span>
                      <span>I sat down and purposefully calculated this scenario.</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1.5">
                    3. What has entertaining and fighting this thought cost your nervous system?
                  </label>
                  <textarea
                    rows={2}
                    value={socraticCost}
                    onChange={(e) => setSocraticCost(e.target.value)}
                    placeholder="e.g., Lost 3 hours of deep sleep, exhausted focus, irritability with family."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#12151F] border border-white/10 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 text-xs font-sans resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1.5">
                    4. Contextual Sovereign Action: What value-aligned action can you take RIGHT NOW while leaving the thought alone?
                  </label>
                  <input
                    type="text"
                    value={socraticAction}
                    onChange={(e) => setSocraticAction(e.target.value)}
                    placeholder="e.g., Take a 10-minute walk, drink water, write the first 100 words."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#12151F] border border-white/10 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 text-xs font-sans"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {socraticSaved ? (
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Socratic inquiry recorded.
                    </span>
                  ) : <div />}

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-mono uppercase font-semibold tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  >
                    Seal Metacognitive Resolution
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
