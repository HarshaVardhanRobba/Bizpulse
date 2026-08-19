import { NotFoundError } from "@/lib/shared/not-found-error";
import { InventoryRepository, type DbExecutor } from "./inventory-repository";
import { SkuEntity } from "./sku-entity";

export interface DeductStockInput {
  skuId: number;
  amount: number;
}

export async function deductStock(
  input: DeductStockInput,
  tx: DbExecutor,
  repository: InventoryRepository = new InventoryRepository()
): Promise<SkuEntity> {
  const sku = await repository.findById(input.skuId, tx);
  if (!sku) {
    throw new NotFoundError("Sku", input.skuId);
  }
  const updated = sku.withStockLevel(sku.stockLevel.deduct(input.amount));
  return repository.save(updated, tx);
}
