import { requireAdmin } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { auditLogs, users } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { formatDate } from "@/lib/utils/format"
import { ScrollText } from "lucide-react"

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
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <ScrollText className="h-6 w-6 text-[#f3f1eb]" />
          <span>Audit Log Sistem</span>
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Pencatatan riwayat aktivitas operasional penting oleh admin dan staff untuk akuntabilitas.
        </p>
      </div>

      <div className="rounded-xl border border-white/[0.08] divide-y divide-white/[0.06] bg-[#121217] font-mono text-xs">
        {logs.length === 0 ? (
          <p className="p-8 text-center text-neutral-500 font-sans">Belum ada riwayat aktivitas tercatat.</p>
        ) : (
          logs.map((l) => (
            <div key={l.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div className="space-y-1">
                <div>
                  <span className="font-bold text-[#e8e6df]">[{l.action.toUpperCase()}]</span>{" "}
                  <span className="text-white">{l.entityType}</span>{" "}
                  <span className="text-neutral-500 font-mono text-[10px]">({l.entityId})</span>
                </div>
                <p className="text-neutral-400 font-sans text-xs">
                  Aktor: <strong className="text-neutral-200">{l.actorName ? `${l.actorName} (${l.actorEmail})` : "Sistem"}</strong>
                </p>
              </div>
              <span className="text-neutral-500 text-[11px] shrink-0">{formatDate(l.createdAt)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
