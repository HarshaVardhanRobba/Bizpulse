import { BaseEntity } from "@/lib/shared/base-entity";
import { ValidationError } from "@/lib/shared/validation-error";

export type FilingStatus = "single" | "married" | "head_of_household";

export interface EmployeeProps {
  id: number;
  tenantId: number | null;
  name: string;
  salary: number;
  filingStatus: FilingStatus;
  joiningDate: string;
  createdAt: Date;
}

export class EmployeeEntity extends BaseEntity<number> {
  readonly tenantId: number | null;
  readonly name: string;
  readonly salary: number;
  readonly filingStatus: FilingStatus;
  readonly joiningDate: string;
  readonly createdAt: Date;

  private constructor(props: EmployeeProps) {
    super(props.id);
    this.tenantId = props.tenantId;
    this.name = props.name;
    this.salary = props.salary;
    this.filingStatus = props.filingStatus;
    this.joiningDate = props.joiningDate;
    this.createdAt = props.createdAt;
  }

  static create(props: EmployeeProps): EmployeeEntity {
    if (!props.name.trim()) {
      throw new ValidationError("name required");
    }
    if (props.salary <= 0) {
      throw new ValidationError("salary must be positive");
    }
    return new EmployeeEntity(props);
  }
}
