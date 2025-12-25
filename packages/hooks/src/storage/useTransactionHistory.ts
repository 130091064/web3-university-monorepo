import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Transaction, UseTransactionHistoryOptions } from './types';

const DEFAULT_STORAGE_KEY_PREFIX = 'web3_transaction_history';
const DEFAULT_MAX_HISTORY = 50;

function safeGetLocalStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

export function useTransactionHistory(
  address?: string,
  options: UseTransactionHistoryOptions = {}
) {
  const { storageKeyPrefix = DEFAULT_STORAGE_KEY_PREFIX, maxHistory = DEFAULT_MAX_HISTORY } = options;

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const storage = useMemo(() => safeGetLocalStorage(), []);

  const storageKey = useMemo(() => {
    if (!address) return null;
    return `${storageKeyPrefix}_${address.toLowerCase()}`;
  }, [address, storageKeyPrefix]);

  // 从 localStorage 加载历史记录
  const loadHistory = useCallback(() => {
    if (!storageKey || !storage) {
      setTransactions([]);
      return;
    }

    try {
      const stored = storage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Transaction[];
        setTransactions(parsed);
      } else {
        setTransactions([]);
      }
    } catch {
      // 库里不 console，保持安静
      setTransactions([]);
    }
  }, [storageKey, storage]);

  // 保存历史记录到 localStorage
  const saveHistory = useCallback(
    (txs: Transaction[]) => {
      if (!storageKey || !storage) return;

      try {
        storage.setItem(storageKey, JSON.stringify(txs));
      } catch {
        // ignore
      }
    },
    [storageKey, storage]
  );

  // 添加新交易
  const addTransaction = useCallback(
    (tx: Omit<Transaction, 'id' | 'timestamp'>) => {
      const newTx: Transaction = {
        ...tx,
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        timestamp: Date.now(),
      };

      setTransactions((prev) => {
        const updated = [newTx, ...prev].slice(0, maxHistory);
        saveHistory(updated);
        return updated;
      });

      return newTx.id;
    },
    [maxHistory, saveHistory]
  );

  // 更新交易状态
  const updateTransaction = useCallback(
    (id: string, updates: Partial<Transaction>) => {
      setTransactions((prev) => {
        const updated = prev.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx));
        saveHistory(updated);
        return updated;
      });
    },
    [saveHistory]
  );

  // 清空历史记录
  const clearHistory = useCallback(() => {
    setTransactions([]);
    if (storageKey && storage) {
      try {
        storage.removeItem(storageKey);
      } catch {
        // ignore
      }
    }
  }, [storageKey, storage]);

  // address 变化时加载
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    transactions,
    addTransaction,
    updateTransaction,
    clearHistory,
    loadHistory,
  };
}
