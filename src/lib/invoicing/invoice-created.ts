export const INVOICE_CREATED = "invoice.created";

export interface InvoiceCreatedPayload {
  invoiceId: number;
  customerId: number;
  total: number;
}
