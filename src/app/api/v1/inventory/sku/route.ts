import { NextResponse } from "next/server";
import { AppError } from "@/lib/shared/app-error";
import { createSku } from "@/lib/inventory/create-sku";
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sku = await createSku({
      tenantId: body.tenantId ?? null,
      name: body.name,
      skuCode: body.skuCode,
      quantity: body.quantity ?? 0,
      reorderThreshold: body.reorderThreshold ?? 0,
    });
    return NextResponse.json(serialize(sku), { status: 201 });
  } catch (err) {
    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.statusCode });
    }
    throw err;
  }
}
