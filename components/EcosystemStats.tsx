'use client';

import type { EcosystemData } from '../hooks/useEcosystem';

interface Props {
  data: EcosystemData;
}

function Stat({ label, value, blink }: { label: string; value: string; blink?: boolean }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2" style={{ borderRight: '1px solid #1f2937' }}>
      <span className="text-xs font-mono" style={{ color: '#475569' }}>
        {label}
      </span>
      <span
        className={`text-xs font-mono font-semibold tabular-nums ${blink ? 'animate-pulse' : ''}`}
        style={{ color: '#f1f5f9' }}
      >
        {value}
      </span>
    </div>
  );
}

export function EcosystemStats({ data }: Props) {
  const { blockNumber, gasParams, loading } = data;

  const blk = blockNumber ? `#${blockNumber.toLocaleString()}` : '…';
  const baseGas = gasParams
    ? `${(Number(gasParams.baseGas) / 1_000_000).toFixed(2)}M`
    : '…';
  const btcFee = gasParams
    ? `${gasParams.bitcoin.recommended.low} sat/vb`
    : '…';
  const gasUsedPct = gasParams
    ? `${((Number(gasParams.gasUsed) / Number(gasParams.targetGasLimit)) * 100).toFixed(2)}%`
    : '…';

  return (
    <div
      className="overflow-x-auto"
      style={{ background: '#0d1117', borderBottom: '1px solid #1f2937' }}
    >
      <div className="flex items-stretch min-w-max">
        <Stat label="BLK" value={blk} blink={loading} />
        <Stat label="BASE GAS" value={baseGas} />
        <Stat label="BTC FEE" value={btcFee} />
        <Stat label="GAS USED" value={gasUsedPct} />
        <Stat label="RPC" value="mainnet.opnet.org" />
        <div className="flex items-center gap-2 px-4 py-2">
          <span className="text-xs font-mono" style={{ color: '#475569' }}>
            STATUS
          </span>
          <span className="text-xs font-mono font-semibold" style={{ color: '#22c55e' }}>
            ● ONLINE
          </span>
        </div>
      </div>
    </div>
  );
}
