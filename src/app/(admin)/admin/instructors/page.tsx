import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { getInstructors, createInstructor, updateInstructor, deleteInstructor } from "@/lib/modules/resource/resource.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AutoSubmitSelect } from "@/components/ui/auto-submit-select"
import { Users, Trash2 } from "lucide-react"

export default async function AdminInstructorsPage() {
  await requireAdmin()
  const list = await getInstructors(false)

  async function handleCreate(formData: FormData) {
    "use server"
    await requireAdmin()
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

  async function handleStatusChange(formData: FormData) {
    "use server"
    await requireAdmin()
    const id = formData.get("id") as string
    const status = formData.get("status") as "active" | "inactive"
    if (!id || !status) return

    await updateInstructor(id, { status })
    revalidatePath("/admin/instructors")
  }

  async function handleDelete(formData: FormData) {
    "use server"
    await requireAdmin()
    const id = formData.get("id") as string
    if (!id) return

    await deleteInstructor(id)
    revalidatePath("/admin/instructors")
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Users className="h-6 w-6 text-[#f3f1eb]" />
          <span>Instruktur & Mentor</span>
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Daftar mentor dan pengajar program edukasi serta sesi asistensi Noire Space.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-white/[0.08] divide-y divide-white/[0.06] bg-[#121217]">
            {list.length === 0 ? (
              <p className="p-8 text-center text-xs text-neutral-400">Belum ada instruktur terdaftar.</p>
            ) : (
              list.map((inst) => (
                <div key={inst.id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-white">{inst.name}</p>
                    <p className="text-xs text-neutral-400">{inst.bio || "Mentor Creative Tech"}</p>
                    <span className="text-[10px] text-neutral-500 font-mono">/{inst.slug}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <form action={handleStatusChange}>
                      <input type="hidden" name="id" value={inst.id} />
                      <AutoSubmitSelect
                        name="status"
                        defaultValue={inst.status}
                        aria-label={`Ubah status mentor ${inst.name}`}
                        className="rounded-md border border-white/[0.12] bg-[#09090b] px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#f3f1eb]/[0.4]"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </AutoSubmitSelect>
                    </form>

                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={inst.id} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="text-neutral-500 hover:text-[#e88] h-8 px-2"
                        aria-label={`Hapus mentor ${inst.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 space-y-4">
            <h2 className="text-base font-bold text-white">+ Tambah Instruktur Baru</h2>
            <form action={handleCreate} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Nama Lengkap</Label>
                <Input name="name" required placeholder="Alex Pratama" className="bg-[#09090b] text-xs h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Slug (Opsional)</Label>
                <Input name="slug" placeholder="alex-pratama" className="bg-[#09090b] text-xs h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Bio / Spesialisasi</Label>
                <Input name="bio" placeholder="Commercial Lighting & Photography" className="bg-[#09090b] text-xs h-9" />
              </div>
              <Button type="submit" className="w-full text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200 h-9">
                Simpan Mentor
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
