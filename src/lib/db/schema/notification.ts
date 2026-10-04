import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core"
import { users } from "./auth"

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  channel: text("channel", { enum: ["email", "whatsapp", "in_app"] }).notNull().default("email"),
  title: text("title").notNull(),
  body: text("body").notNull(),
  data: jsonb("data").$type<Record<string, unknown>>().default({}),
  readAt: timestamp("read_at", { withTimezone: true }),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
