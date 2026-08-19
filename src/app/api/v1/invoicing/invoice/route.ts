import { NextResponse } from "next/server";
import { AppError } from "@/lib/shared/app-error";
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const invoice = await createInvoice({
      tenantId: body.tenantId ?? null,
      customerId: body.customerId,
      lineItems: body.lineItems,
    });
    return NextResponse.json(serialize(invoice), { status: 201 });
  } catch (err) {
    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.statusCode });
    }
    throw err;
  }
}

export async function GET() {
  try {
    const repository = new InvoicingRepository();
    const invoices = await repository.list();
    return NextResponse.json(invoices.map(serialize));
  } catch (err) {
    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.statusCode });
    }
    throw err;
  }
}
