import React, { useState } from 'react';
import { ObserverState } from '../types';
import {
  FIGMA_DESIGN_TOKENS,
  CLOUDFLARE_WRANGLER_TOML,
  CLOUDFLARE_HEADERS,
  SUPABASE_SQL_SCHEMA,
  testSupabaseConnection,
  syncStateToSupabase,
} from '../services/stackIntegration';
import { updateSupabaseConfig } from '../services/storage';
import {
  Cloud,
  Database,
  Figma,
  Check,
  Copy,
  Download,
  X,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

interface StackModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: ObserverState;
  onUpdateState: (newState: ObserverState) => void;
}

export const StackModal: React.FC<StackModalProps> = ({
  isOpen,
  onClose,
  state,
  onUpdateState,
}) => {
  const [activeTab, setActiveTab] = useState<'supabase' | 'cloudflare' | 'figma'>('supabase');

  // Supabase state
  const [supabaseUrl, setSupabaseUrl] = useState(state.supabaseConfig?.url || '');
  const [supabaseKey, setSupabaseKey] = useState(state.supabaseConfig?.anonKey || '');
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{ success: boolean; message: string } | null>(null);
  const [syncingData, setSyncingData] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);

  // Copy status indicators
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownload = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTestSupabase = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setConnectionResult({ success: false, message: 'Please provide both Supabase URL and Anon Key.' });
      return;
    }
    setTestingConnection(true);
    setConnectionResult(null);
    const res = await testSupabaseConnection(supabaseUrl, supabaseKey);
    setTestingConnection(false);
    setConnectionResult(res);

    if (res.success) {
      const newState = updateSupabaseConfig({
        url: supabaseUrl,
        anonKey: supabaseKey,
        connected: true,
        lastSyncedAt: state.supabaseConfig?.lastSyncedAt,
      });
      onUpdateState(newState);
    }
  };

  const handleSyncSupabase = async () => {
    if (!supabaseUrl || !supabaseKey) return;
    setSyncingData(true);
    setSyncResult(null);
    const res = await syncStateToSupabase(supabaseUrl, supabaseKey, state);
    setSyncingData(false);
    setSyncResult(res);

    if (res.success) {
      const newState = updateSupabaseConfig({
        url: supabaseUrl,
        anonKey: supabaseKey,
        connected: true,
        lastSyncedAt: new Date().toISOString(),
      });
      onUpdateState(newState);
    }
  };

  return (
    <div
      data-testid="stack-integration-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in"
    >
      <div className="relative w-full max-w-3xl bg-[#0B0D13] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full border border-white/10 bg-[#12151F] text-stone-400 hover:text-stone-100 hover:border-white/30 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 text-[#38BDF8] font-mono text-xs uppercase tracking-widest mb-1.5">
          <Terminal className="w-4 h-4" />
          <span>Production Stack Blueprint & Infrastructure</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-stone-100 font-light">
          Cloudflare • Figma • Supabase
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 mt-1 mb-6 font-sans">
          Deploy to Cloudflare edge, import the design system into Figma, and connect a scalable Supabase PostgreSQL backend with Row Level Security.
        </p>

        {/* Top Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-[#12151F] border border-white/5 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab('supabase')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'supabase'
                ? 'bg-[#040507] text-emerald-400 border border-emerald-400/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase</span>
          </button>
          <button
            onClick={() => setActiveTab('cloudflare')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'cloudflare'
                ? 'bg-[#040507] text-[#F59E0B] border border-[#F59E0B]/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Cloudflare</span>
          </button>
          <button
            onClick={() => setActiveTab('figma')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'figma'
                ? 'bg-[#040507] text-[#38BDF8] border border-[#38BDF8]/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Figma className="w-4 h-4" />
            <span>Figma Tokens</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: SUPABASE INTEGRATION & SCHEMA                          */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'supabase' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#12151F] border border-white/5 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span>Live Supabase Persistence & Cloud Sync</span>
              </h3>
              <p className="text-xs text-stone-400">
                Optionally link your Supabase project to sync your diagnostic assessments, 60-second test velocity history, and sifted thoughts across devices.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#0B0D13] border border-white/10 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1">
                    Supabase Anon / Public Key
                  </label>
                  <input
                    type="password"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6Ik..."
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#0B0D13] border border-white/10 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={handleTestSupabase}
                  disabled={testingConnection}
                  className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono uppercase hover:bg-emerald-500/30 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {testingConnection ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                  <span>Test Connection</span>
                </button>
                <button
                  onClick={handleSyncSupabase}
                  disabled={syncingData || !supabaseUrl}
                  className="px-4 py-2 rounded-lg bg-[#12151F] text-stone-200 border border-white/10 text-xs font-mono uppercase hover:border-emerald-400 hover:text-emerald-400 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {syncingData ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  <span>Sync Local State to Cloud</span>
                </button>
              </div>

              {connectionResult && (
                <div
                  className={`p-3 rounded-lg text-xs font-mono ${
                    connectionResult.success
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {connectionResult.message}
                </div>
              )}

              {syncResult && (
                <div
                  className={`p-3 rounded-lg text-xs font-mono ${
                    syncResult.success
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {syncResult.message}
                </div>
              )}
            </div>

            {/* SQL Schema Viewer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
                  PostgreSQL Migration (Tables + Row Level Security)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(SUPABASE_SQL_SCHEMA, 'supabase_sql')}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-stone-300 hover:text-emerald-400 border border-white/10 rounded-md bg-[#12151F] transition-all cursor-pointer"
                  >
                    {copiedKey === 'supabase_sql' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'supabase_sql' ? 'Copied SQL' : 'Copy SQL'}</span>
                  </button>
                  <button
                    onClick={() => handleDownload('the_observer_supabase_schema.sql', SUPABASE_SQL_SCHEMA, 'text/sql')}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-stone-300 hover:text-emerald-400 border border-white/10 rounded-md bg-[#12151F] transition-all cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download .sql</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 rounded-xl bg-[#040507] border border-white/5 text-[11px] font-mono text-stone-400 overflow-x-auto max-h-56 leading-relaxed">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: CLOUDFLARE DEPLOYMENT BLUEPRINT                       */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'cloudflare' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#12151F] border border-white/5 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#F59E0B] flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                <span>Cloudflare Pages & Workers Blueprint</span>
              </h3>
              <p className="text-xs text-stone-400">
                Deploy The Observer globally across Cloudflare's 300+ city edge network in seconds with ultra-low latency, custom headers, and immutably cached assets.
              </p>

              <div className="p-3 rounded-lg bg-[#040507] border border-white/5 text-xs font-mono text-stone-300 space-y-1">
                <div className="text-stone-500"># 1. Build the Vite production bundle</div>
                <div className="text-[#F59E0B]">npm run build</div>
                <div className="text-stone-500 pt-1"># 2. Deploy directly to Cloudflare Pages</div>
                <div className="text-[#38BDF8]">npx wrangler pages deploy dist --project-name=the-observer</div>
              </div>
            </div>

            {/* wrangler.toml preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
                  wrangler.toml Configuration
                </span>
                <button
                  onClick={() => handleCopy(CLOUDFLARE_WRANGLER_TOML, 'wrangler')}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-stone-300 hover:text-[#F59E0B] border border-white/10 rounded-md bg-[#12151F] transition-all cursor-pointer"
                >
                  {copiedKey === 'wrangler' ? <Check className="w-3 h-3 text-[#F59E0B]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'wrangler' ? 'Copied' : 'Copy wrangler.toml'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-[#040507] border border-white/5 text-[11px] font-mono text-stone-400 overflow-x-auto max-h-40">
                {CLOUDFLARE_WRANGLER_TOML}
              </pre>
            </div>

            {/* _headers preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
                  _headers (Security & Edge Caching)
                </span>
                <button
                  onClick={() => handleCopy(CLOUDFLARE_HEADERS, 'headers')}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-stone-300 hover:text-[#F59E0B] border border-white/10 rounded-md bg-[#12151F] transition-all cursor-pointer"
                >
                  {copiedKey === 'headers' ? <Check className="w-3 h-3 text-[#F59E0B]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'headers' ? 'Copied' : 'Copy _headers'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-[#040507] border border-white/5 text-[11px] font-mono text-stone-400 overflow-x-auto max-h-40">
                {CLOUDFLARE_HEADERS}
              </pre>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: FIGMA DESIGN TOKENS                                   */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'figma' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#12151F] border border-white/5 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#38BDF8] flex items-center gap-2">
                <Figma className="w-4 h-4" />
                <span>Figma Tokens Studio (W3C DTCG Format)</span>
              </h3>
              <p className="text-xs text-stone-400">
                Export the exact design tokens (colors, typography scales, elevation shadows) for instant synchronization into Figma via Tokens Studio.
              </p>

              {/* Color Swatches Preview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="p-2.5 rounded-lg bg-[#040507] border border-white/10 text-xs font-mono">
                  <div className="w-full h-6 rounded bg-[#040507] border border-white/20 mb-1" />
                  <span className="text-stone-300 block">Void #040507</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0B0D13] border border-white/10 text-xs font-mono">
                  <div className="w-full h-6 rounded bg-[#0B0D13] mb-1" />
                  <span className="text-stone-300 block">Surface #0B0D13</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#12151F] border border-white/10 text-xs font-mono">
                  <div className="w-full h-6 rounded bg-[#E2B859] mb-1 shadow-[0_0_10px_#E2B859]" />
                  <span className="text-[#E2B859] block">Gold #E2B859</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#12151F] border border-white/10 text-xs font-mono">
                  <div className="w-full h-6 rounded bg-[#38BDF8] mb-1 shadow-[0_0_10px_#38BDF8]" />
                  <span className="text-[#38BDF8] block">Cyan #38BDF8</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
                  design-tokens.json
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(JSON.stringify(FIGMA_DESIGN_TOKENS, null, 2), 'figma')}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-stone-300 hover:text-[#38BDF8] border border-white/10 rounded-md bg-[#12151F] transition-all cursor-pointer"
                  >
                    {copiedKey === 'figma' ? <Check className="w-3 h-3 text-[#38BDF8]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'figma' ? 'Copied' : 'Copy Tokens JSON'}</span>
                  </button>
                  <button
                    onClick={() =>
                      handleDownload(
                        'observer-figma-tokens.json',
                        JSON.stringify(FIGMA_DESIGN_TOKENS, null, 2),
                        'application/json'
                      )
                    }
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-stone-300 hover:text-[#38BDF8] border border-white/10 rounded-md bg-[#12151F] transition-all cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download JSON</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 rounded-xl bg-[#040507] border border-white/5 text-[11px] font-mono text-stone-400 overflow-x-auto max-h-56 leading-relaxed">
                {JSON.stringify(FIGMA_DESIGN_TOKENS, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
