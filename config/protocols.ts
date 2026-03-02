import { networks } from '@btc-vision/bitcoin';

export const NETWORK = networks.opnetTestnet;
export const MAINNET_RPC = 'https://testnet.opnet.org';

export const CONTRACTS = {
  MOTO: '0xfd4473840751d58d9f8b73bdd57d6c5260453d5518bd7cd02d0a4cf3df9bf4dd',
  STAKING: '0xaccca433aec3878ebc041cde2a1a2656f928cc404377ebd8339f0bf2cdd66cbe',
  NATIVE_SWAP: '0x0e6ff1f2d7db7556cb37729e3738f4dae82659b984b2621fab08e1111b1b937a',
} as const;

export type ProtocolStatus = 'live' | 'beta' | 'soon';

export interface Protocol {
  id: string;
  name: string;
  type: 'Staking' | 'DEX' | 'Yield';
  address: string;
  tvlLabel: string;
  status: ProtocolStatus;
  maturityMonths: number;
  description: string;
}

export const PROTOCOLS: Protocol[] = [
  {
    id: 'opstake',
    name: 'OPSTAKE',
    type: 'Staking',
    address: CONTRACTS.STAKING,
    tvlLabel: 'MOTO Staked',
    status: 'live',
    maturityMonths: 14,
    description: 'Auto-compound MOTO staking on Bitcoin L1',
  },
  {
    id: 'nativeswap',
    name: 'NATIVE SWAP',
    type: 'DEX',
    address: CONTRACTS.NATIVE_SWAP,
    tvlLabel: 'BTC/MOTO LP',
    status: 'live',
    maturityMonths: 12,
    description: 'Native BTC ↔ MOTO decentralized exchange',
  },
];

export const OPNET_LAUNCH_DATE = new Date('2024-11-01');
