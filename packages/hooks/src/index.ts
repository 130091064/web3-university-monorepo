
// 先做最小验收：主 SPA 能 import 并正常运行
export function useWalletLabel(address?: string) {
  return address || '未连接钱包';
}
