import { z } from "zod";
import { ACTIVITY_TYPES } from "@/lib/constants";

export const activityTypeSchema = z.enum(ACTIVITY_TYPES);

export const activitySchema = z.object({
  id: z.string().min(1),
  type: activityTypeSchema,
  message: z.string().min(1),
  createdAt: z.iso.datetime(),
  orderId: z.string().min(1).optional(),
  customerId: z.string().min(1).optional(),
});

export const activitiesSchema = z.array(activitySchema).min(1);

export const activitiesListResponseSchema = z.object({
  data: z.array(activitySchema),
});

export type Activity = z.infer<typeof activitySchema>;
export type ActivityType = z.infer<typeof activityTypeSchema>;
export type ActivitiesListResponse = z.infer<typeof activitiesListResponseSchema>;
