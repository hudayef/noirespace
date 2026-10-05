import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default async function ProfilePage() {
  const authUser = await requireAuth()
  const user = await db.query.users.findFirst({
    where: eq(users.id, authUser.id),
  })

  async function handleUpdateProfile(formData: FormData) {
    "use server"
    const session = await requireAuth()
    const name = formData.get("name") as string
    const phone = formData.get("phone") as string

    if (!name) return

    await db
      .update(users)
      .set({
        name,
        phone: phone || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.id))

    revalidatePath("/account/profile")
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Profil Saya</h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Informasi kontak untuk konfirmasi jadwal dan notifikasi WhatsApp Noire Space.
        </p>
      </div>

      <form action={handleUpdateProfile} className="rounded-xl border border-white/[0.08] p-6 space-y-4 bg-[#121217]">
        <div className="space-y-1.5">
          <Label className="text-xs text-neutral-300">Nama Lengkap</Label>
          <Input
            name="name"
            defaultValue={user?.name || ""}
            required
            className="bg-[#09090b] text-sm h-10 border-white/[0.12] text-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-neutral-300">Alamat Email (Akun)</Label>
          <Input
            value={user?.email || ""}
            disabled
            className="bg-[#09090b]/50 text-sm h-10 border-white/[0.08] text-neutral-400 cursor-not-allowed"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-neutral-300">Nomor WhatsApp / Telepon</Label>
          <Input
            name="phone"
            type="tel"
            defaultValue={user?.phone || ""}
            placeholder="0812xxxxxxxx"
            className="bg-[#09090b] text-sm h-10 border-white/[0.12] text-white"
          />
          <p className="text-[11px] text-neutral-500">
            Digunakan untuk pengiriman konfirmasi booking dan reminder sesi otomatis.
          </p>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            size="sm"
            className="h-10 px-6 text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200"
          >
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  )
}
