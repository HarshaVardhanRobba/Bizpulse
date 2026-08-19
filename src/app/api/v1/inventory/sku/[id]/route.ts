import { NextResponse } from "next/server";
import { AppError } from "@/lib/shared/app-error";
import { NotFoundError } from "@/lib/shared/not-found-error";
import { InventoryRepository } from "@/lib/inventory/inventory-repository";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const skuId = Number(id);
    const repository = new InventoryRepository();
    const sku = await repository.findById(skuId);
    if (!sku) {
      throw new NotFoundError("Sku", skuId);
    }
    return NextResponse.json({
      id: sku.id,
      tenantId: sku.tenantId,
      name: sku.name,
      skuCode: sku.skuCode,
      quantity: sku.stockLevel.quantity,
      reorderThreshold: sku.stockLevel.reorderThreshold,
      createdAt: sku.createdAt,
    });
  } catch (err) {
    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.statusCode });
    }
    throw err;
  }
}
