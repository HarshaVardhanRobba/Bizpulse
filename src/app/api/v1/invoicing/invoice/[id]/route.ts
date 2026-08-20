import { withErrorHandling } from "@/lib/api/with-error-handling";
import { ok } from "@/lib/api/response";
import { NotFoundError } from "@/lib/shared/not-found-error";
import { InvoicingRepository } from "@/lib/invoicing/invoicing-repository";

export const GET = withErrorHandling<{ params: Promise<{ id: string }> }>(
  async (_req, { params }) => {
    const { id } = await params;
    const invoiceId = Number(id);
    const repository = new InvoicingRepository();
    const invoice = await repository.findById(invoiceId);
    if (!invoice) {
      throw new NotFoundError("Invoice", invoiceId);
    }
    return ok({
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
    });
  }
);
