import { apiClient } from "@/lib/api-client";

export type FilingStatus = "single" | "married" | "head_of_household";

export interface Employee {
  id: number;
  tenantId: number | null;
  name: string;
  salary: number;
  filingStatus: FilingStatus;
  joiningDate: string;
  createdAt: string;
}

export interface SetupEmployeeInput {
  tenantId?: number | null;
  name: string;
  salary: number;
  filingStatus: FilingStatus;
  joiningDate: string;
}

export interface Paystub {
  id: number;
  employeeId: number;
  payDate: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  taxRuleVersionId: number;
  createdAt: string;
}

export interface GeneratePaystubInput {
  employeeId: number;
  payDate: string;
  grossPay: number;
}

export const payrollClient = {
  setupEmployee: (input: SetupEmployeeInput) =>
    apiClient.post<Employee>("/payroll/employee", input),
  generatePaystub: (input: GeneratePaystubInput) =>
    apiClient.post<Paystub>("/payroll/paystub", input),
};
