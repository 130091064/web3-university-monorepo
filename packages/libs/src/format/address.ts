/**
 * 缩短地址显示
 * @param addr 完整地址
 * @returns 缩短后的地址，如 "0x1234...5678"
 */
export function shortenAddress(addr?: string): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
