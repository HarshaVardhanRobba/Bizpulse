import { withErrorHandling } from "@/lib/api/with-error-handling";
import { ok } from "@/lib/api/response";
import { adjustStock } from "@/lib/inventory/adjust-stock";

export const PATCH = withErrorHandling<{ params: Promise<{ id: string }> }>(
  async (req, { params }) => {
    const { id } = await params;
    const body = await req.json();
    const sku = await adjustStock({ skuId: Number(id), delta: body.delta });
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
