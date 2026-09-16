import { z } from "zod";
import { CUSTOMER_STATUSES } from "@/lib/constants";

export const customerStatusSchema = z.enum(CUSTOMER_STATUSES);

export const customerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.email(),
  status: customerStatusSchema,
  createdAt: z.iso.datetime(),
});

export const customersSchema = z.array(customerSchema).min(1);

export type Customer = z.infer<typeof customerSchema>;
export type CustomerStatus = z.infer<typeof customerStatusSchema>;
