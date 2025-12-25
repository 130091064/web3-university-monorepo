/**
 * Aave 常见 liquidityRate 是 RAY(1e27) 精度
 * 这里只做展示用的近似（保持你原来的逻辑）
 */
export function formatApyFromRay(liquidityRate: bigint | null): string {
  if (!liquidityRate) return '-';

  // ⚠️ 仍然是展示近似：bigint -> number 可能溢出（极端情况）
  // 但 Aave rate 通常不会大到溢出，这里保持与你现有实现一致
  const RAY = 1e27;
  const apy = (Number(liquidityRate) / RAY) * 100;
  return `${apy.toFixed(2)}%`;
}
