import React from 'react';
import { DiagnosticRadarData } from '../types';

interface RadarChartProps {
  data: DiagnosticRadarData;
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, size = 320 }) => {
  const center = size / 2;
  const radius = size * 0.38;

  const axes = [
    { label: 'Defusion', value: data.defusion, key: 'defusion', desc: 'Separation from thought identification' },
    { label: 'Interoception', value: data.interoception, key: 'interoception', desc: 'Somatic bodily resolution' },
    { label: 'Non-Reactivity', value: data.nonReactivity, key: 'nonReactivity', desc: 'Pause between trigger and impulse' },
    { label: 'Predictive Plasticity', value: data.predictiveFlexibility, key: 'predictiveFlexibility', desc: 'Bayesian cognitive flexibility' },
    { label: 'Observer Self', value: data.contextualSelf, key: 'contextualSelf', desc: 'Experiential awareness of pure witness' },
    { label: 'Present Gating', value: data.presentGating, key: 'presentGating', desc: 'Sensory attention fidelity' },
  ];

  const totalAxes = axes.length;
  const angleStep = (Math.PI * 2) / totalAxes;

  // Concentric polygon rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  const getCoordinates = (index: number, valPercent: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = radius * (valPercent / 100);
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Generate user polygon points
  const userPoints = axes
    .map((axis, i) => {
      const { x, y } = getCoordinates(i, Math.max(10, axis.value));
      return `${x},${y}`;
    })
    .join(' ');

  // Benchmark / healthy baseline polygon (70% across all axes)
  const benchmarkPoints = axes
    .map((_, i) => {
      const { x, y } = getCoordinates(i, 70);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="relative flex flex-col items-center select-none">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        aria-label="6-Axis Psychological Diagnostic Radar Chart"
      >
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E2B859" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#040507" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="userPolygonFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2B859" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Ambient Center Glow */}
        <circle cx={center} cy={center} r={radius * 1.1} fill="url(#radarGlow)" />

        {/* Concentric Grid Polygons */}
        {rings.map((ring, ringIdx) => {
          const ringPoints = axes
            .map((_, i) => {
              const { x, y } = getCoordinates(i, ring * 100);
              return `${x},${y}`;
            })
            .join(' ');

          return (
            <g key={`ring_${ringIdx}`}>
              <polygon
                points={ringPoints}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
                strokeDasharray={ring === 1.0 ? 'none' : '3 3'}
              />
              <text
                x={center + 5}
                y={center - radius * ring - 3}
                fill="rgba(255, 255, 255, 0.25)"
                fontSize="9"
                fontFamily="monospace"
              >
                {Math.round(ring * 100)}%
              </text>
            </g>
          );
        })}

        {/* Axis Spokes */}
        {axes.map((_, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              key={`spoke_${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          );
        })}

        {/* Benchmark Reference Polygon (dashed cyan) */}
        <polygon
          points={benchmarkPoints}
          fill="none"
          stroke="#38BDF8"
          strokeWidth="1"
          strokeDasharray="4 4"
          strokeOpacity="0.35"
        />

        {/* User Data Polygon */}
        <polygon
          points={userPoints}
          fill="url(#userPolygonFill)"
          stroke="#E2B859"
          strokeWidth="2"
          className="transition-all duration-700 ease-out drop-shadow-[0_0_12px_rgba(226,184,89,0.5)]"
        />

        {/* User Data Points */}
        {axes.map((axis, i) => {
          const { x, y } = getCoordinates(i, Math.max(10, axis.value));
          return (
            <g key={`dot_${i}`} className="group cursor-pointer">
              <circle
                cx={x}
                cy={y}
                r="4.5"
                fill="#E2B859"
                stroke="#040507"
                strokeWidth="1.5"
                className="transition-all hover:r-6 hover:fill-white"
              />
            </g>
          );
        })}

        {/* Axis Labels */}
        {axes.map((axis, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelDist = radius + 26;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);

          const isTopOrBottom = Math.abs(Math.sin(angle)) > 0.8;
          const anchor = isTopOrBottom ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end';

          return (
            <text
              key={`label_${i}`}
              x={lx}
              y={ly}
              textAnchor={anchor}
              fill="#D1D5DB"
              fontSize="11"
              fontFamily="sans-serif"
              fontWeight="500"
              className="tracking-tight hover:fill-[#E2B859] transition-colors"
            >
              {axis.label} ({axis.value}%)
            </text>
          );
        })}
      </svg>

      <div className="flex items-center gap-5 mt-4 text-[11px] font-mono text-stone-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E2B859] inline-block shadow-[0_0_8px_#E2B859]" />
          <span>Your Metacognitive Index</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 border-t border-dashed border-[#38BDF8] inline-block" />
          <span>Optimal Plasticity Benchmark (70%)</span>
        </div>
      </div>
    </div>
  );
};
