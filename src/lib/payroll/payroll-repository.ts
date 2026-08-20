import { and, desc, eq, lte } from "drizzle-orm";
import { db } from "@/db";
import { employeeTable, paystubTable, taxRuleVersionTable } from "@/db/schema";
import type { DbExecutor } from "@/lib/inventory/inventory-repository";
import { EmployeeEntity, type FilingStatus } from "./employee-entity";
import { Paystub } from "./paystub";
import type { TaxRuleVersion } from "./tax-rule-version";

export interface CreateEmployeeProps {
  tenantId: number | null;
  name: string;
  salary: number;
  filingStatus: FilingStatus;
  joiningDate: string;
}

export interface CreatePaystubProps {
  employeeId: number;
  payDate: string;
  paystub: Paystub;
}

export interface PaystubRecord {
  id: number;
  employeeId: number;
  payDate: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  taxRuleVersionId: number;
  createdAt: Date;
}

function toEmployeeEntity(row: typeof employeeTable.$inferSelect): EmployeeEntity {
  return EmployeeEntity.create({
    id: row.id,
    tenantId: row.tenantId,
    name: row.name,
    salary: Number(row.salary),
    filingStatus: row.filingStatus as FilingStatus,
    joiningDate: row.joiningDate,
    createdAt: row.createdAt,
  });
}

function toTaxRuleVersion(row: typeof taxRuleVersionTable.$inferSelect): TaxRuleVersion {
  return {
    id: row.id,
    effectiveDate: row.effectiveDate,
    bracketDefinition: row.bracketDefinition as TaxRuleVersion["bracketDefinition"],
  };
}

function toPaystubRecord(row: typeof paystubTable.$inferSelect): PaystubRecord {
  return {
    id: row.id,
    employeeId: row.employeeId,
    payDate: row.payDate,
    grossPay: Number(row.grossPay),
    deductions: Number(row.deductions),
    netPay: Number(row.netPay),
    taxRuleVersionId: row.taxRuleVersionId,
    createdAt: row.createdAt,
  };
}

export class PayrollRepository {
  async findEmployeeById(id: number, executor: DbExecutor = db): Promise<EmployeeEntity | null> {
    const [row] = await executor
      .select()
      .from(employeeTable)
      .where(eq(employeeTable.id, id))
      .limit(1);
    return row ? toEmployeeEntity(row) : null;
  }

  async listEmployees(executor: DbExecutor = db): Promise<EmployeeEntity[]> {
    const rows = await executor.select().from(employeeTable);
    return rows.map(toEmployeeEntity);
  }

  async createEmployee(
    props: CreateEmployeeProps,
    executor: DbExecutor = db
  ): Promise<EmployeeEntity> {
    const [row] = await executor
      .insert(employeeTable)
      .values({
        tenantId: props.tenantId,
        name: props.name,
        salary: props.salary.toFixed(2),
        filingStatus: props.filingStatus,
        joiningDate: props.joiningDate,
      })
      .returning();
    return toEmployeeEntity(row);
  }

  async findTaxRuleEffectiveOn(
    payDate: string,
    executor: DbExecutor = db
  ): Promise<TaxRuleVersion | null> {
    const [row] = await executor
      .select()
      .from(taxRuleVersionTable)
      .where(lte(taxRuleVersionTable.effectiveDate, payDate))
      .orderBy(desc(taxRuleVersionTable.effectiveDate))
      .limit(1);
    return row ? toTaxRuleVersion(row) : null;
  }

  async createPaystub(
    props: CreatePaystubProps,
    executor: DbExecutor = db
  ): Promise<PaystubRecord> {
    const [row] = await executor
      .insert(paystubTable)
      .values({
        employeeId: props.employeeId,
        taxRuleVersionId: props.paystub.taxRuleVersionId,
        payDate: props.payDate,
        grossPay: props.paystub.grossPay.toFixed(2),
        deductions: props.paystub.deductions.toFixed(2),
        netPay: props.paystub.netPay.toFixed(2),
      })
      .returning();
    return toPaystubRecord(row);
  }

  async findPaystubById(id: number, executor: DbExecutor = db): Promise<PaystubRecord | null> {
    const [row] = await executor
      .select()
      .from(paystubTable)
      .where(eq(paystubTable.id, id))
      .limit(1);
    return row ? toPaystubRecord(row) : null;
  }

  async listPaystubsForEmployee(
    employeeId: number,
    executor: DbExecutor = db
  ): Promise<PaystubRecord[]> {
    const rows = await executor
      .select()
      .from(paystubTable)
      .where(and(eq(paystubTable.employeeId, employeeId)));
    return rows.map(toPaystubRecord);
  }
}
