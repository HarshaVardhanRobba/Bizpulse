import { NotFoundError } from "@/lib/shared/not-found-error";
import { InventoryRepository } from "./inventory-repository";
import { SkuEntity } from "./sku-entity";

export interface AdjustStockInput {
  skuId: number;
  delta: number;
}

export async function adjustStock(
  input: AdjustStockInput,
  repository: InventoryRepository = new InventoryRepository()
): Promise<SkuEntity> {
  const sku = await repository.findById(input.skuId);
  if (!sku) {
    throw new NotFoundError("Sku", input.skuId);
  }
  const updated = sku.withStockLevel(sku.stockLevel.adjust(input.delta));
  return repository.save(updated);
}
