import { ValidationError } from "@/lib/shared/validation-error";
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
  if (input.amount <= 0) {
    throw new ValidationError("amount must be positive");
  }
  return repository.decrementQuantity(input.skuId, input.amount, tx);
}
