import { useChainId, useConnection } from 'wagmi';
import { DEFAULT_TARGET_CHAIN_ID } from './constants';
import type { WalletStatus } from './types';

/**
 * 钱包连接状态检查 Hook
 * 统一处理钱包连接、网络检查等逻辑
 */
export function useWalletStatus(targetChainId?: number): WalletStatus {
  const connection = useConnection();
  const globalChainId = useChainId();

  const address = connection.address;
  const chainId = connection.chainId ?? globalChainId;
  const isConnected = Boolean(address);

  const targetChain = targetChainId ?? DEFAULT_TARGET_CHAIN_ID;
  const isOnTargetChain = chainId === targetChain;
  const isWrongNetwork = isConnected && !isOnTargetChain;

  return {
    address,
    chainId, // number | undefined（真实世界）
    resolvedChainId: isConnected && chainId ? chainId : null, // ✅ 给组件用
    isConnected,
    isOnTargetChain,
    isWrongNetwork,
    status: connection.status,
  };
}
