'use client';

import { useWalletConnect, SupportedWallets } from '@btc-vision/walletconnect';
import { LiveClock } from './LiveClock';

function shortenAddr(addr: string): string {
  return addr.length > 10 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
}

export function Header() {
  const { walletAddress, connectToWallet, disconnect } = useWalletConnect();
  const connected = walletAddress !== null;

  const handleConnect = () => connectToWallet(SupportedWallets.OP_WALLET);

  return (
    <header
      style={{ borderBottom: '1px solid #1f2937', background: '#0d1117' }}
      className="sticky top-0 z-50 px-4 py-2"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-lg" style={{ color: '#F7931A' }}>
            ⚡ DEFI SIGNAL
          </span>
          <span
            className="text-xs font-mono px-2 py-0.5 rounded"
            style={{ background: '#161b22', color: '#F7931A', border: '1px solid #F7931A40' }}
          >
            ● TESTNET
          </span>
        </div>

        {/* Center: clock */}
        <LiveClock />

        {/* Right: wallet */}
        <div>
          {connected && walletAddress ? (
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-mono px-3 py-1.5 rounded"
                style={{ background: '#161b22', color: '#94a3b8', border: '1px solid #1f2937' }}
              >
                {shortenAddr(walletAddress)}
              </span>
              <button
                onClick={disconnect}
                className="text-xs font-mono px-3 py-1.5 rounded transition-colors"
                style={{
                  background: 'transparent',
                  color: '#ef4444',
                  border: '1px solid #ef444440',
                }}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="text-xs font-mono px-4 py-1.5 rounded font-semibold transition-all hover:opacity-90"
              style={{ background: '#F7931A', color: '#000' }}
            >
              Connect OP_WALLET
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
