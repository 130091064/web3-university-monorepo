import { AAVE_VAULT_ADDRESS, aaveVaultAbi, MOCK_USDT_ADDRESS, mockUSDTAbi } from '@contracts';
import type { Address } from 'viem';
import { useAutoRefresh, useVaultAssets as useVaultAssetsCore } from '@lillianfish/hooks';

const USDT_DECIMALS = 6;

export function useVaultAssets(address?: Address, isConnected?: boolean) {
  const vault = useVaultAssetsCore({
    address,
    isConnected,
    usdtAddress: MOCK_USDT_ADDRESS,
    usdtAbi: mockUSDTAbi,
    vaultAddress: AAVE_VAULT_ADDRESS,
    vaultAbi: aaveVaultAbi,
    decimals: USDT_DECIMALS,
  });

  // ✅ 复用抽离后的自动刷新：首次立即执行 + 每10秒
  useAutoRefresh(vault.refresh, {
    enabled: Boolean(isConnected),
    interval: 10_000,
    immediate: true,
  });

  return vault;
}
