import { z } from "zod";

export const createSkuRequestSchema = z.object({
  tenantId: z.number().int().nullable().optional(),
  name: z.string().trim().min(1),
  skuCode: z.string().trim().min(1),
  quantity: z.number().int().nonnegative().optional().default(0),
  reorderThreshold: z.number().int().nonnegative().optional().default(0),
});
