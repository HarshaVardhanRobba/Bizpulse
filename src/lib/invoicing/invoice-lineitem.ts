import { ValidationError } from "@/lib/shared/validation-error";
import { calculateLineItemSubtotalCents } from "./calculate-lineitem-subtotal";
import { centsToDollars, dollarsToCents } from "./money";

export class InvoiceLineItem {
  private constructor(
    readonly skuId: number,
    readonly quantity: number,
    readonly unitPriceCents: number,
    readonly lineTotalCents: number
  ) {}

  static create(skuId: number, quantity: number, unitPrice: number): InvoiceLineItem {
    if (quantity <= 0) {
      throw new ValidationError("quantity must be positive");
    }
    if (unitPrice < 0) {
      throw new ValidationError("unitPrice must be non-negative");
    }
    const unitPriceCents = dollarsToCents(unitPrice);
    return new InvoiceLineItem(
      skuId,
      quantity,
      unitPriceCents,
      calculateLineItemSubtotalCents(quantity, unitPriceCents)
    );
  }

  get unitPrice(): number {
    return centsToDollars(this.unitPriceCents);
  }

  get lineTotal(): number {
    return centsToDollars(this.lineTotalCents);
  }
}
