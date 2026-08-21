import { z } from "zod";

export const createInvoiceLineItemSchema = z.object({
  skuId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
});

export const createInvoiceRequestSchema = z.object({
  tenantId: z.number().int().nullable().optional(),
  customerId: z.number().int().positive(),
  lineItems: z.array(createInvoiceLineItemSchema).min(1),
});
