import React, { useEffect, useRef } from 'react';

export type CanvasMode =
  | 'void'
  | 'static'
  | 'prediction'
  | 'coherence'
  | 'collective'
  | 'response'
  | 'observer'
  | 'integration';

interface ParticleCanvasProps {
  mode?: CanvasMode;
  coherenceLevel?: number; // 0 to 1
  readingMode?: boolean;
  className?: string;
  onPointerThoughtTrigger?: () => void;
}

const THOUGHT_FRAGMENTS = [
  'what if I fail',
  'I should have said',
  'will they notice?',
  'too much left undone',
  'is this enough?',
  'why did that happen',
  'am I behind?',
  'what happens next',
  'remember to call',
  'not yet ready',
];

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  mode = 'void',
  coherenceLevel = 0.5,
  readingMode = false,
  className = '',
  onPointerThoughtTrigger,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: -1000, y: -1000, isDown: false });

  useEffect(() => {
    if (readingMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particleCount = isMobile ? 45 : 120;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize particles
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      targetAlpha: number;
      color: string;
      seed: number;
      text?: string;
      textTimer: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (prefersReducedMotion ? 0.1 : 0.4),
        vy: (Math.random() - 0.5) * (prefersReducedMotion ? 0.1 : 0.4),
        radius: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.5 + 0.1,
        targetAlpha: Math.random() * 0.5 + 0.1,
        color: i % 7 === 0 ? '#E2B859' : i % 5 === 0 ? '#38BDF8' : '#F3F4F6',
        seed: Math.random() * 1000,
        text: i < 5 ? THOUGHT_FRAGMENTS[i % THOUGHT_FRAGMENTS.length] : undefined,
        textTimer: Math.random() * 500,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Mode-specific backgrounds and dynamics
      if (mode === 'static') {
        // Radio static simulation
        const imgData = ctx.createImageData(width, Math.min(height, 200));
        for (let p = 0; p < imgData.data.length; p += 4) {
          const noise = Math.random() * 32;
          imgData.data[p] = noise;
          imgData.data[p + 1] = noise;
          imgData.data[p + 2] = noise + 5;
          imgData.data[p + 3] = 12;
        }
        ctx.putImageData(imgData, 0, (Math.sin(time * 3) * 0.5 + 0.5) * (height - 200));
      }

      // Draw subtle background vignette
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      if (mode === 'observer') {
        grad.addColorStop(0, 'rgba(226, 184, 89, 0.08)');
        grad.addColorStop(1, 'rgba(4, 5, 7, 0)');
      } else if (mode === 'coherence') {
        const cohAlpha = 0.04 + coherenceLevel * 0.06;
        grad.addColorStop(0, `rgba(56, 189, 248, ${cohAlpha})`);
        grad.addColorStop(1, 'rgba(4, 5, 7, 0)');
      } else {
        grad.addColorStop(0, 'rgba(226, 184, 89, 0.03)');
        grad.addColorStop(1, 'rgba(4, 5, 7, 0)');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Central ring for Observer or Coherence
      if (mode === 'observer' || mode === 'coherence') {
        ctx.save();
        ctx.beginPath();
        const centerR = isMobile ? 80 : 140;
        const currentR =
          mode === 'coherence'
            ? centerR * (0.8 + coherenceLevel * 0.4) + Math.sin(time * 2) * (15 * (1 - coherenceLevel))
            : centerR + Math.sin(time) * 4;
        ctx.arc(width / 2, height / 2, Math.max(10, currentR), 0, Math.PI * 2);
        ctx.strokeStyle =
          mode === 'observer'
            ? 'rgba(226, 184, 89, 0.25)'
            : `rgba(56, 189, 248, ${0.15 + coherenceLevel * 0.25})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Inner glowing point
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 3, 0, Math.PI * 2);
        ctx.fillStyle = mode === 'observer' ? '#E2B859' : '#38BDF8';
        ctx.fill();
        ctx.restore();
      }

      // Update and draw particles
      particles.forEach((p, idx) => {
        // Mode-driven physics
        if (mode === 'coherence') {
          // Coherence pulls particles toward harmonic orbital paths
          const angle = (idx / particles.length) * Math.PI * 2 + time * 0.2;
          const orbitRadius = 140 + (idx % 4) * 55;
          const targetX = width / 2 + Math.cos(angle) * orbitRadius;
          const targetY = height / 2 + Math.sin(angle) * orbitRadius;

          p.x += (targetX - p.x) * (0.01 + coherenceLevel * 0.05);
          p.y += (targetY - p.y) * (0.01 + coherenceLevel * 0.05);
        } else if (mode === 'prediction') {
          // Grid-like movement
          p.x += p.vx * 0.8;
          p.y += p.vy * 0.8;
          if (idx % 6 === 0) {
            // Draw predictive vectors
            const nextP = particles[(idx + 1) % particles.length];
            const dist = Math.hypot(p.x - nextP.x, p.y - nextP.y);
            if (dist < 130) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(nextP.x, nextP.y);
              ctx.strokeStyle = `rgba(56, 189, 248, ${0.09 * (1 - dist / 130)})`;
              ctx.lineWidth = 0.7;
              ctx.stroke();
            }
          }
        } else if (mode === 'collective') {
          // Collective flow: downward and sideways stream
          p.y += 0.7 + Math.sin(time + p.seed) * 0.2;
          p.x += Math.cos(time * 0.5 + p.seed) * 0.5;
        } else {
          // Default void drift
          p.x += p.vx;
          p.y += p.vy;
        }

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Pointer proximity reaction
        const dx = pointerRef.current.x - p.x;
        const dy = pointerRef.current.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120;
          p.x -= (dx / dist) * force * 3;
          p.y -= (dy / dist) * force * 3;
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (prefersReducedMotion ? 0.4 : 0.7);
        ctx.fill();

        // Render thought fragment texts occasionally in void
        if (p.text && (mode === 'void' || mode === 'static')) {
          p.textTimer += 0.01;
          const textAlpha = Math.max(0, Math.sin(p.textTimer) * 0.22);
          if (textAlpha > 0.02) {
            ctx.save();
            ctx.font = 'italic 13px "Cormorant Garamond", serif';
            ctx.fillStyle = '#E2B859';
            ctx.globalAlpha = textAlpha;
            ctx.fillText(p.text, p.x + 8, p.y - 6);
            ctx.restore();
          }
        }

        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      pointerRef.current.x = clientX;
      pointerRef.current.y = clientY;
    };

    const handlePointerDown = () => {
      pointerRef.current.isDown = true;
      if (onPointerThoughtTrigger) {
        onPointerThoughtTrigger();
      }
    };

    const handlePointerUp = () => {
      pointerRef.current.isDown = false;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [mode, coherenceLevel, readingMode, onPointerThoughtTrigger]);

  if (readingMode) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      data-testid="observer-particle-canvas"
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};
