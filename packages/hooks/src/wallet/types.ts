export interface WalletStatus {
  address?: `0x${string}`;
  chainId?: number;
  resolvedChainId: number | null;
  isConnected: boolean;
  isOnTargetChain: boolean;
  isWrongNetwork: boolean;
  status: string;
}
