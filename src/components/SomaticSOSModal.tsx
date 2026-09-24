import React, { useState, useEffect } from 'react';
import { soundscape } from '../services/soundscape';
import {
  HeartPulse,
  Wind,
  CheckCircle2,
  X,
  ShieldAlert,
  Sparkles,
  Volume2,
  RefreshCw,
} from 'lucide-react';

interface SomaticSOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SomaticSOSModal: React.FC<SomaticSOSModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSOSMode, setActiveSOSMode] = useState<'sigh' | 'grounding' | 'bodymap'>('sigh');

  // Physiological sigh state
  const [sighPhase, setSighPhase] = useState<'inhale1' | 'inhale2' | 'exhale' | 'rest'>('inhale1');
  const [sighSeconds, setSighSeconds] = useState(0);
  const [sighCycles, setSighCycles] = useState(0);
  const [sighRunning, setSighRunning] = useState(false);

  // 5-4-3-2-1 checklist
  const [groundingChecks, setGroundingChecks] = useState<Record<string, boolean>>({});

  // Body map selected zone
  const [selectedZone, setSelectedZone] = useState<string | null>('chest');

  useEffect(() => {
    let interval: any = null;
    if (sighRunning) {
      interval = setInterval(() => {
        setSighSeconds((prev) => {
          const next = prev + 0.1;
          // Inhale 1: 0 to 2.5s
          // Inhale 2: 2.5 to 3.5s
          // Exhale: 3.5 to 9.5s
          // Rest: 9.5 to 10.5s
          if (next < 2.5) {
            setSighPhase('inhale1');
          } else if (next < 3.5) {
            setSighPhase('inhale2');
          } else if (next < 9.5) {
            setSighPhase('exhale');
          } else if (next < 10.5) {
            setSighPhase('rest');
          } else {
            // New cycle
            setSighCycles((c) => c + 1);
            soundscape.playAwarenessChime(432);
            return 0;
          }
          return next;
        });
      }, 100);
    } else {
      setSighSeconds(0);
      setSighPhase('inhale1');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sighRunning]);

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    setGroundingChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const BODY_ZONES: Record<
    string,
    { name: string; feeling: string; guidance: string; coords: { top: string; left: string } }
  > = {
    head: {
      name: 'Forehead & Crown',
      feeling: 'Mental pressure, cortical buzzing, skull tightness',
      guidance: 'Unclench your tongue from the roof of your mouth. Drop the muscles around your eyes and soften your jaw. The brain cannot hold tension without muscular feedback.',
      coords: { top: '15%', left: '50%' },
    },
    throat: {
      name: 'Throat & Vocal Tract',
      feeling: 'Lump in throat, swallow constriction, unspoken dread',
      guidance: 'Take a slow sip of room-temperature water or swallow with conscious ease. Relax your larynx; this is the vagus nerve signaling readiness to speak or cry. Let the throat widen.',
      coords: { top: '25%', left: '50%' },
    },
    chest: {
      name: 'Heart & Chest',
      feeling: 'Elevated tachycardia, sternum compression, shallow lung volume',
      guidance: 'Your autonomic nervous system is releasing norepinephrine to protect you. Place your palm flat against your sternum. Warm touch triggers oxytocin release and down-regulates the amygdala.',
      coords: { top: '38%', left: '50%' },
    },
    solar: {
      name: 'Solar Plexus',
      feeling: 'Adrenaline knots, acute electric nausea, dread center',
      guidance: 'Locate the exact spatial borders of this knot. Is it moving? Does it vibrate? Breathe into the perimeter of the sensation without attempting to push it away. It peaks and decays in 90 seconds.',
      coords: { top: '48%', left: '50%' },
    },
    gut: {
      name: 'Gut & Lower Abdomen',
      feeling: 'Sinking void, visceral cramp, digestive shutdown',
      guidance: 'Allow your belly to completely relax and expand outward on the inhale. Reverse diaphragmatic breathing resets enteric nervous system tone.',
      coords: { top: '58%', left: '50%' },
    },
    hands: {
      name: 'Hands & Limbs',
      feeling: 'Cold fingertips, trembling, fight/flight clenching',
      guidance: 'Shake both hands vigorously for 10 seconds. Squeeze your fists with 100% force, hold for 3 seconds, then release completely to trigger parasympathetic rebound.',
      coords: { top: '52%', left: '20%' },
    },
  };

  return (
    <div
      data-testid="somatic-sos-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in"
    >
      <div className="relative w-full max-w-2xl bg-[#0B0D13] border border-rose-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(244,63,94,0.15)] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full border border-white/10 bg-[#12151F] text-stone-400 hover:text-stone-100 hover:border-white/30 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-widest mb-2">
          <ShieldAlert className="w-4 h-4 animate-pulse" />
          <span>Neuro-Somatic Emergency Reset</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-stone-100 font-light">
          Acute Vagal Down-Regulation
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 mt-1 mb-6 font-sans">
          Immediate physiological intervention to interrupt cortical panic, catastrophizing, and sympathetic nervous overdrive.
        </p>

        {/* Tabs */}
        <div className="flex items-center gap-2 p-1 bg-[#12151F] border border-white/5 rounded-xl mb-6">
          <button
            onClick={() => setActiveSOSMode('sigh')}
            className={`flex-1 py-2 px-3 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
              activeSOSMode === 'sigh'
                ? 'bg-[#040507] text-[#38BDF8] border border-[#38BDF8]/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Physiological Sigh
          </button>
          <button
            onClick={() => setActiveSOSMode('grounding')}
            className={`flex-1 py-2 px-3 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
              activeSOSMode === 'grounding'
                ? 'bg-[#040507] text-emerald-400 border border-emerald-400/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            5-4-3-2-1 Sensory Grounding
          </button>
          <button
            onClick={() => setActiveSOSMode('bodymap')}
            className={`flex-1 py-2 px-3 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
              activeSOSMode === 'bodymap'
                ? 'bg-[#040507] text-[#E2B859] border border-[#E2B859]/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Somatic Body Map
          </button>
        </div>

        {/* MODE 1: PHYSIOLOGICAL SIGH */}
        {activeSOSMode === 'sigh' && (
          <div className="flex flex-col items-center justify-center text-center space-y-6 py-4">
            <div className="relative flex items-center justify-center w-52 h-52">
              {/* Animated Glowing Ring */}
              <div
                className={`absolute rounded-full transition-all duration-700 ${
                  sighPhase === 'inhale1'
                    ? 'w-36 h-36 border-2 border-[#38BDF8] bg-[#38BDF8]/10 shadow-[0_0_30px_rgba(56,189,248,0.3)]'
                    : sighPhase === 'inhale2'
                    ? 'w-48 h-48 border-2 border-emerald-400 bg-emerald-400/15 shadow-[0_0_40px_rgba(16,185,129,0.4)]'
                    : sighPhase === 'exhale'
                    ? 'w-24 h-24 border border-rose-400/50 bg-rose-400/5 shadow-none'
                    : 'w-20 h-20 border border-white/10 bg-white/5'
                }`}
              />

              {/* Text Inside Orb */}
              <div className="relative z-10 space-y-1">
                <span className="text-xs font-mono tracking-widest uppercase text-stone-400">
                  {sighRunning ? (
                    sighPhase === 'inhale1'
                      ? 'Deep Nasal Inhale'
                      : sighPhase === 'inhale2'
                      ? 'Sharp Top-Up Inhale'
                      : sighPhase === 'exhale'
                      ? 'Slow Long Sigh Exhale'
                      : 'Rest & Pause'
                  ) : (
                    'Ready to Reset'
                  )}
                </span>
                <div className="text-3xl font-mono font-bold text-stone-100">
                  {sighRunning ? (sighSeconds > 0 ? sighSeconds.toFixed(1) : '0.0') : '2 min'}
                </div>
              </div>
            </div>

            <div className="text-xs text-stone-400 max-w-sm font-sans">
              <strong className="text-stone-200 block mb-1">Stanford Neurobiology Protocol:</strong>
              Two inhales through the nose, followed by one long, slow exhalation through the mouth.
              Collapses hyperventilating lung alveoli and triggers immediate vagal braking on heart rate.
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSighRunning(!sighRunning)}
                className={`px-8 py-3 rounded-xl font-mono text-xs uppercase font-bold tracking-wider transition-all cursor-pointer ${
                  sighRunning
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30'
                    : 'bg-[#38BDF8] text-stone-950 hover:bg-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                }`}
              >
                {sighRunning ? 'Pause Pacer' : 'Begin Sigh Cycles'}
              </button>
              {sighCycles > 0 && (
                <span className="text-xs font-mono text-emerald-400">
                  {sighCycles} Cycles Completed
                </span>
              )}
            </div>
          </div>
        )}

        {/* MODE 2: 5-4-3-2-1 SENSORY GROUNDING */}
        {activeSOSMode === 'grounding' && (
          <div className="space-y-4 py-2">
            <p className="text-xs text-stone-400 font-sans">
              Panic is temporal hallucination: your consciousness is trapped in an imagined catastrophic future.
              Force attentional gating back to raw sensory telemetry.
            </p>

            <div className="space-y-2.5">
              {[
                { id: 'v5', label: '5 things you can visually see (color, shadow, texture, shape, reflection)' },
                { id: 't4', label: '4 physical textures you can feel (fabric on skin, feet on floor, cool air, phone glass)' },
                { id: 's3', label: '3 distinct sounds in your current environment (hum of fan, distant traffic, your breath)' },
                { id: 'sc2', label: '2 subtle scents or smells in the room (coffee, fabric, rain, fresh air)' },
                { id: 'ta1', label: '1 taste or conscious swallow in your mouth' },
              ].map(({ id, label }) => {
                const checked = !!groundingChecks[id];
                return (
                  <button
                    key={id}
                    onClick={() => toggleCheck(id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      checked
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-stone-200'
                        : 'bg-[#12151F] border-white/10 text-stone-400 hover:border-white/20'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-5 h-5 shrink-0 mt-0.5 transition-colors ${
                        checked ? 'text-emerald-400' : 'text-stone-600'
                      }`}
                    />
                    <span className="text-xs font-sans leading-relaxed">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* MODE 3: SOMATIC BODY MAP */}
        {activeSOSMode === 'bodymap' && (
          <div className="space-y-6 py-2">
            <p className="text-xs text-stone-400 font-sans">
              Tap the region where you are experiencing visceral contraction or panic sensations:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(BODY_ZONES).map(([key, zone]) => {
                const isSelected = selectedZone === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedZone(key)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#E2B859]/15 border-[#E2B859] text-stone-100 shadow-[0_0_15px_rgba(226,184,89,0.2)]'
                        : 'bg-[#12151F] border-white/10 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span className="text-xs font-mono uppercase block font-semibold mb-0.5">
                      {zone.name}
                    </span>
                    <span className="text-[11px] text-stone-400 line-clamp-1">
                      {zone.feeling}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedZone && BODY_ZONES[selectedZone] && (
              <div className="p-4 rounded-xl bg-[#12151F] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#E2B859]">
                    Neuro-Somatic De-escalation: {BODY_ZONES[selectedZone].name}
                  </h4>
                  <span className="text-[10px] font-mono text-stone-500">
                    Interoceptive Somatic Release
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed font-sans">
                  {BODY_ZONES[selectedZone].guidance}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
