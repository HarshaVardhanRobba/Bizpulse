import { eq } from "drizzle-orm";
import { db } from "@/db";
import { invoiceLineItemTable, invoiceTable } from "@/db/schema";
import { NotFoundError } from "@/lib/shared/not-found-error";
import type { DbExecutor } from "@/lib/inventory/inventory-repository";
import { InvoiceEntity, type InvoiceStatus } from "./invoice-entity";
import { InvoiceLineItem } from "./invoice-lineitem";

export interface CreateInvoiceProps {
  tenantId: number | null;
  customerId: number;
  lineItems: InvoiceLineItem[];
}

async function loadLineItems(invoiceId: number, executor: DbExecutor): Promise<InvoiceLineItem[]> {
  const rows = await executor
    .select()
    .from(invoiceLineItemTable)
    .where(eq(invoiceLineItemTable.invoiceId, invoiceId));
  return rows.map((row) => InvoiceLineItem.create(row.skuId, row.quantity, Number(row.unitPrice)));
}

function toEntity(
  row: typeof invoiceTable.$inferSelect,
  lineItems: InvoiceLineItem[]
): InvoiceEntity {
  return InvoiceEntity.create({
    id: row.id,
    tenantId: row.tenantId,
    customerId: row.customerId,
    lineItems,
    status: row.status as InvoiceStatus,
    createdAt: row.createdAt,
  });
}

export class InvoicingRepository {
  async findById(id: number, executor: DbExecutor = db): Promise<InvoiceEntity | null> {
    const [row] = await executor
      .select()
      .from(invoiceTable)
      .where(eq(invoiceTable.id, id))
      .limit(1);
    if (!row) return null;
    const lineItems = await loadLineItems(id, executor);
    return toEntity(row, lineItems);
  }

  async list(executor: DbExecutor = db): Promise<InvoiceEntity[]> {
    const rows = await executor.select().from(invoiceTable);
    return Promise.all(
      rows.map(async (row) => toEntity(row, await loadLineItems(row.id, executor)))
    );
  }

  async create(props: CreateInvoiceProps, tx: DbExecutor): Promise<InvoiceEntity> {
    const draft = InvoiceEntity.create({
      id: 0,
      tenantId: props.tenantId,
      customerId: props.customerId,
      lineItems: props.lineItems,
      status: "draft",
      createdAt: new Date(),
    });

    const [row] = await tx
      .insert(invoiceTable)
      .values({
        tenantId: props.tenantId,
        customerId: props.customerId,
        subtotal: draft.subtotal.toFixed(2),
        tax: draft.tax.toFixed(2),
        total: draft.total.toFixed(2),
        status: "draft",
      })
      .returning();

    await tx.insert(invoiceLineItemTable).values(
      props.lineItems.map((item) => ({
        invoiceId: row.id,
        skuId: item.skuId,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toFixed(2),
        lineTotal: item.lineTotal.toFixed(2),
      }))
    );

    return toEntity(row, props.lineItems);
  }

  async save(entity: InvoiceEntity, executor: DbExecutor = db): Promise<InvoiceEntity> {
    const [row] = await executor
      .update(invoiceTable)
      .set({ status: entity.status })
      .where(eq(invoiceTable.id, entity.id))
      .returning();
    if (!row) {
      throw new NotFoundError("Invoice", entity.id);
    }
    return toEntity(row, entity.lineItems);
  }
}
