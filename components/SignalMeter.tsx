'use client';

import type { SignalResult } from '../utils/signalScore';

interface Props {
  result: SignalResult | null;
  loading: boolean;
}

function GaugeArc({ score, color }: { score: number; color: string }) {
  const R = 80;
  const cx = 100;
  const cy = 100;
  const startAngle = -210; // degrees, starting from bottom-left
  const totalArc = 240; // degrees sweep
  const fillAngle = (score / 100) * totalArc;

  function polar(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(startDeg: number, endDeg: number, r: number): string {
    const s = polar(cx, cy, r, startDeg);
    const e = polar(cx, cy, r, endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const bgStart = startAngle;
  const bgEnd = startAngle + totalArc;
  const fillEnd = startAngle + fillAngle;

  return (
    <svg viewBox="0 0 200 200" className="w-52 h-52">
      {/* Background arc */}
      <path
        d={describeArc(bgStart, bgEnd, R)}
        fill="none"
        stroke="#1f2937"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Fill arc */}
      {score > 0 && (
        <path
          d={describeArc(bgStart, fillEnd, R)}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      )}
      {/* Tick marks */}
      {[0, 25, 50, 75, 100].map((pct) => {
        const angle = startAngle + (pct / 100) * totalArc;
        const inner = polar(cx, cy, R - 12, angle);
        const outer = polar(cx, cy, R + 2, angle);
        return (
          <line
            key={pct}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            stroke="#374151"
            strokeWidth="2"
          />
        );
      })}
      {/* Score text */}
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontFamily="monospace"
        fontSize="36"
        fontWeight="bold"
      >
        {score}
      </text>
      <text
        x={cx}
        y={cy + 22}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#94a3b8"
        fontFamily="monospace"
        fontSize="10"
        letterSpacing="2"
      >
        / 100
      </text>
    </svg>
  );
}

function ComponentBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = (value / max) * 100;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs font-mono" style={{ color: '#94a3b8' }}>
        <span>{label}</span>
        <span style={{ color }}>{Math.round(value)}/{max}</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: '#1f2937' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function SignalMeter({ result, loading }: Props) {
  const score = result?.score ?? 0;
  const label = result?.label ?? '---';
  const color = result?.hex ?? '#475569';

  return (
    <div
      className="rounded-lg p-6 flex flex-col items-center gap-4"
      style={{ background: '#0d1117', border: '1px solid #1f2937' }}
    >
      <div className="text-xs font-mono tracking-widest" style={{ color: '#475569' }}>
        SIGNAL SCORE
      </div>

      <div className="relative">
        {loading && !result ? (
          <div className="w-52 h-52 flex items-center justify-center">
            <span className="text-4xl font-mono animate-pulse" style={{ color: '#475569' }}>
              ░░░
            </span>
          </div>
        ) : (
          <GaugeArc score={score} color={color} />
        )}
      </div>

      <div
        className="text-lg font-mono font-bold tracking-widest px-4 py-1 rounded"
        style={{ color, background: `${color}15`, border: `1px solid ${color}40` }}
      >
        {label}
      </div>

      {result && (
        <div className="w-full flex flex-col gap-2 mt-2">
          <ComponentBar label="TVL" value={result.components.tvl} max={35} color="#F7931A" />
          <ComponentBar label="ACTIVITY" value={result.components.activity} max={25} color="#3b82f6" />
          <ComponentBar label="EFFICIENCY" value={result.components.efficiency} max={20} color="#a855f7" />
          <ComponentBar label="MATURITY" value={result.components.maturity} max={20} color="#22c55e" />
        </div>
      )}

      <div className="text-xs font-mono text-center" style={{ color: '#374151' }}>
        Updates every 15s
      </div>
    </div>
  );
}
