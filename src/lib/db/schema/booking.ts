import { pgTable, text, timestamp, uuid, integer, time, date } from "drizzle-orm/pg-core"
import { users } from "./auth"
import { products } from "./catalog"
import { rooms, resources, instructors } from "./resource"
import { schedules } from "./scheduling"
import { orders } from "./commerce"

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingNumber: text("booking_number").notNull().unique(),
  customerId: uuid("customer_id").notNull().references(() => users.id),
  orderId: uuid("order_id").references(() => orders.id),
  productId: uuid("product_id").notNull().references(() => products.id),
  roomId: uuid("room_id").references(() => rooms.id),
  instructorId: uuid("instructor_id").references(() => instructors.id),
  scheduleId: uuid("schedule_id").references(() => schedules.id),
  bookingDate: date("booking_date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  participants: integer("participants").notNull().default(1),
  status: text("status", { enum: ["pending", "confirmed", "in_progress", "completed", "cancelled", "no_show"] }).notNull().default("pending"),
  notes: text("notes"),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  cancelledBy: uuid("cancelled_by"),
  cancellationReason: text("cancellation_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const bookingResources = pgTable("booking_resources", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  resourceId: uuid("resource_id").notNull().references(() => resources.id),
  quantity: integer("quantity").notNull().default(1),
})

export const bookingReschedules = pgTable("booking_reschedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  originalDate: date("original_date").notNull(),
  originalStartTime: time("original_start_time").notNull(),
  originalEndTime: time("original_end_time").notNull(),
  newDate: date("new_date").notNull(),
  newStartTime: time("new_start_time").notNull(),
  newEndTime: time("new_end_time").notNull(),
  reason: text("reason"),
  requestedBy: uuid("requested_by").notNull().references(() => users.id),
  approvedBy: uuid("approved_by").references(() => users.id),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
