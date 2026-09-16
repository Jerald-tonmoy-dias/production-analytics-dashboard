import { z } from "zod";
import { ERROR_CODES } from "@/lib/errors";

export const errorDetailSchema = z.object({
  field: z.string(),
  issue: z.string(),
});

export const errorEnvelopeSchema = z.object({
  error: z.object({
    code: z.enum(ERROR_CODES),
    message: z.string().min(1),
    details: z.array(errorDetailSchema).optional(),
  }),
});
