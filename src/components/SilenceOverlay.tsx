import React from 'react';

interface SilenceOverlayProps {
  onExit: () => void;
}

export const SilenceOverlay: React.FC<SilenceOverlayProps> = ({ onExit }) => {
  return (
    <div
      data-testid="silence-overlay"
      className="fixed inset-0 z-50 bg-[#040507] flex flex-col items-center justify-center p-6 select-none cursor-pointer"
      onClick={onExit}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Pulsing golden point */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#E2B859]/10 animate-ping absolute" />
          <div className="w-4 h-4 rounded-full bg-[#E2B859] shadow-[0_0_20px_rgba(226,184,89,0.9)]" />
        </div>

        <div className="text-center space-y-3">
          <p className="font-serif italic text-xl sm:text-2xl text-stone-300 tracking-wide">
            Nothing to fix. Nothing to become.
          </p>
          <p className="text-xs font-mono tracking-widest text-stone-600 uppercase">
            Click anywhere to return
          </p>
        </div>
      </div>
    </div>
  );
};
