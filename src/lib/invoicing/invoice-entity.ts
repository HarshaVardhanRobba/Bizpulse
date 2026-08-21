import { BaseEntity } from "@/lib/shared/base-entity";
import { ValidationError } from "@/lib/shared/validation-error";
import { calculateInvoiceTotalsCents } from "./calculate-invoice-totals";
import type { InvoiceLineItem } from "./invoice-lineitem";
import { centsToDollars } from "./money";

export type InvoiceStatus = "draft" | "issued" | "paid" | "void";

export interface InvoiceProps {
  id: number;
  tenantId: number | null;
  customerId: number;
  lineItems: InvoiceLineItem[];
  status: InvoiceStatus;
  createdAt: Date;
}

export class InvoiceEntity extends BaseEntity<number> {
  readonly tenantId: number | null;
  readonly customerId: number;
  readonly lineItems: InvoiceLineItem[];
  readonly subtotalCents: number;
  readonly taxCents: number;
  readonly totalCents: number;
  readonly status: InvoiceStatus;
  readonly createdAt: Date;

  private constructor(props: InvoiceProps) {
    super(props.id);
    this.tenantId = props.tenantId;
    this.customerId = props.customerId;
    this.lineItems = props.lineItems;
    this.status = props.status;
    this.createdAt = props.createdAt;
    const totals = calculateInvoiceTotalsCents(props.lineItems);
    this.subtotalCents = totals.subtotalCents;
    this.taxCents = totals.taxCents;
    this.totalCents = totals.totalCents;
  }

  get subtotal(): number {
    return centsToDollars(this.subtotalCents);
  }

  get tax(): number {
    return centsToDollars(this.taxCents);
  }

  get total(): number {
    return centsToDollars(this.totalCents);
  }

  static create(props: InvoiceProps): InvoiceEntity {
    if (props.lineItems.length === 0) {
      throw new ValidationError("invoice requires at least one line item");
    }
    return new InvoiceEntity(props);
  }
}
