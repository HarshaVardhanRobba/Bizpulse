import { calculateTax } from "./calculate-tax";
import type { InvoiceLineItem } from "./invoice-lineitem";

export interface InvoiceTotals {
  subtotal: number;
  tax: number;
  total: number;
}

export function calculateInvoiceTotals(
  lineItems: InvoiceLineItem[],
  taxRate?: number
): InvoiceTotals {
  const subtotal = Math.round(lineItems.reduce((sum, item) => sum + item.lineTotal, 0) * 100) / 100;
  const tax = calculateTax(subtotal, taxRate);
  return { subtotal, tax, total: Math.round((subtotal + tax) * 100) / 100 };
}
