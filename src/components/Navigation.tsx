import React from 'react';
import { Tone, UserSettings } from '../types';
import {
  Volume2,
  VolumeX,
  Eye,
  BookOpen,
  Moon,
  ShieldAlert,
  Terminal,
  Activity,
  Cpu,
  Radio,
} from 'lucide-react';
import { soundscape } from '../services/soundscape';

interface NavigationProps {
  currentView: 'landing' | 'test' | 'essay' | 'practice' | 'exercise' | 'diagnostics' | 'laboratory';
  onNavigate: (view: 'landing' | 'test' | 'essay' | 'practice' | 'diagnostics' | 'laboratory') => void;
  tone: Tone;
  onToggleTone: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onOpenSOS: () => void;
  onOpenStack: () => void;
  onOpenSoundscape: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigate,
  tone,
  onToggleTone,
  settings,
  onUpdateSettings,
  onOpenSOS,
  onOpenStack,
  onOpenSoundscape,
}) => {
  const handleReadingToggle = () => {
    onUpdateSettings({ readingMode: !settings.readingMode });
  };

  const handleSilenceToggle = () => {
    onUpdateSettings({ silenceMode: true });
  };

  return (
    <header
      data-testid="top-navigation"
      className="sticky top-0 z-50 w-full bg-[#040507]/90 backdrop-blur-md border-b border-white/[0.07] px-3 sm:px-6 py-3 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Wordmark */}
        <button
          onClick={() => onNavigate('landing')}
          data-testid="nav-brand-button"
          className="text-lg sm:text-2xl font-serif tracking-tight text-stone-100 hover:text-[#E2B859] transition-colors text-left shrink-0 cursor-pointer"
        >
          The Observer
        </button>

        {/* Clean Text Navigation Links */}
        <nav
          data-testid="nav-links"
          className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-sans tracking-wide text-stone-400"
        >
          <button
            onClick={() => onNavigate('landing')}
            data-testid="nav-link-hook"
            className={`transition-colors hover:text-stone-200 cursor-pointer ${
              currentView === 'landing' ? 'text-[#E2B859] font-medium' : ''
            }`}
          >
            The Hook
          </button>
          <button
            onClick={() => onNavigate('test')}
            data-testid="nav-link-test"
            className={`transition-colors hover:text-stone-200 cursor-pointer ${
              currentView === 'test' ? 'text-[#E2B859] font-medium' : ''
            }`}
          >
            60s Test
          </button>
          <button
            onClick={() => onNavigate('essay')}
            data-testid="nav-link-essay"
            className={`transition-colors hover:text-stone-200 cursor-pointer ${
              currentView === 'essay' ? 'text-[#E2B859] font-medium' : ''
            }`}
          >
            The Essay
          </button>
          <button
            onClick={() => onNavigate('practice')}
            data-testid="nav-link-practice"
            className={`transition-colors hover:text-stone-200 cursor-pointer ${
              currentView === 'practice' || currentView === 'exercise'
                ? 'text-[#E2B859] font-medium'
                : ''
            }`}
          >
            Practice Hub
          </button>
          <button
            onClick={() => onNavigate('diagnostics')}
            data-testid="nav-link-diagnostics"
            className={`flex items-center gap-1.5 transition-colors hover:text-stone-200 cursor-pointer ${
              currentView === 'diagnostics' ? 'text-[#38BDF8] font-medium' : ''
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Diagnostics</span>
          </button>
          <button
            onClick={() => onNavigate('laboratory')}
            data-testid="nav-link-laboratory"
            className={`flex items-center gap-1.5 transition-colors hover:text-stone-200 cursor-pointer ${
              currentView === 'laboratory' ? 'text-amber-400 font-medium' : ''
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Thought Lab</span>
          </button>
        </nav>

        {/* Functional Actions */}
        <div data-testid="nav-actions" className="flex items-center gap-1.5 sm:gap-2">
          {/* Neuro-Somatic Emergency SOS button */}
          <button
            onClick={onOpenSOS}
            data-testid="sos-button"
            title="Emergency Neuro-Somatic Reset (Physiological Sigh & Grounding)"
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:border-rose-500 transition-all cursor-pointer shadow-[0_0_12px_rgba(244,63,94,0.15)]"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SOS Reset</span>
          </button>

          {/* Stack Blueprint (Cloudflare, Figma, Supabase) */}
          <button
            onClick={onOpenStack}
            data-testid="stack-button"
            title="Production Stack & Integrations (Cloudflare, Figma, Supabase)"
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg border border-white/10 bg-[#0B0D13] text-stone-300 hover:text-stone-100 hover:border-white/30 transition-all cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="hidden md:inline">Stack</span>
          </button>

          {/* Tone Toggle */}
          <button
            onClick={onToggleTone}
            data-testid="tone-toggle-button"
            title={`Current Tone: ${tone}. Click to toggle.`}
            className="hidden sm:flex items-center gap-1 px-2 py-1.5 text-xs font-mono tracking-wider uppercase rounded-md border border-white/10 hover:border-[#E2B859]/50 bg-[#0B0D13] text-stone-300 hover:text-[#E2B859] transition-all whitespace-nowrap cursor-pointer"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                tone === 'grounded' ? 'bg-[#38BDF8]' : 'bg-[#E2B859]'
              }`}
            />
            <span>{tone}</span>
          </button>

          {/* Soundscape & Frequencies */}
          <button
            onClick={onOpenSoundscape}
            data-testid="soundscape-toggle"
            title="Soundscape & Brainwave Frequencies"
            className={`p-2 rounded-md border transition-colors cursor-pointer ${
              !settings.muted
                ? 'bg-[#38BDF8]/15 border-[#38BDF8]/60 text-[#38BDF8]'
                : 'bg-[#0B0D13] border-white/10 text-stone-400 hover:text-stone-200'
            }`}
          >
            {!settings.muted ? <Radio className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reading Mode */}
          <button
            onClick={handleReadingToggle}
            data-testid="reading-mode-toggle"
            title={settings.readingMode ? 'Exit Reading Mode (Show Visuals)' : 'Enable Reading Mode (Text Only)'}
            className={`p-2 rounded-md border transition-colors cursor-pointer ${
              settings.readingMode
                ? 'bg-[#E2B859]/15 border-[#E2B859]/60 text-[#E2B859]'
                : 'bg-[#0B0D13] border-white/10 text-stone-400 hover:text-stone-200'
            }`}
          >
            {settings.readingMode ? <BookOpen className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Silence Mode */}
          <button
            onClick={handleSilenceToggle}
            data-testid="silence-mode-toggle"
            title="Enter Pure Silence Mode (Distraction-Free Void)"
            className="p-2 rounded-md border border-white/10 bg-[#0B0D13] text-stone-400 hover:text-[#E2B859] hover:border-[#E2B859]/40 transition-colors cursor-pointer"
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex lg:hidden items-center justify-between pt-2 mt-2 border-t border-white/[0.05] text-[11px] font-sans text-stone-400 overflow-x-auto px-1 gap-2">
        <button
          onClick={() => onNavigate('landing')}
          className={`py-1 whitespace-nowrap ${currentView === 'landing' ? 'text-[#E2B859]' : ''}`}
        >
          Hook
        </button>
        <button
          onClick={() => onNavigate('test')}
          className={`py-1 whitespace-nowrap ${currentView === 'test' ? 'text-[#E2B859]' : ''}`}
        >
          60s Test
        </button>
        <button
          onClick={() => onNavigate('essay')}
          className={`py-1 whitespace-nowrap ${currentView === 'essay' ? 'text-[#E2B859]' : ''}`}
        >
          Essay
        </button>
        <button
          onClick={() => onNavigate('practice')}
          className={`py-1 whitespace-nowrap ${currentView === 'practice' || currentView === 'exercise' ? 'text-[#E2B859]' : ''}`}
        >
          Practice
        </button>
        <button
          onClick={() => onNavigate('diagnostics')}
          className={`py-1 whitespace-nowrap ${currentView === 'diagnostics' ? 'text-[#38BDF8]' : ''}`}
        >
          Diagnostics
        </button>
        <button
          onClick={() => onNavigate('laboratory')}
          className={`py-1 whitespace-nowrap ${currentView === 'laboratory' ? 'text-amber-400' : ''}`}
        >
          Thought Lab
        </button>
      </div>
    </header>
  );
};
