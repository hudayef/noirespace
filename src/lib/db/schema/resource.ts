import { pgTable, text, timestamp, uuid, integer, jsonb } from "drizzle-orm/pg-core"
import { users } from "./auth"

export const locations = pgTable("locations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  timezone: text("timezone").notNull().default("Asia/Jakarta"),
  status: text("status", { enum: ["active", "inactive"] }).notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  locationId: uuid("location_id").notNull().references(() => locations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  capacity: integer("capacity").notNull().default(1),
  status: text("status", { enum: ["active", "inactive", "maintenance"] }).notNull().default("active"),
  images: jsonb("images").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const resources = pgTable("resources", {
  id: uuid("id").primaryKey().defaultRandom(),
  locationId: uuid("location_id").notNull().references(() => locations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type", { enum: ["equipment", "camera", "lighting", "other"] }).notNull(),
  description: text("description"),
  quantity: integer("quantity").notNull().default(1),
  status: text("status", { enum: ["active", "inactive"] }).notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const instructors = pgTable("instructors", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  bio: text("bio"),
  specializations: jsonb("specializations").$type<string[]>().default([]),
  photo: text("photo"),
  status: text("status", { enum: ["active", "inactive"] }).notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})
