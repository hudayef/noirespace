import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { getRooms, getLocations, createRoom } from "@/lib/modules/resource/resource.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function AdminRoomsPage() {
  await requireAdmin()
  const roomList = await getRooms(undefined, false)
  const locations = await getLocations()

  async function handleCreate(formData: FormData) {
    "use server"
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manajemen Ruangan Studio</h1>
        <p className="text-muted-foreground text-sm">Kelola ruangan fisik studio dan kapasitas maksimal.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border divide-y bg-card">
            {roomList.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">Belum ada ruangan terdaftar.</p>
            ) : (
              roomList.map((r) => (
                <div key={r.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">Kapasitas: {r.capacity} orang | Status: {r.status}</p>
                  </div>
                  <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded border bg-muted">
                    {r.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-lg font-bold">+ Tambah Ruangan</h2>
            <form action={handleCreate} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Lokasi</Label>
                <select name="locationId" className="w-full rounded-md border bg-background px-3 py-2 text-xs" required>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Nama Ruangan</Label>
                <Input name="name" required placeholder="Contoh: Main Studio A" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Kapasitas Maksimal</Label>
                <Input name="capacity" type="number" defaultValue="5" required />
              </div>
              <Button type="submit" className="w-full text-xs" size="sm">Simpan Ruangan</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
