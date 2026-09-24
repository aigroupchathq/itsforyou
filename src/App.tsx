import React, { useState, useEffect } from 'react';
import { ObserverState, Tone, UserSettings, GlobalStats } from './types';
import { loadState, saveState, getGlobalStats } from './services/storage';
import { Navigation } from './components/Navigation';
import { ParticleCanvas, CanvasMode } from './components/ParticleCanvas';
import { CitationModal } from './components/CitationModal';
import { SilenceOverlay } from './components/SilenceOverlay';
import { SomaticSOSModal } from './components/SomaticSOSModal';
import { StackModal } from './components/StackModal';
import { SoundscapeDrawer } from './components/SoundscapeDrawer';
import { LandingView } from './views/LandingView';
import { TestView } from './views/TestView';
import { EssayView } from './views/EssayView';
import { PracticeHubView } from './views/PracticeHubView';
import { ExerciseView } from './views/ExerciseView';
import { DiagnosticsView } from './views/DiagnosticsView';
import { ThoughtLabView } from './views/ThoughtLabView';
import { Terminal, ShieldAlert, Activity, Cpu } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<ObserverState>(loadState);
  const [currentView, setCurrentView] = useState<
    'landing' | 'test' | 'essay' | 'practice' | 'exercise' | 'diagnostics' | 'laboratory'
  >('landing');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('1');
  const [activeCitationId, setActiveCitationId] = useState<string | null>(null);
  const [canvasMode, setCanvasMode] = useState<CanvasMode>('void');
  const [coherenceLevel, setCoherenceLevel] = useState<number>(0.5);
  const [globalStats, setGlobalStats] = useState<GlobalStats>(getGlobalStats);

  // Modals state
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isStackOpen, setIsStackOpen] = useState(false);
  const [isSoundscapeOpen, setIsSoundscapeOpen] = useState(false);

  // Synchronize state changes to localStorage
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Synchronize canvas mode with current view
  useEffect(() => {
    if (currentView === 'landing' || currentView === 'test') {
      setCanvasMode('void');
    } else if (currentView === 'practice') {
      setCanvasMode('observer');
    } else if (currentView === 'diagnostics') {
      setCanvasMode('coherence');
    } else if (currentView === 'laboratory') {
      setCanvasMode('prediction');
    } else if (currentView === 'exercise') {
      if (selectedExerciseId === '1') setCanvasMode('static');
      else if (selectedExerciseId === '2') setCanvasMode('prediction');
      else if (selectedExerciseId === '3') setCanvasMode('coherence');
      else if (selectedExerciseId === '4') setCanvasMode('collective');
      else if (selectedExerciseId === '5') setCanvasMode('response');
      else if (selectedExerciseId === '6') setCanvasMode('observer');
      else setCanvasMode('integration');
    }
  }, [currentView, selectedExerciseId]);

  // Handle Escape key to dismiss modals or exit silence mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSOSOpen) setIsSOSOpen(false);
        else if (isStackOpen) setIsStackOpen(false);
        else if (isSoundscapeOpen) setIsSoundscapeOpen(false);
        else if (activeCitationId) setActiveCitationId(null);
        else if (state.settings.silenceMode) {
          handleUpdateSettings({ silenceMode: false });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCitationId, state.settings.silenceMode, isSOSOpen, isStackOpen, isSoundscapeOpen]);

  const handleToggleTone = () => {
    setState((prev) => {
      const nextTone: Tone = prev.tone === 'grounded' ? 'poetic' : 'grounded';
      return { ...prev, tone: nextTone };
    });
  };

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  };

  const handleNavigate = (
    view: 'landing' | 'test' | 'essay' | 'practice' | 'diagnostics' | 'laboratory'
  ) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectExercise = (id: string) => {
    setSelectedExerciseId(id);
    setCurrentView('exercise');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStateUpdate = (newState: ObserverState) => {
    setState(newState);
    setGlobalStats(getGlobalStats());
  };

  return (
    <div className="relative min-h-screen bg-[#040507] text-[#F3F4F6] flex flex-col justify-between selection:bg-[#E2B859]/30">
      {/* Background Interactive Particle Void */}
      <ParticleCanvas
        mode={canvasMode}
        coherenceLevel={coherenceLevel}
        readingMode={state.settings.readingMode}
      />

      {/* Top Bar Navigation (With Diagnostics, Lab, SOS, Stack) */}
      <Navigation
        currentView={currentView}
        onNavigate={handleNavigate}
        tone={state.tone}
        onToggleTone={handleToggleTone}
        settings={state.settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenStack={() => setIsStackOpen(true)}
        onOpenSoundscape={() => setIsSoundscapeOpen(true)}
      />

      {/* Main Routed View Content */}
      <main className="relative z-10 flex-grow">
        {currentView === 'landing' && (
          <LandingView
            tone={state.tone}
            onNavigate={(v) => handleNavigate(v as any)}
            onOpenCitation={(id) => setActiveCitationId(id)}
          />
        )}

        {currentView === 'test' && (
          <TestView
            tone={state.tone}
            onNavigateToHub={() => handleNavigate('practice')}
          />
        )}

        {currentView === 'essay' && (
          <EssayView
            tone={state.tone}
            onSelectExercise={handleSelectExercise}
            onOpenCitation={(id) => setActiveCitationId(id)}
            onModeChange={(mode) => setCanvasMode(mode)}
            coherenceLevel={coherenceLevel}
            onCoherenceChange={(val) => setCoherenceLevel(val)}
          />
        )}

        {currentView === 'practice' && (
          <PracticeHubView
            state={state}
            tone={state.tone}
            globalStats={globalStats}
            onSelectExercise={handleSelectExercise}
            onStateUpdate={handleStateUpdate}
          />
        )}

        {currentView === 'exercise' && (
          <ExerciseView
            exerciseId={selectedExerciseId}
            state={state}
            tone={state.tone}
            onBackToHub={() => handleNavigate('practice')}
            onStateUpdate={handleStateUpdate}
          />
        )}

        {currentView === 'diagnostics' && (
          <DiagnosticsView
            state={state}
            tone={state.tone}
            onUpdateState={handleStateUpdate}
            onSelectExercise={handleSelectExercise}
          />
        )}

        {currentView === 'laboratory' && (
          <ThoughtLabView
            state={state}
            tone={state.tone}
            onUpdateState={handleStateUpdate}
          />
        )}
      </main>

      {/* Footer with Stack & Tool Shortcuts */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/[0.06] text-xs font-mono text-stone-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-stone-400">The Observer · Metacognitive & Clinical Laboratory</span>
            <span className="hidden md:inline text-stone-600">|</span>
            <span className="text-stone-500">Privacy-First Architecture</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavigate('diagnostics')}
              className="hover:text-[#38BDF8] transition-colors cursor-pointer flex items-center gap-1"
            >
              <Activity className="w-3 h-3 text-[#38BDF8]" />
              <span>Diagnostics</span>
            </button>
            <button
              onClick={() => handleNavigate('laboratory')}
              className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Cpu className="w-3 h-3 text-amber-400" />
              <span>Thought Lab</span>
            </button>
            <button
              onClick={() => setIsStackOpen(true)}
              className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Terminal className="w-3 h-3 text-emerald-400" />
              <span>CF / Figma / Supabase</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Evidence / Citation Modal */}
      <CitationModal
        citationId={activeCitationId}
        onClose={() => setActiveCitationId(null)}
        tone={state.tone}
      />

      {/* Neuro-Somatic Emergency SOS Modal */}
      <SomaticSOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
      />

      {/* Build Stack (Cloudflare, Figma, Supabase) Modal */}
      <StackModal
        isOpen={isStackOpen}
        onClose={() => setIsStackOpen(false)}
        state={state}
        onUpdateState={handleStateUpdate}
      />

      {/* Soundscape & Brainwave Frequencies Drawer */}
      <SoundscapeDrawer
        isOpen={isSoundscapeOpen}
        onClose={() => setIsSoundscapeOpen(false)}
        settings={state.settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Silence Mode Distraction-Free Void Overlay */}
      {state.settings.silenceMode && (
        <SilenceOverlay
          onExit={() => handleUpdateSettings({ silenceMode: false })}
        />
      )}
    </div>
  );
}
