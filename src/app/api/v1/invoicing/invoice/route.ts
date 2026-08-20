import { withErrorHandling } from "@/lib/api/with-error-handling";
import { created, ok } from "@/lib/api/response";
import { createInvoice } from "@/lib/invoicing/create-invoice";
import { InvoicingRepository } from "@/lib/invoicing/invoicing-repository";
import type { InvoiceEntity } from "@/lib/invoicing/invoice-entity";

function serialize(invoice: InvoiceEntity) {
  return {
    id: invoice.id,
    tenantId: invoice.tenantId,
    customerId: invoice.customerId,
    lineItems: invoice.lineItems.map((item) => ({
      skuId: item.skuId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
    })),
    subtotal: invoice.subtotal,
    tax: invoice.tax,
    total: invoice.total,
    status: invoice.status,
    createdAt: invoice.createdAt,
  };
}

export const POST = withErrorHandling(async (req) => {
  const body = await req.json();
  const invoice = await createInvoice({
    tenantId: body.tenantId ?? null,
    customerId: body.customerId,
    lineItems: body.lineItems,
  });
  return created(serialize(invoice));
});

export const GET = withErrorHandling(async () => {
  const repository = new InvoicingRepository();
  const invoices = await repository.list();
  return ok(invoices.map(serialize));
});
