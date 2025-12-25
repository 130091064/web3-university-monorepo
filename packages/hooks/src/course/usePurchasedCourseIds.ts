import { useCallback, useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import type { PurchasedCourseIdsResult, UsePurchasedCourseIdsConfig } from './types';

export function usePurchasedCourseIds(
  config: UsePurchasedCourseIdsConfig
): PurchasedCourseIdsResult {
  const publicClient = usePublicClient();

  const {
    userAddress,
    enabled = true,
    marketplaceAddress,
    marketplaceAbi,
    functionName = 'getPurchasedCourseIds',
  } = config;

  const [ids, setIds] = useState<bigint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!publicClient || !userAddress || !enabled) return;

    try {
      setLoading(true);
      setError(null);

      const result = (await publicClient.readContract({
        address: marketplaceAddress,
        abi: marketplaceAbi,
        functionName,
        args: [userAddress],
      })) as bigint[];

      setIds(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load purchased courses';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [publicClient, userAddress, enabled, marketplaceAddress, marketplaceAbi, functionName]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ids, loading, error, refresh };
}
