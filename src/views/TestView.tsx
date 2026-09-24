import React, { useState, useEffect, useRef } from 'react';
import { Tone } from '../types';
import { recordTest } from '../services/storage';
import { soundscape } from '../services/soundscape';
import { Timer, Sparkles, Download, Share2, RotateCcw, Check, ArrowRight } from 'lucide-react';

interface TestViewProps {
  tone: Tone;
  onFinish?: () => void;
  onNavigateToHub: () => void;
}

type Phase = 'intro' | 'running' | 'done';

export const TestView: React.FC<TestViewProps> = ({ tone, onNavigateToHub }) => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [thoughtCount, setThoughtCount] = useState<number>(0);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rippleAnimRef = useRef<number | null>(null);
  const ripplesRef = useRef<Array<{ x: number; y: number; r: number; alpha: number }>>([]);

  // Spacebar and Click listener during running phase
  useEffect(() => {
    if (phase !== 'running') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        registerThought();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  // 60-second countdown
  useEffect(() => {
    if (phase !== 'running') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, thoughtCount]);

  // Interactive Ripple Canvas during test
  useEffect(() => {
    if (phase !== 'running') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // Render ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const rip = ripplesRef.current[i];
        rip.r += 3.5;
        rip.alpha *= 0.96;

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(226, 184, 89, ${rip.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (rip.alpha < 0.01) {
          ripplesRef.current.splice(i, 1);
        }
      }

      rippleAnimRef.current = requestAnimationFrame(loop);
    };

    rippleAnimRef.current = requestAnimationFrame(loop);

    return () => {
      if (rippleAnimRef.current) cancelAnimationFrame(rippleAnimRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [phase]);

  const addRipple = (x: number, y: number) => {
    ripplesRef.current.push({ x, y, r: 10, alpha: 0.8 });
  };

  const startTest = () => {
    setThoughtCount(0);
    setTimeLeft(60);
    setPhase('running');
    soundscape.playAwarenessChime(528);
  };

  const registerThought = (clientX?: number, clientY?: number) => {
    setThoughtCount((prev) => prev + 1);
    soundscape.playAwarenessChime(432 + Math.random() * 80);

    const x = clientX ?? window.innerWidth / 2;
    const y = clientY ?? window.innerHeight / 2;
    addRipple(x, y);
  };

  const finishTest = () => {
    setPhase('done');
    const { isNewBest: newBestRecord } = recordTest(thoughtCount, 60);
    setIsNewBest(newBestRecord);
    soundscape.playAwarenessChime(660);
  };

  const resetTest = () => {
    setPhase('intro');
    setTimeLeft(60);
    setThoughtCount(0);
  };

  // Generate Downloadable PNG Result Card
  const downloadResultCard = () => {
    setDownloading(true);
    try {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = 1200;
      offCanvas.height = 1200;
      const ctx = offCanvas.getContext('2d');
      if (!ctx) return;

      // Dark void background
      ctx.fillStyle = '#040507';
      ctx.fillRect(0, 0, 1200, 1200);

      // Gold subtle radial glow
      const grad = ctx.createRadialGradient(600, 500, 50, 600, 500, 650);
      grad.addColorStop(0, 'rgba(226, 184, 89, 0.12)');
      grad.addColorStop(1, 'rgba(4, 5, 7, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 1200);

      // Subtle border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 60, 1080, 1080);

      // Brand mark
      ctx.font = '36px "Cormorant Garamond", serif';
      ctx.fillStyle = '#9CA3AF';
      ctx.textAlign = 'center';
      ctx.fillText('THE OBSERVER', 600, 180);

      // Subtitle
      ctx.font = '16px "JetBrains Mono", monospace';
      ctx.fillStyle = '#E2B859';
      ctx.letterSpacing = '4px';
      ctx.fillText('60-SECOND COGNITIVE AWARENESS TEST', 600, 230);

      // Large Count
      ctx.font = '180px "Cormorant Garamond", serif';
      ctx.fillStyle = '#F3F4F6';
      ctx.fillText(thoughtCount.toString(), 600, 480);

      // Label
      ctx.font = '24px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#9CA3AF';
      ctx.fillText('thoughts caught in 60 seconds', 600, 550);

      // Metacognitive latency note
      const latencyEstimate = Math.round((60 / Math.max(1, thoughtCount)) * 10) / 10;
      ctx.font = '18px "JetBrains Mono", monospace';
      ctx.fillStyle = '#38BDF8';
      ctx.fillText(`Average Metacognitive Interval: ~${latencyEstimate}s between catches`, 600, 620);

      // Divider line
      ctx.beginPath();
      ctx.moveTo(400, 700);
      ctx.lineTo(800, 700);
      ctx.strokeStyle = 'rgba(226, 184, 89, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Philosophical quote
      ctx.font = 'italic 34px "Cormorant Garamond", serif';
      ctx.fillStyle = '#E5E7EB';
      ctx.fillText('"You are not your thoughts.', 600, 780);
      ctx.fillText('You never were."', 600, 830);

      // Footer
      ctx.font = '16px "JetBrains Mono", monospace';
      ctx.fillStyle = '#6B7280';
      ctx.fillText(new Date().toLocaleDateString('en-US', { dateStyle: 'long' }), 600, 1000);

      // Trigger download
      const link = document.createElement('a');
      link.download = `The-Observer-60s-Test-${thoughtCount}-thoughts.png`;
      link.href = offCanvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Failed to generate result card:', e);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const text = `I caught ${thoughtCount} thoughts in 60 seconds on The Observer. "You are not your thoughts. You never were."`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'The Observer — 60-Second Test',
          text,
          url: window.location.origin,
        });
        return;
      } catch {}
    }
    // Fallback to clipboard
    navigator.clipboard.writeText(`${text}\n${window.location.origin}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Psychological velocity categorization
  const getVelocityInsight = () => {
    if (thoughtCount <= 8) {
      return {
        title: 'Deep Stillness (Metacognitive Horizon)',
        desc: 'Remarkably quiet cerebral chatter. Your attention rests as the open container rather than latching onto nascent electrical impulses.',
      };
    } else if (thoughtCount <= 18) {
      return {
        title: 'Measured Flow',
        desc: 'Healthy, lucid metacognitive monitoring. You register incoming cognitive proposals without immediate affective entanglement.',
      };
    } else if (thoughtCount <= 30) {
      return {
        title: 'Active Stream',
        desc: 'The cortex is actively generating associative predictions. Notice how quickly awareness wanted to dive into each story.',
      };
    } else {
      return {
        title: 'Turbulent Surge',
        desc: 'High cortical velocity. The Default Mode Network was firing rapid rumination loops. Catching them is the first step toward sovereignty.',
      };
    }
  };

  return (
    <div
      data-testid="test-container"
      className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-4 sm:p-6 relative select-none"
    >
      {/* PHASE 1: INTRO */}
      {phase === 'intro' && (
        <div
          data-testid="test-intro-phase"
          className="max-w-xl w-full text-center space-y-8 bg-[#0B0D13]/80 p-7 sm:p-10 rounded-2xl border border-white/10 shadow-2xl relative z-10 animate-in fade-in duration-300"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E2B859]/10 border border-[#E2B859]/30 text-xs font-mono uppercase tracking-widest text-[#E2B859]">
            <Timer className="w-3.5 h-3.5" />
            <span>Flagship Protocol</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-100">
              The 60-Second Test
            </h2>
            <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
              {tone === 'grounded'
                ? 'For the next one minute, do nothing except watch the inner stream. Every time a distinct thought, voice, memory, or urge captures your attention—tap anywhere or press the spacebar.'
                : 'For one minute, rest as the silent witness in the void. Each time a visitor whispers in the silence, tap the water or press space to acknowledge its arrival.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#040507] border border-white/[0.06] text-xs font-mono text-stone-400 space-y-1 text-left">
            <div className="flex items-center gap-2 text-[#38BDF8]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instructions:</span>
            </div>
            <p>· Click/Tap anywhere on screen OR tap Spacebar</p>
            <p>· Do not judge or force thoughts; simply observe</p>
            <p>· Lower counts reflect greater stillness; higher counts reveal cortical velocity</p>
          </div>

          <button
            onClick={startTest}
            data-testid="start-test-button"
            className="w-full py-4 rounded-xl bg-[#E2B859] hover:bg-[#d6aa46] text-[#040507] font-semibold text-base tracking-wide shadow-[0_0_30px_rgba(226,184,89,0.3)] hover:scale-[1.02] active:scale-[0.99] transition-all"
          >
            Begin The 60 Seconds
          </button>
        </div>
      )}

      {/* PHASE 2: RUNNING */}
      {phase === 'running' && (
        <div
          data-testid="test-running-phase"
          onClick={(e) => registerThought(e.clientX, e.clientY)}
          className="fixed inset-0 z-40 bg-[#040507] flex flex-col items-center justify-between py-12 px-6 cursor-crosshair overflow-hidden"
        >
          {/* Reactive Ripple Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0"
            aria-hidden="true"
          />

          {/* Top Timer Indicator */}
          <div className="relative z-10 flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#0B0D13]/80 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#E2B859] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
              Time Remaining
            </span>
            <span
              data-testid="test-timer-display"
              className="text-base font-mono font-medium text-stone-100 tabular-nums"
            >
              {timeLeft}s
            </span>
          </div>

          {/* Central Live Counter */}
          <div className="relative z-10 text-center space-y-4 pointer-events-none">
            <div
              data-testid="test-count-display"
              className="text-7xl sm:text-9xl font-serif font-light text-stone-100 tabular-nums tracking-tight drop-shadow-[0_0_35px_rgba(226,184,89,0.25)]"
            >
              {thoughtCount}
            </div>
            <p className="text-sm sm:text-base font-serif italic text-stone-400 tracking-wide">
              {thoughtCount === 1 ? 'thought observed' : 'thoughts observed'}
            </p>
          </div>

          {/* Bottom Hint */}
          <div className="relative z-10 text-center text-xs font-mono tracking-widest uppercase text-stone-500 pointer-events-none">
            Tap screen or press Spacebar as thoughts arrive
          </div>
        </div>
      )}

      {/* PHASE 3: DONE */}
      {phase === 'done' && (
        <div
          data-testid="test-done-phase"
          className="max-w-xl w-full bg-[#0B0D13] border border-white/10 p-7 sm:p-9 rounded-2xl shadow-2xl relative z-10 space-y-7 animate-in fade-in duration-300"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E2B859]">
              Session Completed
            </span>
            <h2 className="text-3xl font-serif text-stone-100">The Reflection</h2>
          </div>

          {/* Stat Card */}
          <div className="p-6 rounded-xl bg-[#040507] border border-white/[0.08] text-center space-y-3">
            <div className="text-6xl font-serif font-light text-[#E2B859] tabular-nums">
              {thoughtCount}
            </div>
            <p className="text-xs font-mono uppercase tracking-widest text-stone-400">
              Thoughts Caught in 60 Seconds
            </p>
            {isNewBest && (
              <span className="inline-block px-3 py-1 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-xs font-mono text-[#38BDF8]">
                New Baseline Recorded
              </span>
            )}
          </div>

          {/* Velocity Insight */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5 text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-[#38BDF8]">
              {getVelocityInsight().title}
            </span>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
              {getVelocityInsight().desc}
            </p>
          </div>

          {/* Philosophical takeaway */}
          <p className="text-center font-serif italic text-lg sm:text-xl text-stone-200">
            "You are not your thoughts. You never were."
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={downloadResultCard}
              disabled={downloading}
              data-testid="download-card-button"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#E2B859] hover:bg-[#d6aa46] text-[#040507] font-sans font-semibold text-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Rendering...' : 'Download Card'}</span>
            </button>

            <button
              onClick={handleShare}
              data-testid="share-result-button"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-white/10 font-sans font-medium text-sm transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Share Result'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/[0.07] text-xs font-mono">
            <button
              onClick={resetTest}
              data-testid="retake-test-button"
              className="flex items-center gap-1.5 text-stone-400 hover:text-stone-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Test</span>
            </button>

            <button
              onClick={onNavigateToHub}
              data-testid="goto-hub-from-test"
              className="flex items-center gap-1.5 text-[#E2B859] hover:underline"
            >
              <span>Practice Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
