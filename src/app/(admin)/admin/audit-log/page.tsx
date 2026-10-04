import { requireAdmin } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { auditLogs, users } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { formatDate } from "@/lib/utils/format"

export default async function AdminAuditLogPage() {
  await requireAdmin()

  const logs = await db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      entityType: auditLogs.entityType,
      entityId: auditLogs.entityId,
      createdAt: auditLogs.createdAt,
      actorName: users.name,
      actorEmail: users.email,
    })
    .from(auditLogs)
    .leftJoin(users, eq(auditLogs.userId, users.id))
    .orderBy(desc(auditLogs.createdAt))
    .limit(50)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Log Sistem</h1>
        <p className="text-muted-foreground text-sm">Pencatatan riwayat aktivitas operasional penting oleh admin dan staff.</p>
      </div>

      <div className="rounded-lg border divide-y bg-card font-mono text-xs">
        {logs.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground">Belum ada riwayat aktivitas tercatat.</p>
        ) : (
          logs.map((l) => (
            <div key={l.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <span className="font-bold text-foreground">[{l.action.toUpperCase()}]</span> {l.entityType} ({l.entityId})
                <p className="text-muted-foreground">Aktor: {l.actorName ? `${l.actorName} (${l.actorEmail})` : "Sistem"}</p>
              </div>
              <span className="text-muted-foreground">{formatDate(l.createdAt)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
