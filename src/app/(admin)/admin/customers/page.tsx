import { requireAdmin } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import { formatDate } from "@/lib/utils/format"
import { Users, MessageSquare } from "lucide-react"

export default async function AdminCustomersPage() {
  await requireAdmin()

  const customerList = await db.query.users.findMany({
    orderBy: [desc(users.createdAt)],
  })

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Users className="h-6 w-6 text-amber-400" />
          <span>Data Pelanggan & Akun</span>
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Daftar seluruh pengguna terdaftar pada platform Noire Space ({customerList.length} akun).
        </p>
      </div>

      <div className="rounded-xl border border-white/[0.08] divide-y divide-white/[0.06] bg-[#121217]">
        {customerList.length === 0 ? (
          <p className="p-8 text-center text-xs text-neutral-400">Belum ada pelanggan terdaftar.</p>
        ) : (
          customerList.map((c) => {
            const cleanPhone = (c.phone || "").replace(/[^0-9]/g, "")
            const waTarget = cleanPhone.startsWith("0") ? `62${cleanPhone.slice(1)}` : cleanPhone
            const waUrl = cleanPhone ? `https://wa.me/${waTarget}` : null

            return (
              <div key={c.id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white">{c.name}</p>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-white/10 bg-white/5 text-neutral-300">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">{c.email} {c.phone ? `• ${c.phone}` : ""}</p>
                  <p className="text-[10px] text-neutral-500">Terdaftar sejak: {formatDate(c.createdAt)}</p>
                </div>

                <div className="flex items-center gap-3">
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition-colors"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
