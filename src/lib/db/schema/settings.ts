import { pgTable, text, uuid, jsonb, timestamp } from "drizzle-orm/pg-core"

export const settings = pgTable("settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  group: text("group").notNull(),
  key: text("key").notNull().unique(),
  value: jsonb("value"),
  type: text("type", { enum: ["string", "number", "boolean", "json"] }).notNull().default("string"),
  description: text("description"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})
