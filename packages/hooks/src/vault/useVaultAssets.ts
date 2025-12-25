import { useCallback, useMemo, useState } from 'react';
import { usePublicClient } from 'wagmi';
import type { VaultAssetsResult, UseVaultAssetsConfig } from './types';
import { DEFAULT_USDT_DECIMALS } from './types';
import { formatApyFromRay } from './utils';

export function useVaultAssets(config: UseVaultAssetsConfig): VaultAssetsResult {
  const publicClient = usePublicClient();

  const {
    address,
    isConnected,
    usdtAddress,
    usdtAbi,
    vaultAddress,
    vaultAbi,
    decimals = DEFAULT_USDT_DECIMALS,
  } = config;

  const [userUsdtBalance, setUserUsdtBalance] = useState<bigint | null>(null);
  const [userVaultBalance, setUserVaultBalance] = useState<bigint | null>(null);
  const [totalAssets, setTotalAssets] = useState<bigint | null>(null);
  const [currentIndex, setCurrentIndex] = useState<bigint | null>(null);
  const [liquidityRate, setLiquidityRate] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!publicClient || !address || !isConnected) return;

    setIsLoading(true);
    try {
      const [usdtBal, vaultBal, totalAssets_, index_, rate_] = await Promise.all([
        publicClient.readContract({
          address: usdtAddress,
          abi: usdtAbi,
          functionName: 'balanceOf',
          args: [address],
        }),
        publicClient.readContract({
          address: vaultAddress,
          abi: vaultAbi,
          functionName: 'balanceOf',
          args: [address],
        }),
        publicClient.readContract({
          address: vaultAddress,
          abi: vaultAbi,
          functionName: 'totalAssets',
        }),
        publicClient.readContract({
          address: vaultAddress,
          abi: vaultAbi,
          functionName: 'getCurrentIndex',
        }),
        publicClient.readContract({
          address: vaultAddress,
          abi: vaultAbi,
          functionName: 'liquidityRate',
        }),
      ]);

      setUserUsdtBalance(usdtBal as bigint);
      setUserVaultBalance(vaultBal as bigint);
      setTotalAssets(totalAssets_ as bigint);
      setCurrentIndex(index_ as bigint);
      setLiquidityRate(rate_ as bigint);
    } catch (err) {
      console.error('refresh vault assets failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [
    publicClient,
    address,
    isConnected,
    usdtAddress,
    usdtAbi,
    vaultAddress,
    vaultAbi,
  ]);

  const apyDisplay = useMemo(() => formatApyFromRay(liquidityRate), [liquidityRate]);

  return {
    userUsdtBalance,
    userVaultBalance,
    totalAssets,
    currentIndex,
    liquidityRate,
    apyDisplay,
    isLoading,
    refresh,
    decimals,
  };
}
