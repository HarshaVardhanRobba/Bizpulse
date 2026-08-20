import { withErrorHandling } from "@/lib/api/with-error-handling";
import { ok } from "@/lib/api/response";
import { NotFoundError } from "@/lib/shared/not-found-error";
import { InventoryRepository } from "@/lib/inventory/inventory-repository";

export const GET = withErrorHandling<{ params: Promise<{ id: string }> }>(
  async (_req, { params }) => {
    const { id } = await params;
    const skuId = Number(id);
    const repository = new InventoryRepository();
    const sku = await repository.findById(skuId);
    if (!sku) {
      throw new NotFoundError("Sku", skuId);
    }
    return ok({
      id: sku.id,
      tenantId: sku.tenantId,
      name: sku.name,
      skuCode: sku.skuCode,
      quantity: sku.stockLevel.quantity,
      reorderThreshold: sku.stockLevel.reorderThreshold,
      createdAt: sku.createdAt,
    });
  }
);
