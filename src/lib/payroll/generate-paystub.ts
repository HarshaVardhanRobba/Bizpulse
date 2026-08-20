import { NotFoundError } from "@/lib/shared/not-found-error";
import { calculateTaxDeductions } from "./calculate-tax-deductions";
import { getTaxRuleForDate } from "./get-tax-rule-for-date";
import { Paystub } from "./paystub";
import { PayrollRepository, type PaystubRecord } from "./payroll-repository";

export interface GeneratePaystubInput {
  employeeId: number;
  payDate: string;
  grossPay: number;
}

export async function generatePaystub(
  input: GeneratePaystubInput,
  repository: PayrollRepository = new PayrollRepository()
): Promise<PaystubRecord> {
  const employee = await repository.findEmployeeById(input.employeeId);
  if (!employee) {
    throw new NotFoundError("Employee", input.employeeId);
  }

  const taxRule = await getTaxRuleForDate(input.payDate, repository);
  const deductions = calculateTaxDeductions(input.grossPay, employee.filingStatus, taxRule);
  const paystub = Paystub.create(input.grossPay, deductions, taxRule.id);

  return repository.createPaystub({
    employeeId: employee.id,
    payDate: input.payDate,
    paystub,
  });
}
