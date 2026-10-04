import { z } from "zod"

export const businessHoursSchema = z.object({
  locationId: z.string().uuid("ID lokasi tidak valid"),
  dayOfWeek: z.number().int().min(0).max(6),
  openTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, "Format waktu salah"),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, "Format waktu salah"),
  isClosed: z.boolean().default(false),
})

export const scheduleSchema = z.object({
  productId: z.string().uuid("ID produk tidak valid"),
  roomId: z.string().uuid().nullable().optional(),
  instructorId: z.string().uuid().nullable().optional(),
  dayOfWeek: z.number().int().min(0).max(6).nullable().optional(),
  specificDate: z.string().nullable().optional(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, "Format waktu salah"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, "Format waktu salah"),
  capacity: z.number().int().positive().nullable().optional(),
  recurrenceType: z.enum(["weekly", "specific"]).default("weekly"),
  status: z.enum(["active", "inactive"]).default("active"),
})

export const blockedDateSchema = z.object({
  locationId: z.string().uuid().nullable().optional(),
  roomId: z.string().uuid().nullable().optional(),
  instructorId: z.string().uuid().nullable().optional(),
  date: z.string(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).nullable().optional(),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).nullable().optional(),
  reason: z.string().optional(),
  type: z.enum(["holiday", "maintenance", "personal"]),
})

export type BusinessHoursInput = z.infer<typeof businessHoursSchema>
export type ScheduleInput = z.infer<typeof scheduleSchema>
export type BlockedDateInput = z.infer<typeof blockedDateSchema>
