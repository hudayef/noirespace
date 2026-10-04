import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { getInstructors, createInstructor } from "@/lib/modules/resource/resource.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function AdminInstructorsPage() {
  await requireAdmin()
  const list = await getInstructors(false)

  async function handleCreate(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const slug = (formData.get("slug") as string) || name.toLowerCase().replace(/\s+/g, "-")
    const bio = formData.get("bio") as string

    await createInstructor({
      name,
      slug,
      bio,
      specializations: [],
      status: "active",
    })

    revalidatePath("/admin/instructors")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Instruktur & Mentor</h1>
        <p className="text-muted-foreground text-sm">Daftar mentor dan pengajar program edukasi Noire Space.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border divide-y bg-card">
            {list.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">Belum ada instruktur terdaftar.</p>
            ) : (
              list.map((inst) => (
                <div key={inst.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm">{inst.name}</p>
                    <p className="text-xs text-muted-foreground">{inst.bio || "Mentor Creative Tech"}</p>
                  </div>
                  <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded border bg-muted">
                    {inst.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-lg font-bold">+ Tambah Instruktur</h2>
            <form action={handleCreate} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Nama Lengkap</Label>
                <Input name="name" required placeholder="Alex Pratama" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Bio / Spesialisasi</Label>
                <Input name="bio" placeholder="Commercial Lighting & Photography" />
              </div>
              <Button type="submit" className="w-full text-xs" size="sm">Simpan Mentor</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
