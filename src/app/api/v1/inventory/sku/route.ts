import { withErrorHandling } from "@/lib/api/with-error-handling";
import { parseRequestBody } from "@/lib/api/parse-request";
import { created, ok } from "@/lib/api/response";
import { createSku } from "@/lib/inventory/create-sku";
import { createSkuRequestSchema } from "@/lib/inventory/sku-request-schema";
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
  const body = parseRequestBody(createSkuRequestSchema, await req.json());
  const sku = await createSku({
    tenantId: body.tenantId ?? null,
    name: body.name,
    skuCode: body.skuCode,
    quantity: body.quantity,
    reorderThreshold: body.reorderThreshold,
  });
  return created(serialize(sku));
});

export const GET = withErrorHandling(async () => {
  const repository = new InventoryRepository();
  const skus = await repository.list();
  return ok(skus.map(serialize));
});
