import type { Abi, Address } from 'viem';

export const DEFAULT_USDT_DECIMALS = 6;

export interface UseVaultAssetsConfig {
  /** 用户地址 */
  address?: Address;
  /** 钱包是否连接（你外部传进来即可） */
  isConnected?: boolean;

  /** USDT 合约 */
  usdtAddress: Address;
  usdtAbi: Abi;

  /** Vault 合约 */
  vaultAddress: Address;
  vaultAbi: Abi;

  /** 展示用 decimals（默认 6） */
  decimals?: number;
}

export interface VaultAssetsResult {
  userUsdtBalance: bigint | null;
  userVaultBalance: bigint | null;
  totalAssets: bigint | null;
  currentIndex: bigint | null;
  liquidityRate: bigint | null;

  apyDisplay: string;
  isLoading: boolean;
  refresh: () => Promise<void>;

  decimals: number;
}
