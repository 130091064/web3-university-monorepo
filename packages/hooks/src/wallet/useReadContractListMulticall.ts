import { useCallback, useEffect, useRef, useState } from 'react'
import { usePublicClient } from 'wagmi'
import type { Abi, Address } from 'viem'

export interface UseReadContractListMulticallOptions<TItem> {
  enabled?: boolean
  auto?: boolean
  reloadKey?: number

  /**
   * rawCount 通常是合约返回的 nextId / length
   * 你可以自定义如何转成“要读多少条”
   */
  countTransform?: (rawCount: unknown, startIndex: number) => number

  /**
   * 单条映射（可选）
   * index 是链上 id（= startIndex + idx）
   */
  mapItem?: (raw: TItem, index: number) => TItem

  onError?: (e: unknown) => void
}

export function useReadContractListMulticall<TItem>(params: {
  address: Address
  abi: Abi
  countFunctionName: string
  itemFunctionName: string
  startIndex?: number
  options?: UseReadContractListMulticallOptions<TItem>
}) {
  const publicClient = usePublicClient()
  const { address, abi, countFunctionName, itemFunctionName, startIndex = 1, options } = params

  const enabled = options?.enabled ?? true
  const auto = options?.auto ?? true
  const reloadKey = options?.reloadKey

  const [items, setItems] = useState<TItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 固定 options，避免对象引用变化导致 load 变化
  const optionsRef = useRef(options)
  useEffect(() => {
    optionsRef.current = options
  }, [options])

  // countTransform 默认：nextId - startIndex
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

  // inflight 锁：阻止并行重复请求
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

        const count = countTransformRef.current(rawCount, startIndex)
        if (count <= 0) {
          setItems([])
          return []
        }

        const calls = Array.from({ length: count }, (_, idx) => {
          const id = startIndex + idx
          return {
            address,
            abi,
            functionName: itemFunctionName as any,
            args: [BigInt(id)] as const,
          } as const
        })

        // ✅ allowFailure: true，单条失败不拖垮整批
        const results = await publicClient.multicall({
          contracts: calls as any,
          allowFailure: true,
        })

        const mapItem = optionsRef.current?.mapItem
        const list: TItem[] = []

        results.forEach((r: any, idx: number) => {
          if (!r || r.status !== 'success') return
          const raw = r.result as TItem
          const id = startIndex + idx
          list.push(mapItem ? mapItem(raw, id) : raw)
        })

        setItems(list)
        return list
      } catch (e) {
        optionsRef.current?.onError?.(e)
        const msg = e instanceof Error ? e.message : 'Failed to load contract list'
        setError(msg)
        // 出错时保持 items 不变也行；你想清空就改成 setItems([])
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
  }, [publicClient, enabled, address, abi, countFunctionName, itemFunctionName, startIndex])

  // auto 首次加载
  useEffect(() => {
    if (!auto) return
    void load()
  }, [auto, load])

  // reloadKey 触发
  useEffect(() => {
    if (reloadKey === undefined) return
    void load()
  }, [reloadKey, load])

  return { items, loading, error, reload: load }
}
