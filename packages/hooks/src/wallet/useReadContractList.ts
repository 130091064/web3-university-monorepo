import { useCallback, useEffect, useRef, useState } from 'react'
import { usePublicClient } from 'wagmi'
import type { Abi, Address } from 'viem'

export interface UseReadContractListOptions<TItem> {
  enabled?: boolean
  /** 初次挂载/依赖变化时是否自动加载，默认 true */
  auto?: boolean
  /** 外部触发重新加载 */
  reloadKey?: number

  /**
   * rawCount 通常是 nextId / length
   * 你可以自定义如何转成“要读多少条”
   * 默认：nextId - startIndex（适配你 CourseMarketplace 的 nextCourseId）
   */
  countTransform?: (rawCount: unknown, startIndex: number) => number

  /** 把链上结果映射成业务对象（index 是链上 id） */
  mapItem?: (raw: TItem, index: number) => TItem

  /** 发生错误时回调（库内不默认 console） */
  onError?: (e: unknown) => void

  /**
   * 单条失败是否跳过并继续
   * - true: 某个 id revert 不会导致整体失败（默认 true，更实用）
   * - false: 任何一条失败就整体失败
   */
  skipFailure?: boolean
}

export function useReadContractList<TItem>(params: {
  address: Address
  abi: Abi
  /** 用来拿数量/nextId 的函数名，比如 nextCourseId */
  countFunctionName: string
  /** 用来拿单个 item 的函数名，比如 getCourse */
  itemFunctionName: string
  /** item 读取参数构造器，默认 (id)=>[BigInt(id)] */
  makeItemArgs?: (id: number) => readonly unknown[]
  /** index 从 1 还是 0 开始，默认 1（符合你现在 CourseId） */
  startIndex?: number
  options?: UseReadContractListOptions<TItem>
}) {
  const publicClient = usePublicClient()
  const {
    address,
    abi,
    countFunctionName,
    itemFunctionName,
    makeItemArgs = (id) => [BigInt(id)] as const,
    startIndex = 1,
    options,
  } = params

  const enabled = options?.enabled ?? true
  const auto = options?.auto ?? true
  const reloadKey = options?.reloadKey
  const skipFailure = options?.skipFailure ?? true

  const [items, setItems] = useState<TItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ✅ 固定 options，避免对象引用变化导致 load 变化
  const optionsRef = useRef(options)
  useEffect(() => {
    optionsRef.current = options
  }, [options])

  // ✅ countTransform 默认：nextId - startIndex（nextId 表示下一个可用 id）
  const countTransformRef = useRef<(raw: unknown, si: number) => number>((raw, si) => {
    const nextId = Number(raw as any)
    if (!Number.isFinite(nextId)) return 0
    return Math.max(0, nextId - si)
  })
  useEffect(() => {
    countTransformRef.current =
      options?.countTransform ??
      ((raw: unknown, si: number) => {
        const nextId = Number(raw as any)
        if (!Number.isFinite(nextId)) return 0
        return Math.max(0, nextId - si)
      })
  }, [options?.countTransform])

  // ✅ inflight 锁：阻止并行重复请求
  const inflightRef = useRef<Promise<TItem[]> | null>(null)

  const load = useCallback(async () => {
    if (inflightRef.current) return inflightRef.current

    inflightRef.current = (async () => {
      if (!publicClient || !enabled) {
        setItems([])
        return []
      }

      try {
        setLoading(true)
        setError(null)

        const rawCount = await publicClient.readContract({
          address,
          abi,
          functionName: countFunctionName as any,
        })

        // count = 需要读取的条数
        const count = countTransformRef.current(rawCount, startIndex)
        if (count <= 0) {
          setItems([])
          return []
        }

        // 需要读取的 id 范围：[startIndex, startIndex + count - 1]
        const maxId = startIndex + count - 1

        const mapItem = optionsRef.current?.mapItem
        const list: TItem[] = []

        for (let id = startIndex; id <= maxId; id++) {
          try {
            const raw = (await publicClient.readContract({
              address,
              abi,
              functionName: itemFunctionName as any,
              args: makeItemArgs(id) as any,
            })) as TItem

            list.push(mapItem ? mapItem(raw, id) : raw)
          } catch (e) {
            if (!skipFailure) throw e
            // 跳过单条失败：典型场景就是 getCourse(0) / 空洞 id revert
            optionsRef.current?.onError?.(e)
            continue
          }
        }

        setItems(list)
        return list
      } catch (e) {
        optionsRef.current?.onError?.(e)
        const msg = e instanceof Error ? e.message : 'Failed to load contract list'
        setError(msg)
        setItems([])
        return []
      } finally {
        setLoading(false)
      }
    })()

    try {
      return await inflightRef.current
    } finally {
      inflightRef.current = null
    }
  }, [publicClient, enabled, address, abi, countFunctionName, itemFunctionName, makeItemArgs, startIndex, skipFailure])

  // ✅ 自动加载
  useEffect(() => {
    if (!auto) return
    void load()
  }, [auto, load])

  // ✅ 外部 reloadKey 触发（只依赖值）
  useEffect(() => {
    if (reloadKey === undefined) return
    void load()
  }, [reloadKey, load])

  return { items, loading, error, reload: load }
}
