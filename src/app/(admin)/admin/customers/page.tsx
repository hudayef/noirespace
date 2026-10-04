import { requireAdmin } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import { formatDate } from "@/lib/utils/format"

export default async function AdminCustomersPage() {
  await requireAdmin()

  const customerList = await db.query.users.findMany({
    orderBy: [desc(users.createdAt)],
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Data Pelanggan</h1>
        <p className="text-muted-foreground text-sm">Daftar pengguna terdaftar pada platform Noire Space.</p>
      </div>

      <div className="rounded-lg border divide-y bg-card">
        {customerList.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">Belum ada pelanggan terdaftar.</p>
        ) : (
          customerList.map((c) => (
            <div key={c.id} className="p-4 flex justify-between items-center text-sm">
              <div className="space-y-0.5">
                <p className="font-bold">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.email} | {c.phone || "Tidak ada nomor"}</p>
                <p className="text-[10px] text-muted-foreground">Bergabung: {formatDate(c.createdAt)}</p>
              </div>
              <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded border bg-muted">
                {c.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
