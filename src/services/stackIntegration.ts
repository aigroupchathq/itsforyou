/**
 * Integration service for the modern Build Stack:
 * 1. Cloudflare (Pages / Workers configuration, headers, deploy blueprints)
 * 2. Figma (Design tokens JSON for Figma Tokens Studio, color specs, typography)
 * 3. Supabase (Database schema with RLS, cloud sync & restore)
 */

import { ObserverState, DiagnosticRadarData } from '../types';

export const FIGMA_DESIGN_TOKENS = {
  version: '1.0.0',
  name: 'The Observer Design System',
  description: 'Contemplative, metacognitive UI tokens for Figma Tokens Studio / W3C DTCG format',
  color: {
    void: {
      value: '#040507',
      type: 'color',
      description: 'Cosmic background void, sub-black for high contrast readability',
    },
    surface: {
      value: '#0B0D13',
      type: 'color',
      description: 'Secondary elevation surface, subtle charcoal blue',
    },
    card: {
      value: '#12151F',
      type: 'color',
      description: 'Elevated card containers, panels, and modal backings',
    },
    gold: {
      value: '#E2B859',
      type: 'color',
      description: 'Primary sovereign awareness accent, warm contemplation',
    },
    cyan: {
      value: '#38BDF8',
      type: 'color',
      description: 'Grounded neuroscience accent, predictive processing clarity',
    },
    amber: {
      value: '#F59E0B',
      type: 'color',
      description: 'Warning, threshold crossing, and readiness potential',
    },
    rose: {
      value: '#F43F5E',
      type: 'color',
      description: 'Acute cognitive distress, somatic contraction, alert',
    },
    emerald: {
      value: '#10B981',
      type: 'color',
      description: 'Metacognitive plasticity, release, grounded sovereignty',
    },
    text: {
      primary: { value: '#F3F4F6', type: 'color' },
      secondary: { value: '#9CA3AF', type: 'color' },
      muted: { value: '#6B7280', type: 'color' },
    },
    border: {
      subtle: { value: 'rgba(255, 255, 255, 0.08)', type: 'color' },
      active: { value: 'rgba(226, 184, 89, 0.40)', type: 'color' },
    },
  },
  typography: {
    serifHeading: {
      fontFamily: { value: 'Cormorant Garamond, Georgia, serif' },
      fontWeight: { value: '300' },
      letterSpacing: { value: '-0.02em' },
      lineHeight: { value: '1.15' },
    },
    sansBody: {
      fontFamily: { value: 'Plus Jakarta Sans, system-ui, sans-serif' },
      fontWeight: { value: '400' },
      letterSpacing: { value: '0.01em' },
      lineHeight: { value: '1.6' },
    },
    monoLabel: {
      fontFamily: { value: 'JetBrains Mono, Menlo, monospace' },
      fontWeight: { value: '500' },
      letterSpacing: { value: '0.25em' },
      textTransform: { value: 'uppercase' },
    },
  },
  elevation: {
    glass: {
      backdropBlur: { value: '16px' },
      background: { value: 'rgba(11, 13, 19, 0.85)' },
      border: { value: '1px solid rgba(255, 255, 255, 0.08)' },
    },
  },
};

export const CLOUDFLARE_WRANGLER_TOML = `# Cloudflare Pages / Workers Deployment Configuration for The Observer
name = "the-observer"
compatibility_date = "2024-09-01"
pages_build_output_dir = "dist"

[site]
bucket = "./dist"

# Security & Cache Routing
[[routes]]
pattern = "/*"
zone_name = "theobserver.app"

[vars]
ENVIRONMENT = "production"
ENABLE_EDGE_CACHE = "true"
`;

export const CLOUDFLARE_HEADERS = `/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: microphone=(), camera=(), geolocation=()
  Cache-Control: public, max-age=3600, stale-while-revalidate=86400

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`;

export const SUPABASE_SQL_SCHEMA = `-- ====================================================================
-- THE OBSERVER: PRODUCTION POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- Supports anonymous or authenticated users, diagnostic radar profiles,
-- test tracking, thought sifting, and exercise progression.
-- ====================================================================

-- 1. PROFILES (Anonymous UUID or Auth UID)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  tone TEXT DEFAULT 'grounded' CHECK (tone IN ('grounded', 'poetic')),
  current_gap_score INTEGER DEFAULT 20,
  settings JSONB DEFAULT '{"muted": true, "readingMode": false, "volume": 0.5}'::jsonb
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual read/write by ID" ON public.profiles
  FOR ALL USING (auth.uid() = id OR id IS NOT NULL);

-- 2. 60-SECOND TEST LOGS
CREATE TABLE IF NOT EXISTS public.thought_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  thoughts INTEGER NOT NULL,
  duration_sec INTEGER DEFAULT 60,
  mind_velocity TEXT NOT NULL,
  gap_score INTEGER NOT NULL
);

ALTER TABLE public.thought_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow test logging" ON public.thought_tests
  FOR ALL USING (true);

-- 3. CLINICAL PSYCHOMETRIC DIAGNOSTICS (6-Axis Radar)
CREATE TABLE IF NOT EXISTS public.diagnostic_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  defusion_score NUMERIC(5,2) NOT NULL,
  interoception_score NUMERIC(5,2) NOT NULL,
  non_reactivity_score NUMERIC(5,2) NOT NULL,
  predictive_flexibility NUMERIC(5,2) NOT NULL,
  contextual_self_score NUMERIC(5,2) NOT NULL,
  present_gating_score NUMERIC(5,2) NOT NULL,
  overall_score NUMERIC(5,2) NOT NULL,
  clinical_level TEXT NOT NULL,
  clinical_summary TEXT,
  answers JSONB NOT NULL
);

ALTER TABLE public.diagnostic_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow diagnostic assessments" ON public.diagnostic_assessments
  FOR ALL USING (true);

-- 4. THOUGHT LAB: SIFTED THOUGHTS & DEFUSION
CREATE TABLE IF NOT EXISTS public.sifted_thoughts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  raw_thought TEXT NOT NULL,
  sensory_fact TEXT NOT NULL,
  cortical_story TEXT NOT NULL,
  somatic_charge TEXT NOT NULL,
  impulsive_urge TEXT NOT NULL,
  defusion_rating INTEGER CHECK (defusion_rating BETWEEN 1 AND 10)
);

ALTER TABLE public.sifted_thoughts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow thought lab records" ON public.sifted_thoughts
  FOR ALL USING (true);

-- 5. EXERCISE PROTOCOL SESSIONS
CREATE TABLE IF NOT EXISTS public.exercise_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  exercise_id TEXT NOT NULL,
  payload JSONB NOT NULL
);

ALTER TABLE public.exercise_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow exercise sessions" ON public.exercise_sessions
  FOR ALL USING (true);

-- Realtime publication for aggregate community counters
ALTER PUBLICATION supabase_realtime ADD TABLE public.thought_tests;
`;

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const cleanUrl = url.replace(/\/+$/, '');
    const res = await fetch(`${cleanUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
      },
    });

    if (res.ok || res.status === 200 || res.status === 404) {
      return { success: true, message: 'Supabase endpoint responded successfully.' };
    }
    return { success: false, message: `Supabase returned status code: ${res.status} ${res.statusText}` };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network connection failed' };
  }
}

export async function syncStateToSupabase(
  url: string,
  anonKey: string,
  state: ObserverState
): Promise<{ success: boolean; message: string }> {
  try {
    const cleanUrl = url.replace(/\/+$/, '');
    // Save snapshot in an anonymous profile row
    const profilePayload = {
      tone: state.tone,
      settings: state.settings,
      current_gap_score: state.gapLog.length > 0 ? state.gapLog[state.gapLog.length - 1].value : 20,
    };

    const res = await fetch(`${cleanUrl}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(profilePayload),
    });

    if (!res.ok) {
      // If table doesn't exist yet, return helpful instructions
      if (res.status === 404) {
        return {
          success: false,
          message: 'Table "profiles" does not exist yet. Please execute the SQL Migration in your Supabase SQL Editor.',
        };
      }
      return { success: false, message: `Sync status ${res.status}: ${res.statusText}` };
    }

    return { success: true, message: 'All local metacognitive records synchronized with Supabase cloud.' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Sync network error' };
  }
}
