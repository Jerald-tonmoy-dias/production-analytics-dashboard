import { z } from "zod";
import { CURRENCY, ORDER_STATUSES } from "@/lib/constants";
import { customerSchema } from "@/lib/schemas/customer";

export const orderStatusSchema = z.enum(ORDER_STATUSES);

const moneySchema = z.number().finite().nonnegative();

export const orderItemSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  quantity: z.int().positive(),
  unitPrice: moneySchema,
});

export const orderRecordSchema = z
  .object({
    id: z.string().min(1),
    customerId: z.string().min(1),
    amount: moneySchema,
    currency: z.literal(CURRENCY),
    status: orderStatusSchema,
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    items: z.array(orderItemSchema).min(1),
  })
  .refine(
    (order) => {
      const sum = order.items.reduce(
        (total, item) => total + item.quantity * item.unitPrice,
        0
      );
      return Math.round(sum * 100) === Math.round(order.amount * 100);
    },
    { message: "amount must equal the sum of line items", path: ["amount"] }
  )
  .refine(
    (order) => order.updatedAt >= order.createdAt,
    { message: "updatedAt must be on or after createdAt", path: ["updatedAt"] }
  );

export const ordersSchema = z.array(orderRecordSchema).min(1);

export const orderListItemSchema = z.object({
  id: z.string().min(1),
  customerId: z.string().min(1),
  customerName: z.string().min(1),
  customerEmail: z.email(),
  /** Primary line-item name (first item). */
  productName: z.string().min(1),
  /** Primary line-item SKU (first item). */
  productSku: z.string().min(1),
  /** Total line items on the order (`1` when a single product). */
  itemCount: z.number().int().positive(),
  amount: moneySchema,
  currency: z.literal(CURRENCY),
  status: orderStatusSchema,
  createdAt: z.iso.datetime(),
});

export const orderDetailSchema = orderListItemSchema.extend({
  updatedAt: z.iso.datetime(),
  items: z.array(orderItemSchema).min(1),
  customer: customerSchema,
});

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type OrderRecord = z.infer<typeof orderRecordSchema>;
export type OrderListItem = z.infer<typeof orderListItemSchema>;
export type OrderDetail = z.infer<typeof orderDetailSchema>;
