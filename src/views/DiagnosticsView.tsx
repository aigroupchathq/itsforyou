import React, { useState } from 'react';
import { ObserverState, Tone } from '../types';
import { DIAGNOSTIC_ITEMS, calculateDiagnosticRadar } from '../services/diagnostics';
import { recordDiagnosticAssessment } from '../services/storage';
import { RadarChart } from '../components/RadarChart';
import {
  Activity,
  Award,
  CheckCircle2,
  ChevronRight,
  Download,
  Info,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Brain,
  Layers,
  HeartPulse,
} from 'lucide-react';

interface DiagnosticsViewProps {
  state: ObserverState;
  tone: Tone;
  onUpdateState: (newState: ObserverState) => void;
  onSelectExercise: (id: string) => void;
}

export const DiagnosticsView: React.FC<DiagnosticsViewProps> = ({
  state,
  tone,
  onUpdateState,
  onSelectExercise,
}) => {
  const [activeStep, setActiveStep] = useState<'assessment' | 'results'>(
    state.diagnostics?.latestRadar ? 'results' : 'assessment'
  );
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentItem = DIAGNOSTIC_ITEMS[currentIndex];
  const totalQuestions = DIAGNOSTIC_ITEMS.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectScore = (score: number) => {
    const updatedAnswers = { ...answers, [currentItem.id]: score };
    setAnswers(updatedAnswers);

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Calculate results and save
      const radar = calculateDiagnosticRadar(updatedAnswers);
      const newState = recordDiagnosticAssessment(radar, updatedAnswers);
      onUpdateState(newState);
      setActiveStep('results');
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentIndex(0);
    setActiveStep('assessment');
  };

  const currentRadar = state.diagnostics?.latestRadar;

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'Acute Cognitive Fusion':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'Moderate Entanglement':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Emerging Metacognitive Plasticity':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'High Observer Sovereignty':
        return 'text-[#E2B859] bg-[#E2B859]/10 border-[#E2B859]/30';
      default:
        return 'text-stone-300 bg-stone-800 border-white/10';
    }
  };

  return (
    <div className="relative min-h-screen bg-[#040507] text-stone-200 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.06),transparent_60%)]" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-mono tracking-widest uppercase rounded-full border border-white/10 bg-[#0B0D13] text-[#38BDF8] mb-3">
            <Brain className="w-3.5 h-3.5" />
            <span>Clinical Psychometrics & Cognitive Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-stone-100 font-light tracking-tight">
            Metacognitive Diagnostic Battery
          </h1>
          <p className="mt-3 text-stone-400 text-sm sm:text-base max-w-2xl mx-auto font-sans">
            {tone === 'grounded'
              ? 'Measures cognitive defusion (CFQ-7), interoceptive accuracy, predictive bias, and attentional stability to construct your 6-axis psychological profile.'
              : 'Maps the geometry of your consciousness: where your identity collapses into thought, and where the pristine witness remains sovereign.'}
          </p>
        </div>

        {/* ASSESSMENT STEP */}
        {activeStep === 'assessment' && (
          <div className="bg-[#0B0D13]/90 border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-lg">
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-6 text-xs font-mono text-stone-400">
              <span>
                QUESTION {currentIndex + 1} OF {totalQuestions}
              </span>
              <span className="text-[#38BDF8]">{progressPercent}% COMPLETED</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-8">
              <div
                className="bg-gradient-to-r from-[#38BDF8] to-[#E2B859] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Question Text */}
            <div className="min-h-[140px] flex flex-col justify-center">
              <span className="text-[11px] font-mono tracking-wider uppercase text-stone-500 mb-2">
                Domain: {currentItem.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-stone-100 leading-snug">
                "{currentItem.question}"
              </h2>
            </div>

            {/* 5-Point Likert Scale */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[
                { score: 1, label: 'Never / Strongly Disagree' },
                { score: 2, label: 'Rarely / Disagree' },
                { score: 3, label: 'Sometimes / Neutral' },
                { score: 4, label: 'Often / Agree' },
                { score: 5, label: 'Always / Strongly Agree' },
              ].map(({ score, label }) => (
                <button
                  key={score}
                  onClick={() => handleSelectScore(score)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/10 bg-[#12151F] hover:bg-[#1E2333] hover:border-[#38BDF8]/60 transition-all text-center group active:scale-[0.98]"
                >
                  <span className="text-lg font-mono font-semibold text-stone-200 group-hover:text-[#38BDF8] mb-1">
                    {score}
                  </span>
                  <span className="text-[11px] text-stone-400 group-hover:text-stone-300 leading-tight">
                    {label}
                  </span>
                </button>
              ))}
            </div>

            {/* Navigation back if past first question */}
            {currentIndex > 0 && (
              <div className="mt-6 flex justify-start">
                <button
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  className="text-xs font-mono text-stone-500 hover:text-stone-300 transition-colors"
                >
                  ← Previous Question
                </button>
              </div>
            )}
          </div>
        )}

        {/* RESULTS STEP: 6-AXIS RADAR & CLINICAL SUMMARY */}
        {activeStep === 'results' && currentRadar && (
          <div className="space-y-8">
            {/* Top Overview Card */}
            <div className="bg-[#0B0D13]/90 border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono tracking-widest uppercase text-stone-400">
                      ASSESSMENT PROFILE
                    </span>
                    <span className="text-xs text-stone-500">
                      • {new Date(currentRadar.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-stone-100 mt-1">
                    Metacognitive Sovereignty: {currentRadar.overallScore} / 100
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg border ${getBadgeColor(
                      currentRadar.clinicalLevel
                    )}`}
                  >
                    {currentRadar.clinicalLevel}
                  </span>
                  <button
                    onClick={handleRetake}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-stone-300 hover:text-[#E2B859] border border-white/10 hover:border-[#E2B859]/40 rounded-lg bg-[#12151F] transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake</span>
                  </button>
                </div>
              </div>

              {/* Spider Radar Chart & Narrative Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-8">
                {/* 6-Axis Radar Visualizer */}
                <div className="lg:col-span-6 flex justify-center py-4">
                  <RadarChart data={currentRadar} size={330} />
                </div>

                {/* Clinical Interpretation & Analysis */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-4 rounded-xl bg-[#12151F] border border-white/5">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-[#38BDF8] flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4" />
                      <span>Clinical Diagnostic Summary</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                      {currentRadar.clinicalSummary}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#12151F] border border-white/5">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-[#E2B859] flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Prescriptive Roadmap</span>
                    </h3>
                    <ul className="space-y-2 text-xs text-stone-300 font-sans">
                      {currentRadar.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#E2B859] shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Dimensional Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-[#0B0D13] border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                    Cognitive Defusion
                  </span>
                  <span className="text-sm font-mono font-semibold text-[#E2B859]">
                    {currentRadar.defusion}%
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  Ability to witness thoughts as transient electrical phenomena rather than literal commandments.
                </p>
                <button
                  onClick={() => onSelectExercise('1')}
                  className="mt-3 text-xs font-mono text-[#38BDF8] hover:text-[#E2B859] flex items-center gap-1 transition-colors"
                >
                  <span>Train with Exercise 1</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-5 rounded-xl bg-[#0B0D13] border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                    Interoceptive Somatic
                  </span>
                  <span className="text-sm font-mono font-semibold text-[#38BDF8]">
                    {currentRadar.interoception}%
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  Resolution and clarity in detecting visceral physiological contractions before cognitive narrative ignites.
                </p>
                <button
                  onClick={() => onSelectExercise('3')}
                  className="mt-3 text-xs font-mono text-[#38BDF8] hover:text-[#E2B859] flex items-center gap-1 transition-colors"
                >
                  <span>Train with Exercise 3</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-5 rounded-xl bg-[#0B0D13] border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                    Non-Reactivity
                  </span>
                  <span className="text-sm font-mono font-semibold text-emerald-400">
                    {currentRadar.nonReactivity}%
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  Width of the Libet temporal gap between unconscious motor readiness and conscious response.
                </p>
                <button
                  onClick={() => onSelectExercise('4')}
                  className="mt-3 text-xs font-mono text-[#38BDF8] hover:text-[#E2B859] flex items-center gap-1 transition-colors"
                >
                  <span>Train with Exercise 4</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-5 rounded-xl bg-[#0B0D13] border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                    Predictive Plasticity
                  </span>
                  <span className="text-sm font-mono font-semibold text-amber-400">
                    {currentRadar.predictiveFlexibility}%
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  Bayesian cognitive flexibility: treating cortical worst-case simulations as testable hypotheses.
                </p>
                <button
                  onClick={() => onSelectExercise('5')}
                  className="mt-3 text-xs font-mono text-[#38BDF8] hover:text-[#E2B859] flex items-center gap-1 transition-colors"
                >
                  <span>Train with Exercise 5</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-5 rounded-xl bg-[#0B0D13] border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                    Observer Self
                  </span>
                  <span className="text-sm font-mono font-semibold text-[#E2B859]">
                    {currentRadar.contextualSelf}%
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  Stability of Self-as-Context: knowing that consciousness is the screen, not the tragic movie projected on it.
                </p>
                <button
                  onClick={() => onSelectExercise('6')}
                  className="mt-3 text-xs font-mono text-[#38BDF8] hover:text-[#E2B859] flex items-center gap-1 transition-colors"
                >
                  <span>Train with Exercise 6</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-5 rounded-xl bg-[#0B0D13] border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                    Present Gating
                  </span>
                  <span className="text-sm font-mono font-semibold text-cyan-400">
                    {currentRadar.presentGating}%
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  Sensory attentional throughput: catching the exact moment consciousness drifts into temporal hallucination.
                </p>
                <button
                  onClick={() => onSelectExercise('7')}
                  className="mt-3 text-xs font-mono text-[#38BDF8] hover:text-[#E2B859] flex items-center gap-1 transition-colors"
                >
                  <span>Train with Exercise 7</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Assessment History list */}
            {state.diagnostics?.history?.length > 1 && (
              <div className="p-6 rounded-2xl bg-[#0B0D13] border border-white/10">
                <h3 className="text-sm font-mono uppercase tracking-widest text-stone-400 mb-4">
                  Assessment History Log ({state.diagnostics.history.length} Sessions)
                </h3>
                <div className="space-y-2">
                  {state.diagnostics.history.map((hist, idx) => (
                    <div
                      key={hist.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#12151F] border border-white/5 text-xs font-mono"
                    >
                      <span className="text-stone-400">
                        {new Date(hist.date).toLocaleDateString()} — {new Date(hist.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-stone-300">{hist.radar.clinicalLevel}</span>
                        <span className="text-[#E2B859] font-bold">{hist.radar.overallScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
