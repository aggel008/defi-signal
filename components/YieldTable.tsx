'use client';

import { PROTOCOLS } from '../config/protocols';
import { protocolSignal, signalBadgeColor, formatBigIntToken } from '../utils/signalScore';
import type { EcosystemData } from '../hooks/useEcosystem';

interface Props {
  ecosystem: EcosystemData;
}

function SignalBadge({ score }: { score: number }) {
  const color = signalBadgeColor(score);
  return (
    <span
      className="text-xs font-mono font-bold px-2 py-0.5 rounded tabular-nums"
      style={{ color, background: `${color}15`, border: `1px solid ${color}40` }}
    >
      {score}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    live: { label: 'LIVE', color: '#22c55e' },
    beta: { label: 'BETA', color: '#eab308' },
    soon: { label: 'SOON', color: '#475569' },
  };
  const { label, color } = map[status] ?? map.live;
  return (
    <span className="text-xs font-mono" style={{ color }}>
      ● {label}
    </span>
  );
}

export function YieldTable({ ecosystem }: Props) {
  const { stakingBalance, motoTotalSupply, motoDecimals, loading } = ecosystem;

  const stakingRatio =
    motoTotalSupply && motoTotalSupply > 0n && stakingBalance
      ? Number((stakingBalance * 10_000n) / motoTotalSupply) / 10_000
      : 0;

  const opstakeApy = stakingRatio > 0 ? Math.max(4, 20 - stakingRatio * 30) : null;
  const swapApy = 8.4; // indicative

  const rows = PROTOCOLS.map((p) => {
    const apy = p.id === 'opstake' ? opstakeApy : swapApy;
    const tvlRatio = p.id === 'opstake' ? stakingRatio : 0.15;
    const signal = protocolSignal(apy ?? 0, tvlRatio, p.maturityMonths);

    let tvlStr = '…';
    if (!loading) {
      if (p.id === 'opstake' && stakingBalance !== null) {
        tvlStr = `${formatBigIntToken(stakingBalance, motoDecimals)} MOTO`;
      } else {
        tvlStr = 'N/A';
      }
    }

    return { ...p, apy, signal, tvlStr };
  });

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ background: '#0d1117', border: '1px solid #1f2937' }}
    >
      <div
        className="px-4 py-3 text-xs font-mono tracking-widest"
        style={{ color: '#475569', borderBottom: '1px solid #1f2937' }}
      >
        YIELD OPPORTUNITIES
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #1f2937' }}>
              {['PROTOCOL', 'TYPE', 'APY', 'TVL', 'SIGNAL', 'STATUS'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 text-left text-xs font-mono"
                  style={{ color: '#475569' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.id}
                className="transition-colors cursor-pointer"
                style={{
                  borderBottom: i < rows.length - 1 ? '1px solid #111827' : 'none',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.background = '#161b22';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.background = 'transparent';
                }}
              >
                <td className="px-4 py-3">
                  <div className="font-mono font-bold text-sm" style={{ color: '#f1f5f9' }}>
                    {row.name}
                  </div>
                  <div className="font-mono text-xs" style={{ color: '#475569' }}>
                    {row.description}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{ color: '#F7931A', background: '#F7931A15', border: '1px solid #F7931A30' }}
                  >
                    {row.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono font-bold text-sm" style={{ color: '#22c55e' }}>
                    {row.apy !== null ? `${row.apy.toFixed(1)}%` : loading ? '…' : 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs tabular-nums" style={{ color: '#94a3b8' }}>
                    {loading ? '…' : row.tvlStr}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <SignalBadge score={row.signal} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
