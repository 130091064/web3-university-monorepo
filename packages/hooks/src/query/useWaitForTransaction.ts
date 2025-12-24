import { useCallback } from 'react'
import { usePublicClient } from 'wagmi'
import type { TransactionReceipt } from 'viem'

/**
 * 等待交易确认的 Hook
 * - 封装 publicClient.waitForTransactionReceipt
 * - 默认等待 1 个确认
 */
export function useWaitForTransaction() {
  const publicClient = usePublicClient()

  /**
   * 等待交易收据
   * @param hash 交易哈希
   * @param confirmations 确认数，默认 1
   * @throws 如果 publicClient 不可用
   */
  const waitForReceipt = useCallback(
    async (hash: `0x${string}`, confirmations = 1): Promise<TransactionReceipt> => {
      if (!publicClient) {
        throw new Error('Public client not available')
      }

      return await publicClient.waitForTransactionReceipt({
        hash,
        confirmations,
      })
    },
    [publicClient],
  )

  return { waitForReceipt }
}
