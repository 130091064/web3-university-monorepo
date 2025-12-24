/**
 * 格式化百分比
 * @param value 数值
 * @param decimals 保留小数位
 * @returns 格式化后的百分比字符串，如 "3.45%"
 */
export function formatPercentage(value: number, decimals = 2): string {
  // 保持你原来的行为：直接 toFixed
  return `${value.toFixed(decimals)}%`;
}
