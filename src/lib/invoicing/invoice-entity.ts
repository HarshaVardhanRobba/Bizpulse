import { BaseEntity } from "@/lib/shared/base-entity";
import { ValidationError } from "@/lib/shared/validation-error";
import { calculateInvoiceTotals } from "./calculate-invoice-totals";
import type { InvoiceLineItem } from "./invoice-lineitem";

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
  readonly subtotal: number;
  readonly tax: number;
  readonly total: number;
  readonly status: InvoiceStatus;
  readonly createdAt: Date;

  private constructor(props: InvoiceProps) {
    super(props.id);
    this.tenantId = props.tenantId;
    this.customerId = props.customerId;
    this.lineItems = props.lineItems;
    this.status = props.status;
    this.createdAt = props.createdAt;
    const totals = calculateInvoiceTotals(props.lineItems);
    this.subtotal = totals.subtotal;
    this.tax = totals.tax;
    this.total = totals.total;
  }

  static create(props: InvoiceProps): InvoiceEntity {
    if (props.lineItems.length === 0) {
      throw new ValidationError("invoice requires at least one line item");
    }
    return new InvoiceEntity(props);
  }
}
