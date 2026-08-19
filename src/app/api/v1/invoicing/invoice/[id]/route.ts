import { NextResponse } from "next/server";
import { AppError } from "@/lib/shared/app-error";
import { NotFoundError } from "@/lib/shared/not-found-error";
import { InvoicingRepository } from "@/lib/invoicing/invoicing-repository";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const invoiceId = Number(id);
    const repository = new InvoicingRepository();
    const invoice = await repository.findById(invoiceId);
    if (!invoice) {
      throw new NotFoundError("Invoice", invoiceId);
    }
    return NextResponse.json({
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
  } catch (err) {
    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.statusCode });
    }
    throw err;
  }
}
