/**
 * 格式化时间戳为可读日期时间
 * @param ts Unix 时间戳（秒，bigint 类型）
 * @returns 格式化后的日期时间字符串，如 "2024-01-15 14:30"
 */
export function formatDateTime(ts?: bigint): string {
  if (!ts || ts === 0n) return '';

  const d = new Date(Number(ts) * 1000); // 合约里是秒，这里转毫秒
  const pad = (n: number) => n.toString().padStart(2, '0');

  const Y = d.getFullYear();
  const M = pad(d.getMonth() + 1);
  const D = pad(d.getDate());
  const h = pad(d.getHours());
  const m = pad(d.getMinutes());

  return `${Y}-${M}-${D} ${h}:${m}`;
}
