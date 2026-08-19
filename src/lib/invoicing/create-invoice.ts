import { db } from "@/db";
import { eventBus } from "@/lib/shared/event-bus";
import { deductStock } from "@/lib/inventory/deduct-stock";
import { InvoiceLineItem } from "./invoice-lineitem";
import { InvoicingRepository } from "./invoicing-repository";
import type { InvoiceEntity } from "./invoice-entity";
import { INVOICE_CREATED } from "./invoice-created";

export interface CreateInvoiceLineInput {
  skuId: number;
  quantity: number;
  unitPrice: number;
}

export interface CreateInvoiceInput {
  tenantId: number | null;
  customerId: number;
  lineItems: CreateInvoiceLineInput[];
}

export async function createInvoice(
  input: CreateInvoiceInput,
  repository: InvoicingRepository = new InvoicingRepository()
): Promise<InvoiceEntity> {
  const lineItems = input.lineItems.map((item) =>
    InvoiceLineItem.create(item.skuId, item.quantity, item.unitPrice)
  );

  const invoice = await db.transaction(async (tx) => {
    for (const item of lineItems) {
      await deductStock({ skuId: item.skuId, amount: item.quantity }, tx);
    }
    return repository.create(
      { tenantId: input.tenantId, customerId: input.customerId, lineItems },
      tx
    );
  });

  await eventBus.publish(INVOICE_CREATED, {
    invoiceId: invoice.id,
    customerId: invoice.customerId,
    total: invoice.total,
  });

  return invoice;
}
