import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { getResources, getLocations, createResource } from "@/lib/modules/resource/resource.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function AdminResourcesPage() {
  await requireAdmin()
  const resourceList = await getResources(undefined, false)
  const locations = await getLocations()

  async function handleCreate(formData: FormData) {
    "use server"
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manajemen Alat & Peralatan</h1>
        <p className="text-muted-foreground text-sm">Kelola kamera, lampu studio, dan peralatan teknis lainnya.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border divide-y bg-card">
            {resourceList.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">Belum ada inventaris alat.</p>
            ) : (
              resourceList.map((res) => (
                <div key={res.id} className="p-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs uppercase font-bold text-muted-foreground">{res.type}</span>
                    <p className="font-bold text-sm">{res.name}</p>
                    <p className="text-xs text-muted-foreground">Jumlah Stok: {res.quantity} unit</p>
                  </div>
                  <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded border bg-muted">
                    {res.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-lg font-bold">+ Tambah Peralatan</h2>
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
                <Label className="text-xs">Nama Alat</Label>
                <Input name="name" required placeholder="Godox SL-60W LED" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tipe Alat</Label>
                <select name="type" className="w-full rounded-md border bg-background px-3 py-2 text-xs">
                  <option value="lighting">Lighting</option>
                  <option value="camera">Kamera</option>
                  <option value="equipment">Aksesoris / Stand</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Jumlah Stok Unit</Label>
                <Input name="quantity" type="number" defaultValue="1" min="1" required />
              </div>
              <Button type="submit" className="w-full text-xs" size="sm">Simpan Alat</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
