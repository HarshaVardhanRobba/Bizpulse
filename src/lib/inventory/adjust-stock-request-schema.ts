import { z } from "zod";

export const adjustStockRequestSchema = z.object({
  delta: z.number().int(),
});
