import React, { useState } from 'react';
import { soundscape } from '../services/soundscape';
import { UserSettings } from '../types';
import { Volume2, VolumeX, Radio, Waves, Sparkles, X } from 'lucide-react';

interface SoundscapeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const SoundscapeDrawer: React.FC<SoundscapeDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [selectedMode, setSelectedMode] = useState<
    'drone' | 'alpha' | 'theta' | 'solfeggio' | 'brown'
  >(settings.soundMode || 'drone');

  if (!isOpen) return null;

  const handleModeChange = (mode: 'drone' | 'alpha' | 'theta' | 'solfeggio' | 'brown') => {
    setSelectedMode(mode);
    soundscape.setMode(mode);
    onUpdateSettings({ soundMode: mode });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundscape.setVolume(val);
    onUpdateSettings({ volume: val });
  };

  const handleTogglePlay = () => {
    const isMuted = soundscape.toggle();
    onUpdateSettings({ muted: isMuted });
  };

  const MODES = [
    {
      id: 'drone' as const,
      name: 'Sub-Bass Void Drone',
      freq: '55 Hz & 110 Hz',
      desc: 'Grounding subterranean sine wave with slow 12s breathing LFO.',
    },
    {
      id: 'alpha' as const,
      name: 'Alpha Flow Entrainment',
      freq: '10 Hz Isochronic Beat',
      desc: 'Synchronizes cortical oscillations for relaxed metacognitive vigilance.',
    },
    {
      id: 'theta' as const,
      name: 'Theta Contemplative State',
      freq: '6 Hz Theta Wave',
      desc: 'Deep meditative threshold state; access to the silent observing self.',
    },
    {
      id: 'solfeggio' as const,
      name: 'Harmonic 432 Hz Solfeggio',
      freq: '432 Hz Resonant Drone',
      desc: 'Mathematical natural harmonic tuning; promotes parasympathetic restoration.',
    },
    {
      id: 'brown' as const,
      name: 'Deep Brown Noise',
      freq: 'Integrated Sub-Pink',
      desc: 'Soft continuous sonic blanket that muffles intruding thoughts and tinnitus.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0B0D13] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full border border-white/10 text-stone-400 hover:text-stone-100 hover:border-white/30 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-[#38BDF8] font-mono text-xs uppercase tracking-widest mb-1">
            <Waves className="w-4 h-4" />
            <span>Generative Soundscape Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-stone-100 font-light">
            Brainwave & Drone Frequencies
          </h2>
          <p className="text-xs text-stone-400 mt-1 font-sans">
            Real-time synthesized Web Audio with no pre-recorded audio loops or vocal intrusions.
          </p>
        </div>

        {/* Master Play / Mute & Volume */}
        <div className="p-4 rounded-xl bg-[#12151F] border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-stone-300">
              Soundscape Status: {!settings.muted ? 'Active' : 'Muted'}
            </span>
            <button
              onClick={handleTogglePlay}
              className={`px-3 py-1.5 text-xs font-mono uppercase rounded-lg border transition-all cursor-pointer ${
                !settings.muted
                  ? 'bg-[#38BDF8]/20 border-[#38BDF8]/60 text-[#38BDF8]'
                  : 'bg-[#0B0D13] border-white/10 text-stone-400 hover:text-stone-200'
              }`}
            >
              {!settings.muted ? 'Mute' : 'Start Audio'}
            </button>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-mono text-stone-400 mb-1">
              <span>Master Amplitude</span>
              <span>{Math.round((settings.volume ?? 0.5) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume ?? 0.5}
              onChange={handleVolumeChange}
              className="w-full accent-[#38BDF8]"
            />
          </div>
        </div>

        {/* Frequency Modes */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
            Select Entrainment Frequency
          </span>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {MODES.map((m) => {
              const isSelected = selectedMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleModeChange(m.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                    isSelected
                      ? 'bg-[#38BDF8]/10 border-[#38BDF8]/50 text-stone-100 shadow-[0_0_15px_rgba(56,189,248,0.15)]'
                      : 'bg-[#12151F] border-white/5 text-stone-400 hover:border-white/15'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-stone-200">
                        {m.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#38BDF8]">
                        {m.freq}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1 font-sans leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#38BDF8] shrink-0 mt-1 shadow-[0_0_8px_#38BDF8]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
