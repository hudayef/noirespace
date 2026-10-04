import { db } from "@/lib/db"
import { schedules, businessHours, blockedDates } from "@/lib/db/schema"
import { eq, and, desc } from "drizzle-orm"
import type { ScheduleInput, BusinessHoursInput, BlockedDateInput } from "@/lib/validators/scheduling"

export async function getSchedules(productId?: string) {
  if (productId) {
    return db.query.schedules.findMany({
      where: and(eq(schedules.productId, productId), eq(schedules.status, "active")),
      orderBy: [schedules.dayOfWeek, schedules.startTime],
    })
  }
  return db.query.schedules.findMany({
    orderBy: [desc(schedules.createdAt)],
  })
}

export async function getScheduleById(id: string) {
  return db.query.schedules.findFirst({ where: eq(schedules.id, id) })
}

export async function createSchedule(data: ScheduleInput) {
  const [created] = await db.insert(schedules).values(data).returning()
  return created
}

export async function updateSchedule(id: string, data: Partial<ScheduleInput>) {
  const [updated] = await db
    .update(schedules)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schedules.id, id))
    .returning()
  return updated
}

export async function deleteSchedule(id: string) {
  const [deleted] = await db.delete(schedules).where(eq(schedules.id, id)).returning()
  return deleted
}

export async function getBusinessHours(locationId?: string) {
  if (locationId) {
    return db.query.businessHours.findMany({
      where: eq(businessHours.locationId, locationId),
      orderBy: [businessHours.dayOfWeek],
    })
  }
  return db.query.businessHours.findMany({
    orderBy: [businessHours.dayOfWeek],
  })
}

export async function upsertBusinessHours(data: BusinessHoursInput) {
  const existing = await db.query.businessHours.findFirst({
    where: and(
      eq(businessHours.locationId, data.locationId),
      eq(businessHours.dayOfWeek, data.dayOfWeek)
    ),
  })

  if (existing) {
    const [updated] = await db
      .update(businessHours)
      .set(data)
      .where(eq(businessHours.id, existing.id))
      .returning()
    return updated
  }

  const [created] = await db.insert(businessHours).values(data).returning()
  return created
}

export async function getBlockedDates(date?: string) {
  if (date) {
    return db.query.blockedDates.findMany({
      where: eq(blockedDates.date, date),
    })
  }
  return db.query.blockedDates.findMany({
    orderBy: [desc(blockedDates.date)],
  })
}

export async function createBlockedDate(data: BlockedDateInput) {
  const [created] = await db.insert(blockedDates).values(data).returning()
  return created
}

export async function deleteBlockedDate(id: string) {
  const [deleted] = await db.delete(blockedDates).where(eq(blockedDates.id, id)).returning()
  return deleted
}
