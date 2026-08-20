import { withErrorHandling } from "@/lib/api/with-error-handling";
import { created, ok } from "@/lib/api/response";
import { createSku } from "@/lib/inventory/create-sku";
import { InventoryRepository } from "@/lib/inventory/inventory-repository";
import type { SkuEntity } from "@/lib/inventory/sku-entity";

function serialize(sku: SkuEntity) {
  return {
    id: sku.id,
    tenantId: sku.tenantId,
    name: sku.name,
    skuCode: sku.skuCode,
    quantity: sku.stockLevel.quantity,
    reorderThreshold: sku.stockLevel.reorderThreshold,
    createdAt: sku.createdAt,
  };
}

export const POST = withErrorHandling(async (req) => {
  const body = await req.json();
  const sku = await createSku({
    tenantId: body.tenantId ?? null,
    name: body.name,
    skuCode: body.skuCode,
    quantity: body.quantity ?? 0,
    reorderThreshold: body.reorderThreshold ?? 0,
  });
  return created(serialize(sku));
});

export const GET = withErrorHandling(async () => {
  const repository = new InventoryRepository();
  const skus = await repository.list();
  return ok(skus.map(serialize));
});
