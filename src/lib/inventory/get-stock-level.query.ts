import { NotFoundError } from "@/lib/shared/not-found-error";
import { InventoryRepository } from "./inventory-repository";
import type { StockLevel } from "./stock-level";

export async function getStockLevel(
  skuId: number,
  repository: InventoryRepository = new InventoryRepository()
): Promise<StockLevel> {
  const sku = await repository.findById(skuId);
  if (!sku) {
    throw new NotFoundError("Sku", skuId);
  }
  return sku.stockLevel;
}
