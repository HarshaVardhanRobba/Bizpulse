export const DEFAULT_TAX_RATE = 0.08;

export function calculateTaxCents(
  subtotalCents: number,
  taxRate: number = DEFAULT_TAX_RATE
): number {
  return Math.round(subtotalCents * taxRate);
}
