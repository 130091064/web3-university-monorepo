import { useCallback, useEffect, useRef } from "react";

export interface UseAutoRefreshOptions {
  /** 刷新间隔（毫秒），默认30秒 */
  interval?: number;
  /** 是否启用自动刷新，默认true */
  enabled?: boolean;
  /** 是否在首次挂载时立即执行，默认false */
  immediate?: boolean;
  /** 错误处理：默认不处理（不在库里 console） */
  onError?: (error: unknown) => void;
}

/**
 * 统一的自动刷新 Hook
 * - 支持同步/异步 callback
 * - 支持手动触发
 * - 支持 immediate 首次执行
 */
export function useAutoRefresh(
  callback: () => void | Promise<void>,
  options: UseAutoRefreshOptions = {}
) {
  const {
    interval = 30_000,
    enabled = true,
    immediate = false,
    onError,
  } = options;

  const savedCallback = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 保存最新的 callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const run = useCallback(async () => {
    try {
      await savedCallback.current();
    } catch (e) {
      onError?.(e);
    }
  }, [onError]);

  // 自动刷新逻辑
  useEffect(() => {
    // 关闭时清理
    if (!enabled) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (immediate) {
      void run();
    }

    timerRef.current = setInterval(() => {
      void run();
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled, interval, immediate, run]);

  // 返回手动刷新
  return run;
}
