import { ValidationError } from "@/lib/shared/validation-error";

export class StockLevel {
  private constructor(
    readonly quantity: number,
    readonly reorderThreshold: number
  ) {}

  static create(quantity: number, reorderThreshold: number): StockLevel {
    if (quantity < 0) {
      throw new ValidationError("quantity must be non-negative");
    }
    if (reorderThreshold < 0) {
      throw new ValidationError("reorderThreshold must be non-negative");
    }
    return new StockLevel(quantity, reorderThreshold);
  }

  get isBelowReorderThreshold(): boolean {
    return this.quantity <= this.reorderThreshold;
  }

  adjust(delta: number): StockLevel {
    return StockLevel.create(this.quantity + delta, this.reorderThreshold);
  }

  deduct(amount: number): StockLevel {
    if (amount > this.quantity) {
      throw new ValidationError("insufficient stock");
    }
    return this.adjust(-amount);
  }
}
