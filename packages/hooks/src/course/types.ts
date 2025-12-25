import type { Abi, Address } from 'viem';

export interface UsePurchasedCourseIdsConfig {
  userAddress?: Address;
  enabled?: boolean;

  marketplaceAddress: Address;
  marketplaceAbi: Abi;

  /** 合约函数名，默认 'getPurchasedCourseIds'（如果未来改名可复用） */
  functionName?: 'getPurchasedCourseIds' | (string & {});
}

export interface PurchasedCourseIdsResult {
  ids: bigint[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}
