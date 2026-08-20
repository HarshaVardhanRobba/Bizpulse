import { NextResponse } from "next/server";
import { AppError } from "@/lib/shared/app-error";
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const employee = await setupEmployee({
      tenantId: body.tenantId ?? null,
      name: body.name,
      salary: body.salary,
      filingStatus: body.filingStatus,
      joiningDate: body.joiningDate,
    });
    return NextResponse.json(serialize(employee), { status: 201 });
  } catch (err) {
    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.statusCode });
    }
    throw err;
  }
}
