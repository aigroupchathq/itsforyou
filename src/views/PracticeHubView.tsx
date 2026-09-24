import React, { useState } from 'react';
import { ObserverState, Tone, GlobalStats } from '../types';
import { EXERCISE_DEFS, pickTone } from '../services/content';
import {
  calculateStreak,
  getAllSessionDates,
  exportBackupJSON,
  importBackupJSON,
  resetAllProgress,
} from '../services/storage';
import {
  Flame,
  Calendar,
  Activity,
  Award,
  ArrowRight,
  Download,
  Upload,
  RotateCcw,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface PracticeHubViewProps {
  state: ObserverState;
  tone: Tone;
  globalStats: GlobalStats;
  onSelectExercise: (id: string) => void;
  onStateUpdate: (newState: ObserverState) => void;
}

export const PracticeHubView: React.FC<PracticeHubViewProps> = ({
  state,
  tone,
  globalStats,
  onSelectExercise,
  onStateUpdate,
}) => {
  const [resetDialogOpen, setResetDialogOpen] = useState<boolean>(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);

  const allDates = getAllSessionDates(state);
  const overallStreak = calculateStreak(allDates);
  const totalDaysPracticed = allDates.length;

  // Calculate total thoughts observed across all tests and exercises
  const testThoughts = state.test.history.reduce((acc, curr) => acc + curr.thoughts, 0);
  const exerciseThoughts = Object.values(state.exercises).reduce(
    (acc, ex) => acc + ex.entries.length,
    0
  );
  const totalPersonalThoughts = testThoughts + exerciseThoughts;

  // Calendar Heatmap: Last 30 Days
  const last30Days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    last30Days.push(d.toISOString().split('T')[0]);
  }

  // Backup Export
  const handleExport = () => {
    const dataStr = exportBackupJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Observer-Backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Backup Import
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importBackupJSON(content);
      if (res.success) {
        setImportSuccess(true);
        setImportError(null);
        setTimeout(() => window.location.reload(), 600);
      } else {
        setImportError(res.error || 'Failed to import file');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    const fresh = resetAllProgress();
    onStateUpdate(fresh);
    setResetDialogOpen(false);
  };

  // Chart calculation for "The Gap Widening"
  const gapData = state.gapLog.slice(-12);
  const maxGap = Math.max(100, ...gapData.map((d) => d.value));
  const minGap = Math.min(10, ...gapData.map((d) => d.value));

  return (
    <div
      data-testid="practice-hub-view"
      className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E2B859]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personal Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-stone-100 font-light">
            Practice Hub
          </h1>
          <p className="text-sm font-sans text-stone-400 max-w-xl">
            {tone === 'grounded'
              ? 'Independent metacognitive training tracks. All progress is encrypted locally in your browser.'
              : 'The inner sanctum. Return here daily to deepen your resting presence and observe the widening sky.'}
          </p>
        </div>

        {/* Global Community Counter */}
        <div
          data-testid="community-stats-box"
          className="p-4 rounded-xl bg-[#0B0D13] border border-white/10 flex items-center gap-4 text-xs font-mono shrink-0"
        >
          <div className="p-2.5 rounded-lg bg-[#38BDF8]/10 text-[#38BDF8]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-stone-500 uppercase tracking-wider block text-[10px]">
              Collective Presence Today
            </span>
            <span className="text-sm sm:text-base font-semibold text-stone-100 tabular-nums">
              {globalStats.thoughtsToday.toLocaleString()} thoughts observed
            </span>
          </div>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Streak */}
        <div
          data-testid="stat-card-streak"
          className="p-5 rounded-xl bg-[#0B0D13] border border-white/[0.08] space-y-2"
        >
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-mono uppercase tracking-wider">Day Streak</span>
            <Flame className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-3xl font-serif text-stone-100 tabular-nums">
            {overallStreak}
            <span className="text-sm font-sans text-stone-500 ml-1.5 font-normal">days</span>
          </div>
        </div>

        {/* Days Practiced */}
        <div
          data-testid="stat-card-days"
          className="p-5 rounded-xl bg-[#0B0D13] border border-white/[0.08] space-y-2"
        >
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-mono uppercase tracking-wider">Total Days</span>
            <Calendar className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-3xl font-serif text-stone-100 tabular-nums">
            {totalDaysPracticed}
            <span className="text-sm font-sans text-stone-500 ml-1.5 font-normal">active</span>
          </div>
        </div>

        {/* Total Thoughts Caught */}
        <div
          data-testid="stat-card-thoughts"
          className="p-5 rounded-xl bg-[#0B0D13] border border-white/[0.08] space-y-2"
        >
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-mono uppercase tracking-wider">Thoughts Caught</span>
            <Activity className="w-4 h-4 text-[#E2B859]" />
          </div>
          <div className="text-3xl font-serif text-[#E2B859] tabular-nums">
            {totalPersonalThoughts}
          </div>
        </div>

        {/* 60-Sec Best */}
        <div
          data-testid="stat-card-best"
          className="p-5 rounded-xl bg-[#0B0D13] border border-white/[0.08] space-y-2"
        >
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-mono uppercase tracking-wider">60s Test Best</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-serif text-stone-100 tabular-nums">
            {state.test.best !== null ? state.test.best : '—'}
            <span className="text-sm font-sans text-stone-500 ml-1.5 font-normal">
              {state.test.best !== null ? 'thoughts' : 'untaken'}
            </span>
          </div>
        </div>
      </div>

      {/* "The Gap Widening" Interactive Area Chart & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Area Chart */}
        <div
          data-testid="gap-widening-chart-box"
          className="lg:col-span-2 p-6 rounded-2xl bg-[#0B0D13] border border-white/[0.08] space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-serif text-stone-200">
                The Metacognitive Gap Widening
              </h3>
              <p className="text-xs font-sans text-stone-500">
                Relative distance established between awareness and automated cognitive proposals.
              </p>
            </div>
            <span className="text-xs font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-2.5 py-1 rounded-full border border-[#38BDF8]/20">
              +{gapData[gapData.length - 1]?.value || 0}% expansion
            </span>
          </div>

          {/* SVG Area Graph */}
          <div className="h-52 w-full pt-4 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200">
              <defs>
                <linearGradient id="gapGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(255,255,255,0.05)" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(255,255,255,0.05)" />
              <line x1="0" y1="150" x2="600" y2="150" stroke="rgba(255,255,255,0.05)" />

              {/* Area Path */}
              {gapData.length > 1 && (
                <>
                  <path
                    d={`
                      M 0 200
                      ${gapData
                        .map((pt, i) => {
                          const x = (i / (gapData.length - 1)) * 600;
                          const y = 200 - ((pt.value - minGap) / Math.max(1, maxGap - minGap)) * 160 - 20;
                          return `L ${x} ${y}`;
                        })
                        .join(' ')}
                      L 600 200 Z
                    `}
                    fill="url(#gapGradient)"
                  />
                  <path
                    d={`
                      M 0 ${
                        200 - ((gapData[0].value - minGap) / Math.max(1, maxGap - minGap)) * 160 - 20
                      }
                      ${gapData
                        .map((pt, i) => {
                          const x = (i / (gapData.length - 1)) * 600;
                          const y = 200 - ((pt.value - minGap) / Math.max(1, maxGap - minGap)) * 160 - 20;
                          return `L ${x} ${y}`;
                        })
                        .join(' ')}
                    `}
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="2.5"
                  />
                  {/* Point circles */}
                  {gapData.map((pt, i) => {
                    const x = (i / (gapData.length - 1)) * 600;
                    const y = 200 - ((pt.value - minGap) / Math.max(1, maxGap - minGap)) * 160 - 20;
                    return (
                      <g key={i} className="group cursor-pointer">
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#040507"
                          stroke="#E2B859"
                          strokeWidth="2"
                        />
                      </g>
                    );
                  })}
                </>
              )}
            </svg>
          </div>
        </div>

        {/* 30-Day Activity Heatmap */}
        <div
          data-testid="activity-heatmap-box"
          className="p-6 rounded-2xl bg-[#0B0D13] border border-white/[0.08] space-y-4"
        >
          <div className="space-y-1">
            <h3 className="text-base font-serif text-stone-200">Practice Heatmap</h3>
            <p className="text-xs font-sans text-stone-500">
              Consistency over the previous 30 days.
            </p>
          </div>

          <div className="grid grid-cols-6 gap-2.5 pt-3">
            {last30Days.map((dStr) => {
              const active = allDates.includes(dStr);
              return (
                <div
                  key={dStr}
                  title={`${dStr}: ${active ? 'Practiced' : 'No session'}`}
                  className={`aspect-square rounded-md border transition-all ${
                    active
                      ? 'bg-[#E2B859] border-[#E2B859] shadow-[0_0_8px_rgba(226,184,89,0.5)]'
                      : 'bg-[#040507] border-white/5 hover:border-white/20'
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 pt-2 border-t border-white/[0.05]">
            <span>30 days ago</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#040507] border border-white/10" />
              <span>Rest</span>
              <span className="w-2.5 h-2.5 rounded-sm bg-[#E2B859]" />
              <span>Awake</span>
            </div>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* 7 Dedicated Exercise Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-stone-100">The 7 Practice Protocols</h2>
            <p className="text-xs font-mono uppercase tracking-widest text-stone-500">
              Independent Tracks · Progress Preserved
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.values(EXERCISE_DEFS).map((def) => {
            const exState = state.exercises[def.id] || { entries: [], sessions: [] };
            const exStreak = calculateStreak(exState.sessions);
            const totalSessions = exState.sessions.length;
            const isStarted = totalSessions > 0;

            return (
              <div
                key={def.id}
                data-testid={`exercise-card-${def.id}`}
                className="p-6 rounded-2xl bg-[#0B0D13] border border-white/[0.08] hover:border-[#E2B859]/40 transition-all flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#E2B859] font-medium">Protocol 0{def.number}</span>
                    <span className="text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {def.cadence}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif text-stone-100 group-hover:text-[#E2B859] transition-colors leading-snug">
                    {pickTone(def.name, tone)}
                  </h3>

                  <p className="text-xs text-stone-400 leading-relaxed font-sans line-clamp-2">
                    {pickTone(def.goal, tone)}
                  </p>
                </div>

                <div className="space-y-4 pt-3 border-t border-white/[0.05]">
                  {/* Progress info */}
                  <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                    <span>
                      {isStarted
                        ? `Session ${totalSessions} of ${def.daysTotal}d`
                        : `${def.daysTotal}-Day Curriculum`}
                    </span>
                    {exStreak > 0 && (
                      <span className="text-[#F59E0B] flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" />
                        {exStreak}d
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-stone-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#E2B859] transition-all"
                      style={{
                        width: `${Math.min(100, (totalSessions / def.daysTotal) * 100)}%`,
                      }}
                    />
                  </div>

                  {/* Launch CTA */}
                  <button
                    onClick={() => onSelectExercise(def.id)}
                    data-testid={`launch-exercise-btn-${def.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-white/10 text-xs font-medium tracking-wide transition-all group-hover:border-[#E2B859]/30"
                  >
                    <span>{isStarted ? 'Resume Protocol' : 'Begin Protocol'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E2B859]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Backup, Restore & Reset Progress Controls */}
      <div className="p-6 rounded-2xl bg-[#0B0D13] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h4 className="text-sm font-serif text-stone-200">Local Data Ownership</h4>
          <p className="text-xs text-stone-500 font-sans">
            Export a portable JSON backup of all journal logs, tests, and streaks, or restore on
            another device.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Export */}
          <button
            onClick={handleExport}
            data-testid="backup-export-button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-white/10 text-xs font-mono transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Export JSON</span>
          </button>

          {/* Import */}
          <label
            data-testid="backup-import-label"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-white/10 text-xs font-mono transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#E2B859]" />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              data-testid="backup-file-input"
            />
          </label>

          {/* Reset */}
          <button
            onClick={() => setResetDialogOpen(true)}
            data-testid="reset-progress-button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border border-rose-900/30 text-xs font-mono transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {importSuccess && (
        <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800 text-emerald-300 text-xs font-mono text-center">
          Backup restored successfully. Reloading workspace...
        </div>
      )}

      {importError && (
        <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800 text-rose-300 text-xs font-mono text-center">
          Import Error: {importError}
        </div>
      )}

      {/* Confirm Reset Dialog */}
      {resetDialogOpen && (
        <div
          data-testid="reset-confirm-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div className="max-w-md w-full bg-[#0B0D13] border border-rose-900/40 rounded-2xl p-6 space-y-5">
            <h3 className="text-xl font-serif text-rose-300">Reset All Local Progress?</h3>
            <p className="text-xs text-stone-300 leading-relaxed font-sans">
              This will permanently delete all journal entries, test history, and session dates from
              this browser's local storage. This action cannot be reversed.
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setResetDialogOpen(false)}
                className="px-4 py-2 rounded-lg bg-stone-900 text-stone-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                data-testid="confirm-reset-button"
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-semibold"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
