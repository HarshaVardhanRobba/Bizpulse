import { eq } from "drizzle-orm";
import { db } from "@/db";
import { skuTable } from "@/db/schema";
import type { BaseRepository } from "@/lib/shared/base-repository";
import { NotFoundError } from "@/lib/shared/not-found-error";
import { SkuEntity } from "./sku-entity";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type DbExecutor = typeof db | Tx;

function toEntity(row: typeof skuTable.$inferSelect): SkuEntity {
  return SkuEntity.create({
    id: row.id,
    tenantId: row.tenantId,
    name: row.name,
    skuCode: row.skuCode,
    quantity: row.quantity,
    reorderThreshold: row.reorderThreshold,
    createdAt: row.createdAt,
  });
}

export class InventoryRepository implements BaseRepository<SkuEntity, number> {
  async findById(id: number, executor: DbExecutor = db): Promise<SkuEntity | null> {
    const [row] = await executor.select().from(skuTable).where(eq(skuTable.id, id)).limit(1);
    return row ? toEntity(row) : null;
  }

  async list(executor: DbExecutor = db): Promise<SkuEntity[]> {
    const rows = await executor.select().from(skuTable);
    return rows.map(toEntity);
  }

  async findBySkuCode(skuCode: string, executor: DbExecutor = db): Promise<SkuEntity | null> {
    const [row] = await executor
      .select()
      .from(skuTable)
      .where(eq(skuTable.skuCode, skuCode))
      .limit(1);
    return row ? toEntity(row) : null;
  }

  async create(
    props: {
      tenantId: number | null;
      name: string;
      skuCode: string;
      quantity: number;
      reorderThreshold: number;
    },
    executor: DbExecutor = db
  ): Promise<SkuEntity> {
    const [row] = await executor
      .insert(skuTable)
      .values({
        tenantId: props.tenantId,
        name: props.name,
        skuCode: props.skuCode,
        quantity: props.quantity,
        reorderThreshold: props.reorderThreshold,
      })
      .returning();
    return toEntity(row);
  }

  async save(entity: SkuEntity, executor: DbExecutor = db): Promise<SkuEntity> {
    const [row] = await executor
      .update(skuTable)
      .set({
        name: entity.name,
        skuCode: entity.skuCode,
        quantity: entity.stockLevel.quantity,
        reorderThreshold: entity.stockLevel.reorderThreshold,
      })
      .where(eq(skuTable.id, entity.id))
      .returning();
    if (!row) {
      throw new NotFoundError("Sku", entity.id);
    }
    return toEntity(row);
  }

  async delete(id: number, executor: DbExecutor = db): Promise<void> {
    const [row] = await executor.delete(skuTable).where(eq(skuTable.id, id)).returning();
    if (!row) {
      throw new NotFoundError("Sku", id);
    }
  }
}
