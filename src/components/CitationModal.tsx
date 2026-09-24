import React from 'react';
import { CITATIONS, pickTone } from '../services/content';
import { Tone } from '../types';
import { X, FlaskConical, Sparkles, BookOpen } from 'lucide-react';

interface CitationModalProps {
  citationId: string | null;
  onClose: () => void;
  tone: Tone;
}

export const CitationModal: React.FC<CitationModalProps> = ({ citationId, onClose, tone }) => {
  if (!citationId) return null;
  const citation = CITATIONS[citationId];
  if (!citation) return null;

  const isScience = citation.type === 'science';

  return (
    <div
      data-testid="citation-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        data-testid="citation-modal-content"
        className="max-w-lg w-full bg-[#0B0D13] border border-white/15 rounded-xl p-6 sm:p-7 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          data-testid="citation-modal-close"
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-100 hover:bg-white/5 rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge Header */}
        <div className="flex items-center gap-2 mb-3">
          {isScience ? (
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#38BDF8]">
              <FlaskConical className="w-4 h-4" />
              <span>Peer-Reviewed Empirical Science</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#F59E0B]">
              <Sparkles className="w-4 h-4" />
              <span>Contemplative Model / Metaphor</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif font-medium text-stone-100 leading-snug mb-2">
          {citation.title}
        </h3>

        {/* Author / Source */}
        <div className="text-xs font-mono text-stone-400 mb-5 flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-stone-500" />
          <span>{citation.authorOrSource}</span>
          {citation.year && (
            <>
              <span className="text-stone-600">·</span>
              <span>{citation.year}</span>
            </>
          )}
        </div>

        {/* Summary */}
        <div className="p-4 rounded-lg bg-[#040507] border border-white/[0.06] text-stone-300 text-sm leading-relaxed mb-5">
          <p>{pickTone(citation.summary, tone)}</p>
        </div>

        {/* Core Takeaway */}
        <div className="border-t border-white/[0.08] pt-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block mb-1">
            Psychological Insight
          </span>
          <p className="text-stone-200 text-sm font-medium">
            {citation.keyTakeaway}
          </p>
        </div>
      </div>
    </div>
  );
};
