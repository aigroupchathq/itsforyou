/**
 * Generative Web Audio soundscape for The Observer.
 * Uses detuned oscillators, gentle lowpass filtration, slow LFO swell,
 * and a resonant contemplative chime for thought awareness moments.
 */

class SoundscapeService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private isRunning: boolean = false;
  private isMuted: boolean = false;
  private currentVolume: number = 0.5;
  private currentMode: 'drone' | 'alpha' | 'theta' | 'solfeggio' | 'brown' = 'drone';
  private noiseNode: AudioNode | null = null;
  private binauralOscLeft: OscillatorNode | null = null;
  private binauralOscRight: OscillatorNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMode(mode: 'drone' | 'alpha' | 'theta' | 'solfeggio' | 'brown') {
    this.currentMode = mode;
    if (this.isRunning) {
      this.stop();
      setTimeout(() => {
        this.start();
      }, 300);
    }
  }

  public getMode() {
    return this.currentMode;
  }

  public start() {
    try {
      this.initContext();
      if (!this.ctx) return;

      if (this.isRunning) return;

      // Master output node
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.currentVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Drone Gain
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.droneGain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 2.0);

      // Lowpass filter
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(140, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

      // Slow LFO for filter breath (breathing cycle: 0.08Hz ~ 12s)
      this.lfo = this.ctx.createOscillator();
      this.lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.setValueAtTime(45, this.ctx.currentTime);
      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.filter.frequency);

      if (this.currentMode === 'alpha') {
        // 10 Hz Alpha beat: 200 Hz Base, 210 Hz Carrier
        this.osc1 = this.ctx.createOscillator();
        this.osc1.type = 'sine';
        this.osc1.frequency.setValueAtTime(200, this.ctx.currentTime);

        this.osc2 = this.ctx.createOscillator();
        this.osc2.type = 'sine';
        this.osc2.frequency.setValueAtTime(210, this.ctx.currentTime);

        this.subOsc = this.ctx.createOscillator();
        this.subOsc.type = 'sine';
        this.subOsc.frequency.setValueAtTime(55, this.ctx.currentTime);

        this.filter.frequency.setValueAtTime(260, this.ctx.currentTime);
      } else if (this.currentMode === 'theta') {
        // 6 Hz Theta beat: 150 Hz Base, 156 Hz Carrier
        this.osc1 = this.ctx.createOscillator();
        this.osc1.type = 'sine';
        this.osc1.frequency.setValueAtTime(150, this.ctx.currentTime);

        this.osc2 = this.ctx.createOscillator();
        this.osc2.type = 'sine';
        this.osc2.frequency.setValueAtTime(156, this.ctx.currentTime);

        this.subOsc = this.ctx.createOscillator();
        this.subOsc.type = 'sine';
        this.subOsc.frequency.setValueAtTime(40, this.ctx.currentTime);

        this.filter.frequency.setValueAtTime(220, this.ctx.currentTime);
      } else if (this.currentMode === 'solfeggio') {
        // 432 Hz Solfeggio Harmonic Drone
        this.osc1 = this.ctx.createOscillator();
        this.osc1.type = 'sine';
        this.osc1.frequency.setValueAtTime(216, this.ctx.currentTime); // Sub-octave 216

        this.osc2 = this.ctx.createOscillator();
        this.osc2.type = 'triangle';
        this.osc2.frequency.setValueAtTime(432, this.ctx.currentTime);

        this.subOsc = this.ctx.createOscillator();
        this.subOsc.type = 'sine';
        this.subOsc.frequency.setValueAtTime(108, this.ctx.currentTime);

        this.filter.frequency.setValueAtTime(480, this.ctx.currentTime);
      } else if (this.currentMode === 'brown') {
        // Brown noise approximation + deep ground
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // Gain compensation
        }
        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        whiteNoise.connect(this.filter);
        whiteNoise.start();
        this.noiseNode = whiteNoise;

        this.osc1 = this.ctx.createOscillator();
        this.osc1.type = 'sine';
        this.osc1.frequency.setValueAtTime(50, this.ctx.currentTime);
        this.osc2 = this.ctx.createOscillator();
        this.osc2.frequency.setValueAtTime(100, this.ctx.currentTime);
        this.subOsc = this.ctx.createOscillator();
        this.subOsc.frequency.setValueAtTime(32, this.ctx.currentTime);
        this.filter.frequency.setValueAtTime(120, this.ctx.currentTime);
      } else {
        // Standard Void Ground Drone: 55 Hz & 110 Hz
        this.osc1 = this.ctx.createOscillator();
        this.osc1.type = 'sine';
        this.osc1.frequency.setValueAtTime(55, this.ctx.currentTime);

        this.osc2 = this.ctx.createOscillator();
        this.osc2.type = 'triangle';
        this.osc2.frequency.setValueAtTime(110.4, this.ctx.currentTime);

        this.subOsc = this.ctx.createOscillator();
        this.subOsc.type = 'sine';
        this.subOsc.frequency.setValueAtTime(43.65, this.ctx.currentTime);
      }

      // Connect drone oscillators through filter to drone gain
      this.osc1.connect(this.filter);
      this.osc2.connect(this.filter);
      this.subOsc.connect(this.filter);
      this.filter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      this.osc1.start();
      this.osc2.start();
      this.subOsc.start();
      this.lfo.start();

      this.isRunning = true;
    } catch (e) {
      console.warn('Audio initialisation deferred until user gesture:', e);
    }
  }

  public stop() {
    if (!this.isRunning || !this.ctx) return;
    try {
      if (this.droneGain) {
        this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, this.ctx.currentTime);
        this.droneGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
      }
      setTimeout(() => {
        try {
          this.osc1?.stop();
          this.osc2?.stop();
          this.subOsc?.stop();
          this.lfo?.stop();
          if (this.noiseNode) {
            (this.noiseNode as any).stop?.();
            this.noiseNode.disconnect();
            this.noiseNode = null;
          }
          this.osc1?.disconnect();
          this.osc2?.disconnect();
          this.subOsc?.disconnect();
          this.filter?.disconnect();
          this.isRunning = false;
        } catch {}
      }, 350);
    } catch {}
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!this.ctx || !this.masterGain) return;
    const target = muted ? 0.0001 : this.currentVolume;
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(target, this.ctx.currentTime + 0.15);
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.001, this.currentVolume), this.ctx.currentTime + 0.1);
  }

  /**
   * Plays a delicate, crystalline harmonic tone when an awareness moment or thought is caught.
   */
  public playAwarenessChime(pitch: number = 432) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      // Gentle harmonic decay
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.08 * this.currentVolume, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.3);
    } catch {}
  }

  public toggle() {
    if (this.isRunning && !this.isMuted) {
      this.setMuted(true);
      return true;
    } else if (this.isRunning && this.isMuted) {
      this.setMuted(false);
      return false;
    } else {
      this.start();
      this.setMuted(false);
      return false;
    }
  }

  public getStatus() {
    return {
      isRunning: this.isRunning,
      isMuted: this.isMuted,
      volume: this.currentVolume,
    };
  }
}

export const soundscape = new SoundscapeService();
