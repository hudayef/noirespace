import { pgTable, text, timestamp, uuid, integer, jsonb } from "drizzle-orm/pg-core"
import { users } from "./auth"

export const schoolInquiries = pgTable("school_inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolName: text("school_name").notNull(),
  picName: text("pic_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  studentCount: integer("student_count"),
  programInterest: text("program_interest"),
  preferredDates: jsonb("preferred_dates").$type<string[]>().default([]),
  locationPreference: text("location_preference"),
  requirements: text("requirements"),
  notes: text("notes"),
  status: text("status", { enum: ["new", "contacted", "proposal_sent", "confirmed", "declined"] }).notNull().default("new"),
  adminNotes: text("admin_notes"),
  handledBy: uuid("handled_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})
