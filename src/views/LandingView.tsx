import React from 'react';
import { Tone } from '../types';
import { HOOK_CONTENT, pickTone } from '../services/content';
import { LibetTimeline } from '../components/LibetTimeline';
import { ArrowRight, Timer, BookOpen, Compass, ShieldCheck, Zap } from 'lucide-react';

interface LandingViewProps {
  tone: Tone;
  onNavigate: (view: 'landing' | 'test' | 'essay' | 'practice') => void;
  onOpenCitation: (id: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  tone,
  onNavigate,
  onOpenCitation,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col justify-between pt-16 sm:pt-24 pb-20 px-4 sm:px-6">
      {/* Central Void Hero */}
      <div className="max-w-4xl mx-auto text-center space-y-10 sm:space-y-12">
        {/* Cold Open - 3 Staggered Lines */}
        <div className="space-y-4 sm:space-y-5">
          <p
            data-testid="hook-line-1"
            className="text-stone-400 font-serif italic text-xl sm:text-2xl md:text-3xl tracking-wide transition-opacity duration-1000"
          >
            "{pickTone(HOOK_CONTENT.line1, tone)}"
          </p>
          <p
            data-testid="hook-line-2"
            className="text-stone-300 font-serif italic text-2xl sm:text-3xl md:text-4xl tracking-wide"
          >
            "{pickTone(HOOK_CONTENT.line2, tone)}"
          </p>
          <h1
            data-testid="hook-line-3"
            className="text-stone-100 font-serif font-light text-3xl sm:text-5xl md:text-6xl tracking-tight text-balance leading-tight"
          >
            {pickTone(HOOK_CONTENT.line3, tone)}
          </h1>
        </div>

        {/* Subline explanation */}
        <div className="max-w-2xl mx-auto">
          <p
            data-testid="hook-delay-fact"
            className="text-stone-400 font-sans text-sm sm:text-base leading-relaxed"
          >
            {pickTone(HOOK_CONTENT.delayFact, tone)}
          </p>
        </div>

        {/* Primary CTAs */}
        <div
          data-testid="landing-ctas"
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <button
            onClick={() => onNavigate('test')}
            data-testid="cta-take-test"
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#E2B859] hover:bg-[#d6aa46] text-[#040507] font-sans font-semibold text-sm tracking-wide shadow-[0_0_25px_rgba(226,184,89,0.35)] hover:scale-[1.03] transition-all"
          >
            <Timer className="w-4 h-4" />
            <span>Take the 60-Second Test</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('essay')}
            data-testid="cta-enter-essay"
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#0B0D13] hover:bg-stone-900 text-stone-200 border border-white/15 font-sans font-medium text-sm tracking-wide hover:border-[#E2B859]/50 hover:scale-[1.03] transition-all"
          >
            <BookOpen className="w-4 h-4 text-[#E2B859]" />
            <span>Enter the Essay</span>
          </button>

          <button
            onClick={() => onNavigate('practice')}
            data-testid="cta-practice-hub"
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#0B0D13] hover:bg-stone-900 text-stone-300 border border-white/10 font-sans font-medium text-sm tracking-wide hover:border-[#38BDF8]/40 hover:scale-[1.03] transition-all"
          >
            <Compass className="w-4 h-4 text-[#38BDF8]" />
            <span>Practice Hub</span>
          </button>
        </div>

        {/* Interactive Libet Timeline Section */}
        <div className="pt-6 sm:pt-10">
          <LibetTimeline tone={tone} onOpenCitation={onOpenCitation} />
        </div>

        {/* 3 Pillars Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-10 text-left">
          <div className="p-5 rounded-xl bg-[#0B0D13]/70 border border-white/[0.07] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#38BDF8]">
              <Zap className="w-3.5 h-3.5" />
              <span>01. Metacognitive Defusion</span>
            </div>
            <h3 className="font-serif text-lg text-stone-200">Watch, Do Not Grab</h3>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Thoughts possess zero inherent gravitational weight. Learn to witness electrical
              impulses without collapsing awareness into personal identity.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0B0D13]/70 border border-white/[0.07] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E2B859]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>02. Predictive Processing</span>
            </div>
            <h3 className="font-serif text-lg text-stone-200">The Bayesian Brain</h3>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Your cortex projects past emotional scars onto fresh reality. Suspend automated
              top-down prediction to allow genuine encounters.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0B0D13]/70 border border-white/[0.07] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F59E0B]">
              <Compass className="w-3.5 h-3.5" />
              <span>03. The Unshakable Space</span>
            </div>
            <h3 className="font-serif text-lg text-stone-200">Self-As-Context</h3>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              You are not the weather battered by the storm; you are the vast, infinite sky that
              contains every thunderclap without injury.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
