import React, { useEffect, useRef, useState } from 'react';
import { Tone } from '../types';
import { CHAPTERS, CITATIONS, pickTone } from '../services/content';
import { CanvasMode } from '../components/ParticleCanvas';
import { BookOpen, ArrowRight, FlaskConical, Sparkles, Sliders } from 'lucide-react';

interface EssayViewProps {
  tone: Tone;
  onSelectExercise: (exerciseId: string) => void;
  onOpenCitation: (id: string) => void;
  onModeChange: (mode: CanvasMode) => void;
  coherenceLevel: number;
  onCoherenceChange: (val: number) => void;
}

export const EssayView: React.FC<EssayViewProps> = ({
  tone,
  onSelectExercise,
  onOpenCitation,
  onModeChange,
  coherenceLevel,
  onCoherenceChange,
}) => {
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexStr = entry.target.getAttribute('data-chapter-index');
            if (indexStr !== null) {
              const idx = parseInt(indexStr, 10);
              setActiveChapterIndex(idx);
              const targetChapter = CHAPTERS[idx];
              if (targetChapter) {
                onModeChange(targetChapter.canvasMode);
              }
            }
          }
        });
      },
      { threshold: 0.45 }
    );

    chapterRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [onModeChange]);

  return (
    <div
      data-testid="essay-view-container"
      className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-24 space-y-36"
    >
      {/* Editorial Intro Banner */}
      <div className="text-center space-y-4 pb-12 border-b border-white/[0.08]">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E2B859]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>The Seven Chapters</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif text-stone-100 font-normal tracking-tight">
          Reality Starts Responding Differently
        </h1>
        <p className="text-sm sm:text-base font-serif italic text-stone-400 max-w-xl mx-auto">
          {tone === 'grounded'
            ? 'A neurological and metacognitive exploration of the space between thought and awareness.'
            : 'A journey into the silence that holds the world, and what happens when the observer awakens.'}
        </p>
      </div>

      {/* Chapters 1 to 7 */}
      {CHAPTERS.map((chapter, idx) => (
        <article
          key={chapter.id}
          ref={(el) => {
            chapterRefs.current[idx] = el;
          }}
          data-chapter-index={idx}
          data-testid={`chapter-section-${chapter.number}`}
          className="space-y-8 scroll-mt-28"
        >
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-stone-500">
              <span className="text-[#E2B859] font-semibold">{chapter.number}</span>
              <span>/</span>
              <span>{pickTone(chapter.kicker, tone)}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-100 leading-tight">
              {pickTone(chapter.title, tone)}
            </h2>

            <p className="text-base sm:text-lg font-serif italic text-[#E2B859]/90">
              {pickTone(chapter.subtitle, tone)}
            </p>
          </div>

          {/* Paragraphs with Drop Cap on first line */}
          <div className="space-y-6 text-stone-300 text-base sm:text-lg leading-relaxed font-sans font-light">
            {pickTone(chapter.paragraphs, tone).map((p, pIdx) => (
              <p
                key={pIdx}
                className={
                  pIdx === 0
                    ? 'first-letter:text-5xl first-letter:font-serif first-letter:font-normal first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#E2B859]'
                    : ''
                }
              >
                {p}
              </p>
            ))}
          </div>

          {/* Interactive Coherence Slider for Chapter 3 */}
          {chapter.id === 'chapter-3' && (
            <div
              data-testid="interactive-coherence-slider-box"
              className="p-5 sm:p-6 rounded-xl bg-[#0B0D13] border border-[#38BDF8]/20 space-y-4 my-8"
            >
              <div className="flex items-center justify-between text-xs font-mono text-stone-300">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-[#38BDF8]">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Resonance Calibration</span>
                </span>
                <span className="tabular-nums font-mono text-[#38BDF8]">
                  {Math.round(coherenceLevel * 100)}% Coherence
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={coherenceLevel}
                onChange={(e) => onCoherenceChange(parseFloat(e.target.value))}
                data-testid="coherence-range-slider"
                className="w-full accent-[#38BDF8] bg-stone-800 h-1.5 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] font-mono text-stone-500">
                <span>Sympathetic Turbulence</span>
                <span>Vagal Synchrony</span>
              </div>
            </div>
          )}

          {/* Citations & Evidence Layer */}
          {chapter.citations.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-stone-500 uppercase mr-1">
                Lenses & Evidence:
              </span>
              {chapter.citations.map((cId) => {
                const cit = CITATIONS[cId];
                if (!cit) return null;
                const isSci = cit.type === 'science';
                return (
                  <button
                    key={cId}
                    onClick={() => onOpenCitation(cId)}
                    data-testid={`citation-chip-${cId}`}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all border ${
                      isSci
                        ? 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/30 hover:border-[#38BDF8]/70'
                        : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30 hover:border-[#F59E0B]/70'
                    }`}
                  >
                    {isSci ? <FlaskConical className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                    <span>{cit.authorOrSource.split(',')[0]}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Chapter CTA jump to Practice */}
          <div className="pt-6 border-t border-white/[0.08]">
            <button
              onClick={() => onSelectExercise(chapter.exerciseId)}
              data-testid={`cta-practice-exercise-${chapter.exerciseId}`}
              className="inline-flex items-center gap-2 text-sm font-sans font-medium text-[#E2B859] hover:text-[#d6aa46] hover:translate-x-1 transition-all group"
            >
              <span>{pickTone(chapter.exercisePrompt, tone)}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </article>
      ))}

      {/* Closing Void */}
      <section
        data-testid="essay-closing-void"
        className="text-center py-28 sm:py-36 space-y-6 border-t border-white/[0.08]"
      >
        <div className="w-2 h-2 rounded-full bg-[#E2B859] mx-auto animate-ping" />
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-light text-stone-100 tracking-tight animate-breathe">
          "You are not your thoughts.
          <br />
          You never were."
        </h2>
        <p className="text-sm font-mono uppercase tracking-widest text-stone-500 pt-4">
          The Observer · End of Reading
        </p>

        <div className="pt-6">
          <button
            onClick={() => onSelectExercise('1')}
            data-testid="cta-begin-30-day"
            className="px-7 py-3.5 rounded-full bg-[#E2B859] text-[#040507] font-semibold text-sm shadow-[0_0_25px_rgba(226,184,89,0.3)] hover:scale-105 transition-transform"
          >
            Begin The 30-Day Practice System
          </button>
        </div>
      </section>
    </div>
  );
};
