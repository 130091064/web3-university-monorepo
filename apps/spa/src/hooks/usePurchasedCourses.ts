import { COURSE_MARKETPLACE_ADDRESS, courseMarketplaceAbi } from '@contracts';
import type { Address } from 'viem';
import { usePurchasedCourseIds } from '@lillianfish/hooks';

export function usePurchasedCourses(userAddress?: Address) {
  return usePurchasedCourseIds({
    userAddress,
    enabled: Boolean(userAddress),
    marketplaceAddress: COURSE_MARKETPLACE_ADDRESS,
    marketplaceAbi: courseMarketplaceAbi,
  });
}
