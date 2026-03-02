export interface SignalInputs {
  /** Fraction of MOTO totalSupply that is staked (0–1) */
  stakingRatio: number;
  /** EMA gas from gasParameters() RPC */
  emaGas: number;
  /** baseGas from gasParameters() RPC */
  baseGas: number;
  /** Months since protocol launched */
  maturityMonths: number;
}

export interface SignalComponents {
  tvl: number;
  activity: number;
  efficiency: number;
  maturity: number;
}

export interface SignalResult {
  score: number;
  label: 'WEAK' | 'MODERATE' | 'STRONG' | 'BULLISH';
  hex: string;
  components: SignalComponents;
}

/**
 * Composite DeFi Signal Score (0–100).
 *
 * Components:
 *  TVL        0–35  staking ratio (50%+ staked = max)
 *  Activity   0–25  EMA gas usage normalised to 200k
 *  Efficiency 0–20  inverse log of baseGas (lower fee = higher score)
 *  Maturity   0–20  capped at 12 months since launch
 */
export function calculateSignalScore(inputs: SignalInputs): SignalResult {
  const tvl = Math.min(35, inputs.stakingRatio * 70);

  const activity = Math.min(25, (inputs.emaGas / 200_000) * 25);

  const logBase = Math.log10(Math.max(1, inputs.baseGas / 1_000_000));
  const efficiency = Math.max(0, Math.min(20, 20 - logBase * 4));

  const maturity = Math.min(20, (inputs.maturityMonths / 12) * 20);

  const score = Math.round(tvl + activity + efficiency + maturity);

  if (score >= 86) {
    return { score, label: 'BULLISH', hex: '#F7931A', components: { tvl, activity, efficiency, maturity } };
  }
  if (score >= 65) {
    return { score, label: 'STRONG', hex: '#22c55e', components: { tvl, activity, efficiency, maturity } };
  }
  if (score >= 40) {
    return { score, label: 'MODERATE', hex: '#eab308', components: { tvl, activity, efficiency, maturity } };
  }
  return { score, label: 'WEAK', hex: '#ef4444', components: { tvl, activity, efficiency, maturity } };
}

/** Protocol-level signal (0–100) for a single yield opportunity */
export function protocolSignal(apy: number, tvlRatio: number, maturityMonths: number): number {
  const apyScore = Math.min(40, (apy / 50) * 40);
  const tvlScore = Math.min(40, tvlRatio * 80);
  const matScore = Math.min(20, (maturityMonths / 12) * 20);
  return Math.round(apyScore + tvlScore + matScore);
}

export function signalBadgeColor(score: number): string {
  if (score >= 86) return '#F7931A';
  if (score >= 65) return '#22c55e';
  if (score >= 40) return '#eab308';
  return '#ef4444';
}

export function formatBigIntToken(value: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals);
  const whole = value / divisor;
  const frac = value % divisor;
  const fracStr = frac.toString().padStart(decimals, '0').slice(0, 4);
  return `${whole.toLocaleString()}.${fracStr}`;
}
