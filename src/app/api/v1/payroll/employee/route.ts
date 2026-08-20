import { withErrorHandling } from "@/lib/api/with-error-handling";
import { created } from "@/lib/api/response";
import { setupEmployee } from "@/lib/payroll/setup-employee";
import type { EmployeeEntity } from "@/lib/payroll/employee-entity";

function serialize(employee: EmployeeEntity) {
  return {
    id: employee.id,
    tenantId: employee.tenantId,
    name: employee.name,
    salary: employee.salary,
    filingStatus: employee.filingStatus,
    joiningDate: employee.joiningDate,
    createdAt: employee.createdAt,
  };
}

export const POST = withErrorHandling(async (req) => {
  const body = await req.json();
  const employee = await setupEmployee({
    tenantId: body.tenantId ?? null,
    name: body.name,
    salary: body.salary,
    filingStatus: body.filingStatus,
    joiningDate: body.joiningDate,
  });
  return created(serialize(employee));
});
