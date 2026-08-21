import { calculateTaxCents } from "./calculate-tax";
import type { InvoiceLineItem } from "./invoice-lineitem";

export interface InvoiceTotalsCents {
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
}

export function calculateInvoiceTotalsCents(
  lineItems: InvoiceLineItem[],
  taxRate?: number
): InvoiceTotalsCents {
  const subtotalCents = lineItems.reduce((sum, item) => sum + item.lineTotalCents, 0);
  const taxCents = calculateTaxCents(subtotalCents, taxRate);
  return { subtotalCents, taxCents, totalCents: subtotalCents + taxCents };
}
