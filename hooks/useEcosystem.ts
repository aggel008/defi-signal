'use client';

import { useCallback, useEffect, useState } from 'react';
import { Address } from '@btc-vision/transaction';
import type { BlockGasParameters } from 'opnet';
import { CONTRACTS, OPNET_LAUNCH_DATE } from '../config/protocols';
import { getTokenContract } from '../services/contracts';
import { getProvider } from '../services/provider';
import { calculateSignalScore, type SignalResult } from '../utils/signalScore';

export interface EcosystemData {
  blockNumber: bigint | null;
  gasParams: BlockGasParameters | null;
  motoTotalSupply: bigint | null;
  motoDecimals: number;
  stakingBalance: bigint | null;
  signalResult: SignalResult | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

const REFRESH_MS = 15_000;

export function useEcosystem() {
  const [data, setData] = useState<EcosystemData>({
    blockNumber: null,
    gasParams: null,
    motoTotalSupply: null,
    motoDecimals: 18,
    stakingBalance: null,
    signalResult: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const fetchData = useCallback(async () => {
    try {
      const provider = getProvider();
      const moto = getTokenContract(CONTRACTS.MOTO);
      const stakingAddr = Address.fromString(CONTRACTS.STAKING);

      const [blockNumber, gasParams, metaResult, stakingBalResult] = await Promise.all([
        provider.getBlockNumber(),
        provider.gasParameters(),
        moto.metadata(),
        moto.balanceOf(stakingAddr),
      ]);

      const { totalSupply, decimals } = metaResult.properties;
      const stakingBalance = stakingBalResult.properties.balance;

      const stakingRatio =
        totalSupply > 0n ? Number((stakingBalance * 10_000n) / totalSupply) / 10_000 : 0;

      const maturityMonths =
        (Date.now() - OPNET_LAUNCH_DATE.getTime()) / (1_000 * 60 * 60 * 24 * 30);

      const signalResult = calculateSignalScore({
        stakingRatio,
        emaGas: Number(gasParams.ema),
        baseGas: Number(gasParams.baseGas),
        maturityMonths,
      });

      setData({
        blockNumber,
        gasParams,
        motoTotalSupply: totalSupply,
        motoDecimals: decimals,
        stakingBalance,
        signalResult,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (err) {
      setData((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'RPC error',
      }));
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, REFRESH_MS);
    return () => clearInterval(id);
  }, [fetchData]);

  return { ...data, refresh: fetchData };
}
