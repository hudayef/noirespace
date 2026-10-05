import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { getRooms, getLocations, createRoom, updateRoom, deleteRoom } from "@/lib/modules/resource/resource.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AutoSubmitSelect } from "@/components/ui/auto-submit-select"
import { DoorOpen, Trash2 } from "lucide-react"

export default async function AdminRoomsPage() {
  await requireAdmin()
  const roomList = await getRooms(undefined, false)
  const locations = await getLocations()

  async function handleCreate(formData: FormData) {
    "use server"
    await requireAdmin()
    const name = formData.get("name") as string
    const slug = (formData.get("slug") as string) || name.toLowerCase().replace(/\s+/g, "-")
    const capacity = Number(formData.get("capacity") || 1)
    const locationId = formData.get("locationId") as string

    if (!locationId) return

    await createRoom({
      locationId,
      name,
      slug,
      capacity,
      status: "active",
      images: [],
    })

    revalidatePath("/admin/rooms")
  }

  async function handleStatusChange(formData: FormData) {
    "use server"
    await requireAdmin()
    const id = formData.get("id") as string
    const status = formData.get("status") as "active" | "inactive" | "maintenance"
    if (!id || !status) return

    await updateRoom(id, { status })
    revalidatePath("/admin/rooms")
  }

  async function handleDelete(formData: FormData) {
    "use server"
    await requireAdmin()
    const id = formData.get("id") as string
    if (!id) return

    await deleteRoom(id)
    revalidatePath("/admin/rooms")
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <DoorOpen className="h-6 w-6 text-amber-400" />
          <span>Manajemen Ruangan Studio</span>
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Kelola ruangan fisik studio, kapasitas maksimal, dan status pemeliharaan (maintenance).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-white/[0.08] divide-y divide-white/[0.06] bg-[#121217]">
            {roomList.length === 0 ? (
              <p className="p-8 text-center text-xs text-neutral-400">Belum ada ruangan terdaftar.</p>
            ) : (
              roomList.map((r) => (
                <div key={r.id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-white">{r.name}</p>
                      <span className="text-xs text-neutral-500 font-mono">/{r.slug}</span>
                    </div>
                    <p className="text-xs text-neutral-400">Kapasitas Maksimal: {r.capacity} orang</p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <form action={handleStatusChange}>
                      <input type="hidden" name="id" value={r.id} />
                      <AutoSubmitSelect
                        name="status"
                        defaultValue={r.status}
                        aria-label={`Ubah status ruangan ${r.name}`}
                        className="rounded-md border border-white/[0.12] bg-[#09090b] px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="active">Active</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="inactive">Inactive</option>
                      </AutoSubmitSelect>
                    </form>

                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={r.id} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="text-neutral-500 hover:text-rose-400 h-8 px-2"
                        aria-label={`Hapus ruangan ${r.name}`}
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
            <h2 className="text-base font-bold text-white">+ Tambah Ruangan Baru</h2>
            <form action={handleCreate} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Lokasi Studio</Label>
                <select name="locationId" className="w-full rounded-md border border-white/[0.12] bg-[#09090b] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400" required>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Nama Ruangan</Label>
                <Input name="name" required placeholder="Contoh: Main Studio A" className="bg-[#09090b] text-xs h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Kapasitas Maksimal (Orang)</Label>
                <Input name="capacity" type="number" defaultValue="5" min="1" required className="bg-[#09090b] text-xs h-9" />
              </div>
              <Button type="submit" className="w-full text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200 h-9">
                Simpan Ruangan
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
