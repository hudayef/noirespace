import { pgTable, text, timestamp, uuid, integer, jsonb } from "drizzle-orm/pg-core"
import { users } from "./auth"
import { products } from "./catalog"

export const carts = pgTable("carts", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  cartId: uuid("cart_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id),
  scheduleId: uuid("schedule_id"),
  bookingDate: text("booking_date"),
  startTime: text("start_time"),
  endTime: text("end_time"),
  quantity: integer("quantity").notNull().default(1),
  price: integer("price").notNull(),
  options: jsonb("options").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: text("order_number").notNull().unique(),
  customerId: uuid("customer_id").notNull().references(() => users.id),
  subtotal: integer("subtotal").notNull().default(0),
  discount: integer("discount").notNull().default(0),
  tax: integer("tax").notNull().default(0),
  total: integer("total").notNull().default(0),
  status: text("status", { enum: ["pending", "awaiting_payment", "paid", "fulfilled", "cancelled"] }).notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id),
  bookingId: uuid("booking_id"),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: integer("unit_price").notNull(),
  total: integer("total").notNull(),
  options: jsonb("options").$type<Record<string, unknown>>().default({}),
})
