import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '../components/Providers';

export const metadata: Metadata = {
  title: 'DeFi Signal — Bitcoin L1 Intelligence Terminal',
  description:
    'Real-time DeFi intelligence dashboard for Bitcoin Layer 1. Signal Score, yield opportunities, and portfolio tracking powered by OP_NET.',
  keywords: ['Bitcoin', 'DeFi', 'OP_NET', 'MOTO', 'OPSTAKE', 'Bitcoin L1'],
  openGraph: {
    title: 'DeFi Signal — Bitcoin L1 Intelligence Terminal',
    description: 'Real-time DeFi dashboard powered by OP_NET smart contracts on Bitcoin L1.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
