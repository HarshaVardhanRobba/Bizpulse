export function calculateLineItemSubtotalCents(quantity: number, unitPriceCents: number): number {
  return quantity * unitPriceCents;
}
