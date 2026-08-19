import { NextResponse } from "next/server";
import { AppError } from "@/lib/shared/app-error";
import { adjustStock } from "@/lib/inventory/adjust-stock";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const sku = await adjustStock({ skuId: Number(id), delta: body.delta });
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
