# ⚡ DeFi Signal — Bitcoin L1 Intelligence Terminal

> Real-time DeFi dashboard for Bitcoin Layer 1, powered by OP_NET smart contracts.

Built for the **OP_NET Vibecoding Challenge** — Week 2: "The DeFi Signal"

## What It Does

DeFi Signal is a Bloomberg Terminal-style dashboard that gives you real-time intelligence on the OP_NET DeFi ecosystem on Bitcoin Layer 1.

### Features

- **Signal Score** — Proprietary composite index (0–100) measuring ecosystem health across 4 dimensions:
  - **TVL** (0–35 pts): Fraction of MOTO supply staked on-chain
  - **Activity** (0–25 pts): EMA gas usage from live RPC
  - **Efficiency** (0–20 pts): Inverse of base gas price (lower fees = stronger signal)
  - **Maturity** (0–20 pts): Protocol age since OP_NET launch
- **Live Ecosystem Stats** — Block height, gas parameters, BTC fee rates — updated every 15 seconds
- **Yield Opportunities Table** — OPSTAKE and NATIVE SWAP with live APY estimates and per-protocol Signal Score
- **Portfolio Panel** — Connect OP_WALLET to see your MOTO balance and BTC holdings in real-time

### Stack

- **Next.js** (App Router) + TypeScript
- **Tailwind CSS** — Bloomberg Terminal dark theme
- **opnet** — Read-only contract interactions via `JSONRpcProvider`
- **@btc-vision/walletconnect** — OP_WALLET integration
- **@btc-vision/bitcoin** — Network configuration

### OP_NET Contracts (Mainnet)

| Contract | Address |
|----------|---------|
| MOTO Token | `0x75bd98b086b71010448ec5722b6020ce1e0f2c09f5d680c84059db1295948cf8` |
| OPSTAKE | `0xaccca433aec3878ebc041cde2a1a2656f928cc404377ebd8339f0bf2cdd66cbe` |
| NATIVE SWAP | `0x035884f9ac2b6ae75d7778553e7d447899e9a82e247d7ced48f22aa102681e70` |

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy

```bash
npm run build
```

Deploy to Vercel with one click — `vercel.json` is pre-configured.

## Architecture

```
services/
  provider.ts      — JSONRpcProvider singleton (never instantiated twice)
  contracts.ts     — Contract instance cache (string-keyed Map)
utils/
  signalScore.ts   — Signal Score algorithm
hooks/
  useEcosystem.ts  — Live ecosystem data, refreshes every 15s
  usePortfolio.ts  — User token balances
components/
  Header.tsx       — Logo + wallet connect + live clock
  SignalMeter.tsx  — SVG gauge + component breakdown bars
  EcosystemStats.tsx — Stats ticker
  YieldTable.tsx   — Protocol table with live APY and Signal Score
  Portfolio.tsx    — User holdings panel
```

## Built With Bob

This app was built using **Bob**, the OP_NET AI development agent at [ai.opnet.org](https://ai.opnet.org).

---

**#opnetvibecode** | [@opnetbtc](https://x.com/opnetbtc) | [@opnetbtc_eco](https://x.com/opnetbtc_eco)
