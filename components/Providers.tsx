'use client';

import { WalletConnectProvider } from '@btc-vision/walletconnect';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <WalletConnectProvider theme="dark">{children}</WalletConnectProvider>;
}
