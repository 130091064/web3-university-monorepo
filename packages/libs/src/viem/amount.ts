import { formatUnits, parseEther, parseUnits } from 'viem';

/**
 * 金额格式化：保留 4 位小数，去掉多余的 0，纯整数时显示带千位分隔
 * @param value bigint 金额
 * @param decimals 小数位数
 * @returns 格式化后的字符串
 */
export function formatTokenAmount(value: bigint | null, decimals: number): string {
  if (value === null) return '-';

  try {
    const asStr = formatUnits(value, decimals);
    const num = Number(asStr);

    if (Number.isNaN(num)) return asStr;

    const fixed = num.toFixed(4);

    // 如果是纯整数（.0000），返回带千位分隔的整数
    if (fixed.endsWith('.0000')) {
      return Math.round(num).toLocaleString();
    }

    // 去掉末尾多余的 0，如 "900.1950" -> "900.195"
    const trimmed = fixed.replace(/0+$/, '').replace(/\.$/, '');
    const [intPart, decimalPart] = trimmed.split('.');

    return decimalPart
      ? `${Number(intPart).toLocaleString()}.${decimalPart}`
      : Number(intPart).toLocaleString();
  } catch {
    return '-';
  }
}

/**
 * 将用户输入的金额字符串解析为 bigint（基于 parseUnits）
 * - 支持空字符串/非法输入时返回 null（便于表单容错）
 * - 自动 trim，去掉千分位逗号
 */
export function parseTokenAmount(input: string | null | undefined, decimals: number): bigint | null {
  const raw = (input ?? '').trim();
  if (!raw) return null;

  // 支持 "1,234.56" 这种输入
  const normalized = raw.replace(/,/g, '');

  try {
    return parseUnits(normalized, decimals);
  } catch {
    return null;
  }
}

/**
 * 解析 ETH 输入为 bigint（基于 parseEther）
 * - 适用于 ETH 原生金额输入
 * - 空/非法返回 null
 */
export function parseEtherAmount(input: string | null | undefined): bigint | null {
  const raw = (input ?? '').trim();
  if (!raw) return null;

  const normalized = raw.replace(/,/g, '');

  try {
    return parseEther(normalized);
  } catch {
    return null;
  }
}

/**
 * 有时你可能只是想拿到 formatUnits 的字符串（不走 Number 精度）
 * 这个函数就是“直出字符串”，避免大数转 Number 的精度问题。
 */
export function formatUnitsString(value: bigint | null, decimals: number): string {
  if (value === null) return '-';
  try {
    return formatUnits(value, decimals);
  } catch {
    return '-';
  }
}
