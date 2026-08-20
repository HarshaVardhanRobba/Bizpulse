# Bizpulse

Business management platform for small/mid businesses — inventory, invoicing, and payroll in one app.

## Overview

Small businesses juggle stock, billing, and payroll across separate disconnected tools. Bizpulse puts all three on one data model:

- Sell against real-time stock, no overselling.
- Invoice deducts stock atomically — invoice and stock movement commit or fail together, never partially.
- Payroll keeps historical tax versioning, so a paystub run last year recalculates the same today, even if brackets have since changed.

Built on Next.js (App Router). Backend follows a layered domain model — value objects and entities validate invariants, repositories handle persistence via Drizzle ORM, use-case functions orchestrate transactions, Route Handlers expose everything under a versioned REST API.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Database:** Postgres (Neon serverless) via Drizzle ORM
- **Auth:** Clerk (`@clerk/nextjs`)
- **UI:** Tailwind CSS 4, shadcn/ui, Radix/Base UI primitives
- **Validation:** Zod
- **Tooling:** ESLint, Prettier, Husky + lint-staged, TypeScript

## Getting Started

```bash
npm install
```

Set `DATABASE_URL` and Clerk keys in `.env`, then push the schema:

```bash
npm run db:push
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build       # production build
npm run lint         # eslint
npm run format       # prettier --write .
npm run db:studio    # Drizzle Studio
```

## Domains

Each domain lives under `src/lib/<domain>/` with its own entities, value objects, repository, and use-case functions, plus routes under `src/app/api/v1/<domain>/`.

### Identity (`src/lib/identity/`)

User records synced from Clerk. `UserEntity` validates name/email/age; `UserRepository` upserts by Clerk user id.

### Inventory (`src/lib/inventory/`)

SKU and stock tracking.

- `StockLevel` — immutable value object (quantity, reorder threshold); `adjust`/`deduct` return new instances, `deduct` guards against overselling.
- `SkuEntity` — validated SKU aggregate wrapping a `StockLevel`.
- `InventoryRepository` — Drizzle-backed CRUD, accepts an optional transaction executor.
- Use cases: `createSku`, `adjustStock`, `deductStock` (transaction-aware), `getStockLevel`.
- Routes: `POST /api/v1/inventory/sku`, `GET/PATCH .../sku/[id]`, `PATCH .../sku/[id]/adjust`.

### Invoicing (`src/lib/invoicing/`)

Invoice creation with atomic stock deduction.

- Pure calculators: `calculateLineItemSubtotal`, `calculateTax`, `calculateInvoiceTotals`.
- `InvoiceLineItem` / `InvoiceEntity` — validated aggregates; totals are derived, never stored redundantly in memory.
- `createInvoice` — opens one DB transaction, deducts stock for every line item via the inventory domain, then persists the invoice; commits or rolls back together. Publishes an `invoice.created` event after commit for async consumers.
- `generateInvoiceSummary` — human-readable summary string.
- Routes: `POST/GET /api/v1/invoicing/invoice`, `GET .../invoice/[id]`.

### Payroll (`src/lib/payroll/`)

Employee setup and paystub generation with reproducible tax history.

- `EmployeeEntity` — validated aggregate (name, salary, filing status, joining date).
- `Paystub` — value object (gross pay, deductions, net pay, tax rule version used).
- Tax brackets are versioned rows (`tax_rule_version`), not an external tax service — `getTaxRuleForDate` picks the version effective on the given pay date, so historical paystubs stay reproducible even after brackets change.
- `calculateTaxDeductions` — pure function applying progressive brackets per filing status.
- `generatePaystub` — looks up the employee and the effective tax rule, computes deductions, and persists the paystub with the `taxRuleVersionId` it used.
- Routes: `POST /api/v1/payroll/employee`, `POST /api/v1/payroll/paystub`.

## Shared Kernel (`src/lib/shared/`)

- `BaseEntity` / `BaseRepository` — common entity and repository contracts.
- `AppError` and subclasses (`ValidationError`, `NotFoundError`, `UnauthorizedError`) — typed errors mapped to HTTP status codes at the route boundary.
- `eventBus` — in-process pub/sub for domain events.
- `requestContext` — `AsyncLocalStorage`-based request-scoped context (request id, user id, tenant id).
- `logger` / `logger-middleware` — request logging.

## API Conventions

- All domain routes are versioned under `src/app/api/v1/`.
- Route handlers catch `AppError` and respond with `{ error, code }` at the error's status code; unexpected errors rethrow.
- Repositories accept an optional Drizzle executor (`db` or an active transaction) so use cases can compose multi-step writes atomically.

## Database

Schema is defined in `src/db/schema.ts` and pushed directly via `drizzle-kit push` (no migration files checked in yet). Tables: `users`, `sku`, `invoice`, `invoice_line_item`, `employee`, `tax_rule_version`, `paystub`.
