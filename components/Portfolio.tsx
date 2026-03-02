'use client';

import { useWalletConnect } from '@btc-vision/walletconnect';
import { SupportedWallets } from '@btc-vision/walletconnect';
import { usePortfolio } from '../hooks/usePortfolio';
import { formatBigIntToken } from '../utils/signalScore';

const MOTO_DECIMALS = 18;

export function Portfolio() {
  const { address, walletBalance, connectToWallet } = useWalletConnect();
  const isConnected = address !== null;
  const { motoBalance, loading, error } = usePortfolio(address ?? null);

  const btcBalance = walletBalance ? (walletBalance.total / 1e8).toFixed(8) : null;

  if (!isConnected) {
    return (
      <div
        className="rounded-lg p-6 flex flex-col items-center justify-center gap-4 text-center"
        style={{ background: '#0d1117', border: '1px solid #1f2937', minHeight: '200px' }}
      >
        <div className="text-xs font-mono tracking-widest" style={{ color: '#475569' }}>
          PORTFOLIO
        </div>
        <div className="font-mono text-sm" style={{ color: '#374151' }}>
          Connect wallet to view your holdings
        </div>
        <button
          onClick={() => connectToWallet(SupportedWallets.OP_WALLET)}
          className="text-xs font-mono px-4 py-2 rounded transition-all hover:opacity-90"
          style={{ background: '#F7931A', color: '#000', fontWeight: 600 }}
        >
          Connect OP_WALLET
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg p-6 flex flex-col gap-4"
      style={{ background: '#0d1117', border: '1px solid #1f2937' }}
    >
      <div className="text-xs font-mono tracking-widest" style={{ color: '#475569' }}>
        PORTFOLIO
      </div>

      {/* BTC Balance */}
      <div
        className="rounded p-3 flex flex-col gap-1"
        style={{ background: '#161b22', border: '1px solid #1f2937' }}
      >
        <span className="text-xs font-mono" style={{ color: '#475569' }}>
          BTC BALANCE
        </span>
        <span className="font-mono font-bold text-lg tabular-nums" style={{ color: '#F7931A' }}>
          {btcBalance !== null ? `${btcBalance} BTC` : '…'}
        </span>
      </div>

      {/* MOTO Balance */}
      <div
        className="rounded p-3 flex flex-col gap-1"
        style={{ background: '#161b22', border: '1px solid #1f2937' }}
      >
        <span className="text-xs font-mono" style={{ color: '#475569' }}>
          MOTO BALANCE
        </span>
        {loading ? (
          <span className="font-mono text-lg animate-pulse" style={{ color: '#374151' }}>
            ░░░░░░░░
          </span>
        ) : error ? (
          <span className="font-mono text-xs" style={{ color: '#ef4444' }}>
            {error}
          </span>
        ) : motoBalance !== null ? (
          <span className="font-mono font-bold text-lg tabular-nums" style={{ color: '#f1f5f9' }}>
            {formatBigIntToken(motoBalance, MOTO_DECIMALS)} MOTO
          </span>
        ) : (
          <span className="font-mono text-sm" style={{ color: '#475569' }}>
            0.0000 MOTO
          </span>
        )}
      </div>

      {/* Tip */}
      <div className="text-xs font-mono text-center" style={{ color: '#374151' }}>
        Stake MOTO in OPSTAKE to earn yield
      </div>
    </div>
  );
}
