'use client';

import { useEcosystem } from '../hooks/useEcosystem';
import { Header } from '../components/Header';
import { EcosystemStats } from '../components/EcosystemStats';
import { SignalMeter } from '../components/SignalMeter';
import { YieldTable } from '../components/YieldTable';
import { Portfolio } from '../components/Portfolio';

export default function Home() {
  const ecosystem = useEcosystem();

  return (
    <div className="min-h-screen" style={{ background: '#080b0f' }}>
      <Header />
      <EcosystemStats data={ecosystem} />

      <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* Top row: Signal Meter + Portfolio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <SignalMeter result={ecosystem.signalResult} loading={ecosystem.loading} />
          </div>
          <div className="md:col-span-2 flex flex-col gap-6">
            <Portfolio />

            {/* Quick stats panel */}
            <div
              className="rounded-lg p-4 grid grid-cols-2 gap-3"
              style={{ background: '#0d1117', border: '1px solid #1f2937' }}
            >
              <div className="text-xs font-mono col-span-2 tracking-widest mb-1" style={{ color: '#475569' }}>
                ECOSYSTEM METRICS
              </div>
              <QuickStat
                label="STAKING RATIO"
                value={
                  ecosystem.motoTotalSupply && ecosystem.stakingBalance
                    ? `${((Number(ecosystem.stakingBalance * 10_000n / ecosystem.motoTotalSupply) / 100)).toFixed(2)}%`
                    : ecosystem.loading ? '…' : 'N/A'
                }
                color="#F7931A"
              />
              <QuickStat
                label="BLOCK HEIGHT"
                value={ecosystem.blockNumber ? `#${ecosystem.blockNumber.toLocaleString()}` : '…'}
                color="#3b82f6"
              />
              <QuickStat
                label="BTC FEE (LOW)"
                value={ecosystem.gasParams ? `${ecosystem.gasParams.bitcoin.recommended.low} sat/vb` : '…'}
                color="#22c55e"
              />
              <QuickStat
                label="LAST UPDATED"
                value={ecosystem.lastUpdated ? ecosystem.lastUpdated.toLocaleTimeString() : '…'}
                color="#94a3b8"
              />
            </div>
          </div>
        </div>

        {/* Yield Opportunities */}
        <YieldTable ecosystem={ecosystem} />

        {/* Footer */}
        <footer className="text-center py-4">
          <p className="text-xs font-mono" style={{ color: '#374151' }}>
            Built on{' '}
            <a
              href="https://opnet.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#F7931A' }}
            >
              OP_NET
            </a>{' '}
            · Bitcoin Layer 1 · #opnetvibecode
          </p>
        </footer>
      </main>
    </div>
  );
}

function QuickStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="rounded p-3 flex flex-col gap-1"
      style={{ background: '#161b22', border: '1px solid #1f293750' }}
    >
      <span className="text-xs font-mono" style={{ color: '#475569' }}>
        {label}
      </span>
      <span className="font-mono font-bold text-sm tabular-nums" style={{ color }}>
        {value}
      </span>
    </div>
  );
}
