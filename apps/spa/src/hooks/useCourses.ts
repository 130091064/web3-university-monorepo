import { COURSE_MARKETPLACE_ADDRESS, courseMarketplaceAbi } from '@contracts'
import type { Course } from '@types'
import { useReadContractListMulticall } from '@lillianfish/hooks'

export function useCourses(reloadKey?: number, enabled = true) {
  const startIndex = 1

  const { items: courses, loading, error, reload } = useReadContractListMulticall<Course>({
    address: COURSE_MARKETPLACE_ADDRESS,
    abi: courseMarketplaceAbi as any,
    countFunctionName: 'nextCourseId', // 注意：这里返回的是 lastId，不是 nextId
    itemFunctionName: 'getCourse',
    startIndex,
    options: {
      enabled,
      reloadKey,

      // ✅ raw 是 lastId：count = lastId - startIndex + 1
      countTransform: (raw, si) => {
        const lastId = Number(raw as any)
        return Math.max(0, lastId - si + 1)
      },

      mapItem: (c) => ({ ...c }),
      onError: (e) => console.error('[useCourses] load error:', e),
    },
  })

  return { courses, loading, error, reload }
}
