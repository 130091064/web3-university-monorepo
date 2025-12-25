export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'swap' | 'buyYD' | 'purchase';
  amount: string;
  token: string;
  timestamp: number;
  txHash?: string;
  status: 'pending' | 'success' | 'failed';
  details?: string;
}

export interface UseTransactionHistoryOptions {
  /** localStorage key 前缀，默认 'web3_transaction_history' */
  storageKeyPrefix?: string;
  /** 最多保存多少条，默认 50 */
  maxHistory?: number;
}
