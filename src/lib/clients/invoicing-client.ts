import { apiClient } from "@/lib/api-client";

export interface InvoiceLineItem {
  skuId: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Invoice {
  id: number;
  tenantId: number | null;
  customerId: number;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "draft" | "issued" | "paid" | "void";
  createdAt: string;
}

export interface CreateInvoiceInput {
  tenantId?: number | null;
  customerId: number;
  lineItems: { skuId: number; quantity: number; unitPrice: number }[];
}

export const invoicingClient = {
  createInvoice: (input: CreateInvoiceInput) =>
    apiClient.post<Invoice>("/invoicing/invoice", input),
  listInvoices: () => apiClient.get<Invoice[]>("/invoicing/invoice"),
  getInvoice: (id: number) => apiClient.get<Invoice>(`/invoicing/invoice/${id}`),
};
