export const DEFAULT_TAX_RATE = 0.08;

export function calculateTax(subtotal: number, taxRate: number = DEFAULT_TAX_RATE): number {
  return Math.round(subtotal * taxRate * 100) / 100;
}
