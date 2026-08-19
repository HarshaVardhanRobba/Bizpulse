import { ValidationError } from "@/lib/shared/validation-error";
import { InventoryRepository } from "./inventory-repository";
import { SkuEntity } from "./sku-entity";

export interface CreateSkuInput {
  tenantId: number | null;
  name: string;
  skuCode: string;
  quantity: number;
  reorderThreshold: number;
}

export async function createSku(
  input: CreateSkuInput,
  repository: InventoryRepository = new InventoryRepository()
): Promise<SkuEntity> {
  const existing = await repository.findBySkuCode(input.skuCode);
  if (existing) {
    throw new ValidationError(`skuCode ${input.skuCode} already exists`);
  }
  return repository.create(input);
}
