import { date, integer, jsonb, numeric, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Inventory domain — SkuEntity
export const skuTable = pgTable("sku", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  tenantId: integer("tenant_id"),
  name: varchar({ length: 255 }).notNull(),
  skuCode: varchar("sku_code", { length: 100 }).notNull().unique(),
  quantity: integer().notNull().default(0),
  reorderThreshold: integer("reorder_threshold").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Invoicing domain — InvoiceEntity
export const invoiceTable = pgTable("invoice", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  tenantId: integer("tenant_id"),
  customerId: integer("customer_id").notNull(),
  subtotal: numeric({ precision: 12, scale: 2 }).notNull(),
  tax: numeric({ precision: 12, scale: 2 }).notNull(),
  total: numeric({ precision: 12, scale: 2 }).notNull(),
  status: varchar({ length: 50 }).notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Invoicing domain — InvoiceLineItem value object
export const invoiceLineItemTable = pgTable("invoice_line_item", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  invoiceId: integer("invoice_id")
    .notNull()
    .references(() => invoiceTable.id),
  skuId: integer("sku_id")
    .notNull()
    .references(() => skuTable.id),
  quantity: integer().notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  lineTotal: numeric("line_total", { precision: 12, scale: 2 }).notNull(),
});

// Payroll domain — EmployeeEntity
export const employeeTable = pgTable("employee", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  tenantId: integer("tenant_id"),
  name: varchar({ length: 255 }).notNull(),
  salary: numeric({ precision: 12, scale: 2 }).notNull(),
  filingStatus: varchar("filing_status", { length: 50 }).notNull(),
  joiningDate: date("joining_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Payroll domain — tax_rule_version
export const taxRuleVersionTable = pgTable("tax_rule_version", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  effectiveDate: date("effective_date").notNull(),
  bracketDefinition: jsonb("bracket_definition_json").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Payroll domain — PaystubValueObject
export const paystubTable = pgTable("paystub", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employeeTable.id),
  taxRuleVersionId: integer("tax_rule_version_id")
    .notNull()
    .references(() => taxRuleVersionTable.id),
  payDate: date("pay_date").notNull(),
  grossPay: numeric("gross_pay", { precision: 12, scale: 2 }).notNull(),
  deductions: numeric({ precision: 12, scale: 2 }).notNull(),
  netPay: numeric("net_pay", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
