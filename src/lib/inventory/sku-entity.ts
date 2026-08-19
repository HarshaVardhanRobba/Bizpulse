import { BaseEntity } from "@/lib/shared/base-entity";
import { ValidationError } from "@/lib/shared/validation-error";
import { StockLevel } from "./stock-level";

export interface SkuProps {
  id: number;
  tenantId: number | null;
  name: string;
  skuCode: string;
  quantity: number;
  reorderThreshold: number;
  createdAt: Date;
}

export class SkuEntity extends BaseEntity<number> {
  readonly tenantId: number | null;
  readonly name: string;
  readonly skuCode: string;
  readonly stockLevel: StockLevel;
  readonly createdAt: Date;

  private constructor(props: SkuProps, stockLevel: StockLevel) {
    super(props.id);
    this.tenantId = props.tenantId;
    this.name = props.name;
    this.skuCode = props.skuCode;
    this.stockLevel = stockLevel;
    this.createdAt = props.createdAt;
  }

  static create(props: SkuProps): SkuEntity {
    if (!props.name.trim()) {
      throw new ValidationError("name required");
    }
    if (!props.skuCode.trim()) {
      throw new ValidationError("skuCode required");
    }
    const stockLevel = StockLevel.create(props.quantity, props.reorderThreshold);
    return new SkuEntity(props, stockLevel);
  }

  withStockLevel(stockLevel: StockLevel): SkuEntity {
    return new SkuEntity(
      {
        id: this.id,
        tenantId: this.tenantId,
        name: this.name,
        skuCode: this.skuCode,
        quantity: stockLevel.quantity,
        reorderThreshold: stockLevel.reorderThreshold,
        createdAt: this.createdAt,
      },
      stockLevel
    );
  }
}
