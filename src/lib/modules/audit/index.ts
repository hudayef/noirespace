import { db } from "@/lib/db"
import { auditLogs } from "@/lib/db/schema"

export async function logAudit(params: {
  userId?: string
  action: string
  entityType: string
  entityId: string
  before?: Record<string, unknown>
  after?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}) {
  await db.insert(auditLogs).values(params)
}
