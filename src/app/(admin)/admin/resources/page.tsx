import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { getResources, getLocations, createResource, updateResource, deleteResource } from "@/lib/modules/resource/resource.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AutoSubmitSelect } from "@/components/ui/auto-submit-select"
import { Wrench, Trash2 } from "lucide-react"

export default async function AdminResourcesPage() {
  await requireAdmin()
  const resourceList = await getResources(undefined, false)
  const locations = await getLocations()

  async function handleCreate(formData: FormData) {
    "use server"
    await requireAdmin()
    const name = formData.get("name") as string
    const type = formData.get("type") as "equipment" | "camera" | "lighting" | "other"
    const quantity = Number(formData.get("quantity") || 1)
    const locationId = formData.get("locationId") as string

    if (!locationId) return

    await createResource({
      locationId,
      name,
      type,
      quantity,
      status: "active",
    })

    revalidatePath("/admin/resources")
  }

  async function handleStatusChange(formData: FormData) {
    "use server"
    await requireAdmin()
    const id = formData.get("id") as string
    const status = formData.get("status") as "active" | "inactive"
    if (!id || !status) return

    await updateResource(id, { status })
    revalidatePath("/admin/resources")
  }

  async function handleDelete(formData: FormData) {
    "use server"
    await requireAdmin()
    const id = formData.get("id") as string
    if (!id) return

    await deleteResource(id)
    revalidatePath("/admin/resources")
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Wrench className="h-6 w-6 text-amber-400" />
          <span>Manajemen Alat & Peralatan</span>
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Kelola kamera, lighting studio, C-stand, dan inventaris teknis lainnya.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-white/[0.08] divide-y divide-white/[0.06] bg-[#121217]">
            {resourceList.length === 0 ? (
              <p className="p-8 text-center text-xs text-neutral-400">Belum ada inventaris alat terdaftar.</p>
            ) : (
              resourceList.map((res) => (
                <div key={res.id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400/90">{res.type}</span>
                    <p className="font-bold text-sm text-white">{res.name}</p>
                    <p className="text-xs text-neutral-400">Jumlah Stok: {res.quantity} unit</p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <form action={handleStatusChange}>
                      <input type="hidden" name="id" value={res.id} />
                      <AutoSubmitSelect
                        name="status"
                        defaultValue={res.status}
                        aria-label={`Ubah status resource ${res.name}`}
                        className="rounded-md border border-white/[0.12] bg-[#09090b] px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </AutoSubmitSelect>
                    </form>

                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={res.id} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="text-neutral-500 hover:text-rose-400 h-8 px-2"
                        aria-label={`Hapus alat ${res.name}`}
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
            <h2 className="text-base font-bold text-white">+ Tambah Peralatan</h2>
            <form action={handleCreate} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Lokasi Hub</Label>
                <select name="locationId" className="w-full rounded-md border border-white/[0.12] bg-[#09090b] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400" required>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Nama Alat</Label>
                <Input name="name" required placeholder="Godox SL-60W LED" className="bg-[#09090b] text-xs h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Kategori / Tipe</Label>
                <select name="type" className="w-full rounded-md border border-white/[0.12] bg-[#09090b] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400">
                  <option value="lighting">Lighting</option>
                  <option value="camera">Kamera</option>
                  <option value="equipment">Aksesoris / Stand</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Jumlah Stok Unit</Label>
                <Input name="quantity" type="number" defaultValue="1" min="1" required className="bg-[#09090b] text-xs h-9" />
              </div>
              <Button type="submit" className="w-full text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200 h-9">
                Simpan Alat
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
