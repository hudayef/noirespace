import { pgTable, text, timestamp, uuid, integer, boolean, jsonb } from "drizzle-orm/pg-core"

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentId: uuid("parent_id"),
  sortOrder: integer("sort_order").notNull().default(0),
  status: text("status", { enum: ["active", "inactive"] }).notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  type: text("type", { enum: ["education", "studio", "service", "school"] }).notNull(),
  description: text("description"),
  shortDescription: text("short_description"),
  price: integer("price").notNull().default(0),
  comparePrice: integer("compare_price"),
  durationMinutes: integer("duration_minutes"),
  capacity: integer("capacity"),
  minBookingNoticeHours: integer("min_booking_notice_hours").notNull().default(24),
  maxAdvanceBookingDays: integer("max_advance_booking_days").notNull().default(30),
  bufferMinutes: integer("buffer_minutes").notNull().default(15),
  requiresInstructor: boolean("requires_instructor").notNull().default(false),
  requiresRoom: boolean("requires_room").notNull().default(false),
  status: text("status", { enum: ["draft", "published", "archived"] }).notNull().default("draft"),
  featured: boolean("featured").notNull().default(false),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  images: jsonb("images").$type<string[]>().default([]),
  includes: jsonb("includes").$type<string[]>().default([]),
  requirements: jsonb("requirements").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const productResources = pgTable("product_resources", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  resourceId: uuid("resource_id").notNull(),
  isRequired: boolean("is_required").notNull().default(true),
})
