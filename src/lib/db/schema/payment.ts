import { pgTable, text, timestamp, uuid, integer, jsonb } from "drizzle-orm/pg-core"
import { orders } from "./commerce"

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id),
  paymentNumber: text("payment_number").notNull().unique(),
  amount: integer("amount").notNull(),
  method: text("method"),
  gateway: text("gateway").notNull().default("midtrans"),
  gatewayReference: text("gateway_reference"),
  gatewayResponse: jsonb("gateway_response").$type<Record<string, unknown>>().default({}),
  status: text("status", { enum: ["pending", "waiting", "paid", "failed", "expired"] }).notNull().default("pending"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  expiredAt: timestamp("expired_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const paymentLogs = pgTable("payment_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  paymentId: uuid("payment_id").notNull().references(() => payments.id, { onDelete: "cascade" }),
  event: text("event").notNull(),
  data: jsonb("data").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
