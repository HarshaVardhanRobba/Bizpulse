import type { InvoiceEntity } from "./invoice-entity";

export function generateInvoiceSummary(invoice: InvoiceEntity): string {
  const itemCount = invoice.lineItems.reduce((sum, item) => sum + item.quantity, 0);
  return `Invoice #${invoice.id} for customer ${invoice.customerId}: ${itemCount} item(s), total $${invoice.total.toFixed(2)}, status ${invoice.status}.`;
}
