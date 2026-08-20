import type { EmployeeEntity, FilingStatus } from "./employee-entity";
import { PayrollRepository } from "./payroll-repository";

export interface SetupEmployeeInput {
  tenantId: number | null;
  name: string;
  salary: number;
  filingStatus: FilingStatus;
  joiningDate: string;
}

export async function setupEmployee(
  input: SetupEmployeeInput,
  repository: PayrollRepository = new PayrollRepository()
): Promise<EmployeeEntity> {
  return repository.createEmployee(input);
}
