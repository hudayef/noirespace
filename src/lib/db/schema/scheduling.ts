import { pgTable, text, timestamp, uuid, integer, time, date, boolean, index } from "drizzle-orm/pg-core"
import { locations, rooms, instructors } from "./resource"
import { products } from "./catalog"

export const businessHours = pgTable("business_hours", {
  id: uuid("id").primaryKey().defaultRandom(),
  locationId: uuid("location_id").notNull().references(() => locations.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(),
  openTime: time("open_time").notNull(),
  closeTime: time("close_time").notNull(),
  isClosed: boolean("is_closed").notNull().default(false),
})

export const schedules = pgTable("schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  roomId: uuid("room_id").references(() => rooms.id, { onDelete: "set null" }),
  instructorId: uuid("instructor_id").references(() => instructors.id, { onDelete: "set null" }),
  dayOfWeek: integer("day_of_week"),
  specificDate: date("specific_date"),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  capacity: integer("capacity"),
  recurrenceType: text("recurrence_type", { enum: ["weekly", "specific"] }).notNull().default("weekly"),
  status: text("status", { enum: ["active", "inactive"] }).notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index("idx_schedules_product_day").on(table.productId, table.dayOfWeek),
  index("idx_schedules_status").on(table.status),
])

export const blockedDates = pgTable("blocked_dates", {
  id: uuid("id").primaryKey().defaultRandom(),
  locationId: uuid("location_id").references(() => locations.id, { onDelete: "cascade" }),
  roomId: uuid("room_id").references(() => rooms.id, { onDelete: "cascade" }),
  instructorId: uuid("instructor_id").references(() => instructors.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  startTime: time("start_time"),
  endTime: time("end_time"),
  reason: text("reason"),
  type: text("type", { enum: ["holiday", "maintenance", "personal"] }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
