'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Address } from '@btc-vision/transaction';
import { CONTRACTS } from '../config/protocols';
import { getTokenContract } from '../services/contracts';

export interface PortfolioData {
  motoBalance: bigint | null;
  loading: boolean;
  error: string | null;
}

export function usePortfolio(address: Address | null) {
  const [data, setData] = useState<PortfolioData>({
    motoBalance: null,
    loading: false,
    error: null,
  });

  const fetchPortfolio = useCallback(async () => {
    if (!address) {
      setData({ motoBalance: null, loading: false, error: null });
      return;
    }

    setData((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const moto = getTokenContract(CONTRACTS.MOTO);
      const result = await moto.balanceOf(address);
      setData({ motoBalance: result.properties.balance, loading: false, error: null });
    } catch (err) {
      setData({
        motoBalance: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch balance',
      });
    }
  }, [address]);

  useEffect(() => {
    fetchPortfolio();
    const id = setInterval(fetchPortfolio, 30_000);
    return () => clearInterval(id);
  }, [fetchPortfolio]);

  return { ...data, refresh: fetchPortfolio };
}
