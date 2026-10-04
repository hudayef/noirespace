import { requireAuth } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function ProfilePage() {
  const authUser = await requireAuth()
  const user = await db.query.users.findFirst({
    where: eq(users.id, authUser.id),
  })

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-muted-foreground text-sm">Informasi akun dan kontak terdaftar Anda.</p>
      </div>

      <div className="rounded-lg border p-6 space-y-4 bg-card">
        <div className="space-y-1">
          <Label className="text-xs">Nama Lengkap</Label>
          <Input value={user?.name || ""} disabled />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Alamat Email</Label>
          <Input value={user?.email || ""} disabled />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Nomor Telepon</Label>
          <Input value={user?.phone || "-"} disabled />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Status Akun</Label>
          <Input value={user?.status || "active"} disabled className="uppercase font-semibold" />
        </div>
      </div>
    </div>
  )
}
