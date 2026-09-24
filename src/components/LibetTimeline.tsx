import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, HelpCircle, Activity } from 'lucide-react';
import { Tone } from '../types';

interface LibetTimelineProps {
  tone: Tone;
  onOpenCitation?: (citationId: string) => void;
}

export const LibetTimeline: React.FC<LibetTimelineProps> = ({ tone, onOpenCitation }) => {
  const [currentMs, setCurrentMs] = useState<number>(-600);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    let lastTime = performance.now();
    const loop = (now: number) => {
      if (isPlaying) {
        const delta = now - lastTime;
        setCurrentMs((prev) => {
          const next = prev + delta * 0.45;
          if (next >= 100) {
            return -600;
          }
          return next;
        });
      }
      lastTime = now;
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying]);

  // Derived state based on millisecond point
  const isReadinessActive = currentMs >= -550;
  const isConsciousActive = currentMs >= -200;
  const isVetoActive = currentMs >= -150 && currentMs <= 0;
  const isActionActive = currentMs >= 0;

  // Percentage for progress bar (-600 to 100 = 700ms total span)
  const percent = Math.min(100, Math.max(0, ((currentMs - -600) / 700) * 100));

  return (
    <div
      data-testid="libet-timeline-container"
      className="w-full max-w-3xl mx-auto my-10 p-5 sm:p-7 rounded-xl bg-[#0B0D13] border border-white/10 shadow-2xl relative"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-mono uppercase tracking-widest text-stone-300">
            {tone === 'grounded'
              ? 'The 350-500ms Readiness Potential Delay'
              : 'The Echo Before the Voice'}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => onOpenCitation?.('libet')}
            data-testid="libet-citation-trigger"
            className="flex items-center gap-1 text-[#38BDF8] hover:underline"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Libet (1983)</span>
          </button>
          <span className="text-stone-600">·</span>
          <span className="tabular-nums text-stone-300 w-16 text-right">
            {Math.round(currentMs)} ms
          </span>
        </div>
      </div>

      {/* Progress Track & Key Markers */}
      <div className="relative py-7">
        {/* Base Timeline Line */}
        <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-stone-600 via-[#38BDF8] to-[#E2B859] transition-all duration-75"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Marker 1: -550ms Unconscious Readiness Potential */}
        <div
          className="absolute top-2 -translate-x-1/2 flex flex-col items-center"
          style={{ left: `${((-550 - -600) / 700) * 100}%` }}
        >
          <div
            className={`w-3 h-3 rounded-full border-2 transition-colors ${
              isReadinessActive
                ? 'bg-[#38BDF8] border-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.7)]'
                : 'bg-stone-900 border-stone-600'
            }`}
          />
          <span className="mt-2 text-[10px] sm:text-xs font-mono text-stone-400 text-center whitespace-nowrap">
            -550ms
          </span>
          <span className="text-[10px] text-stone-500 text-center hidden sm:inline">
            Neural RP Onset
          </span>
        </div>

        {/* Marker 2: -200ms Conscious Awareness (W-time) */}
        <div
          className="absolute top-2 -translate-x-1/2 flex flex-col items-center"
          style={{ left: `${((-200 - -600) / 700) * 100}%` }}
        >
          <div
            className={`w-3.5 h-3.5 rounded-full border-2 transition-colors ${
              isConsciousActive
                ? 'bg-[#E2B859] border-[#E2B859] shadow-[0_0_15px_rgba(226,184,89,0.8)]'
                : 'bg-stone-900 border-stone-600'
            }`}
          />
          <span className="mt-2 text-[10px] sm:text-xs font-mono text-[#E2B859] text-center font-medium whitespace-nowrap">
            -200ms
          </span>
          <span className="text-[10px] text-stone-300 text-center hidden sm:inline">
            Conscious Intent (W)
          </span>
        </div>

        {/* Marker 3: 0ms Motor Action / Spoken Thought */}
        <div
          className="absolute top-2 -translate-x-1/2 flex flex-col items-center"
          style={{ left: `${((0 - -600) / 700) * 100}%` }}
        >
          <div
            className={`w-3 h-3 rounded-full border-2 transition-colors ${
              isActionActive
                ? 'bg-stone-200 border-white shadow-[0_0_12px_rgba(255,255,255,0.7)]'
                : 'bg-stone-900 border-stone-600'
            }`}
          />
          <span className="mt-2 text-[10px] sm:text-xs font-mono text-stone-400 text-center whitespace-nowrap">
            0ms
          </span>
          <span className="text-[10px] text-stone-500 text-center hidden sm:inline">
            Action / Word
          </span>
        </div>
      </div>

      {/* Dynamic Status Box */}
      <div className="mt-7 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
          {currentMs < -550 && (
            <span className="text-stone-500">
              Cerebral baseline. Neural networks are silent prior to volitional initiation...
            </span>
          )}
          {currentMs >= -550 && currentMs < -200 && (
            <span className="text-[#38BDF8]">
              <strong>Unconscious Ignition:</strong> Supplementary motor area and prefrontal cortex
              ignite. Electrical Bereitschaftspotential rises. You feel nothing yet.
            </span>
          )}
          {currentMs >= -200 && currentMs < 0 && (
            <span className="text-[#E2B859]">
              <strong>Conscious Awareness (W-time):</strong> Awareness finally registers: "I intend
              to act / I am thinking this." You believe you started it now, but the brain was
              working 350ms prior.
            </span>
          )}
          {currentMs >= 0 && (
            <span className="text-stone-100">
              <strong>Execution:</strong> The physical tongue moves, fingers tap, or thought
              completes its overt expression.
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            data-testid="libet-play-pause-button"
            className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-white/10 transition-colors"
            title={isPlaying ? 'Pause Timeline' : 'Play Timeline'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              setCurrentMs(-600);
              setIsPlaying(true);
            }}
            data-testid="libet-reset-button"
            className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-white/10 transition-colors"
            title="Replay from -600ms"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
