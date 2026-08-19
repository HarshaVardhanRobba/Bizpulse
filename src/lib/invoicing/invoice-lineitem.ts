import { ValidationError } from "@/lib/shared/validation-error";
import { calculateLineItemSubtotal } from "./calculate-lineitem-subtotal";

export class InvoiceLineItem {
  private constructor(
    readonly skuId: number,
    readonly quantity: number,
    readonly unitPrice: number,
    readonly lineTotal: number
  ) {}

  static create(skuId: number, quantity: number, unitPrice: number): InvoiceLineItem {
    if (quantity <= 0) {
      throw new ValidationError("quantity must be positive");
    }
    if (unitPrice < 0) {
      throw new ValidationError("unitPrice must be non-negative");
    }
    return new InvoiceLineItem(
      skuId,
      quantity,
      unitPrice,
      calculateLineItemSubtotal(quantity, unitPrice)
    );
  }
}
