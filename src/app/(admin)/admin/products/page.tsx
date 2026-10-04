import { requireAdmin } from "@/lib/modules/auth/rbac"
import { getProducts, getCategories } from "@/lib/modules/catalog/catalog.service"
import { formatRupiah } from "@/lib/utils/format"
import { createProductAction, deleteProductAction } from "@/lib/modules/catalog/catalog.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function AdminProductsPage() {
  await requireAdmin()
  const productList = await getProducts()
  const categoriesList = await getCategories(false)

  async function handleCreate(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const slug = (formData.get("slug") as string) || name.toLowerCase().replace(/\s+/g, "-")
    const type = formData.get("type") as "education" | "studio" | "service" | "school"
    const price = Number(formData.get("price") || 0)
    const durationMinutes = formData.get("duration") ? Number(formData.get("duration")) : undefined
    const capacity = formData.get("capacity") ? Number(formData.get("capacity")) : undefined
    const categoryId = (formData.get("categoryId") as string) || undefined

    await createProductAction({
      name,
      slug,
      type,
      price,
      durationMinutes,
      capacity,
      categoryId,
      status: "published",
      minBookingNoticeHours: 24,
      maxAdvanceBookingDays: 30,
      bufferMinutes: 15,
      requiresInstructor: false,
      requiresRoom: false,
      featured: false,
      images: [],
      includes: [],
      requirements: [],
    })
  }

  async function handleDelete(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    if (id) await deleteProductAction(id)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manajemen Produk & Layanan</h1>
        <p className="text-muted-foreground text-sm">Kelola katalog kelas edukasi, rental studio, dan creative services.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold">Daftar Produk ({productList.length})</h2>
          <div className="rounded-lg border divide-y bg-card">
            {productList.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">Belum ada produk terdaftar.</p>
            ) : (
              productList.map((p) => (
                <div key={p.id} className="p-4 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-muted">
                        {p.type}
                      </span>
                      <span className="text-xs text-muted-foreground">/{p.slug}</span>
                    </div>
                    <p className="font-bold mt-1">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatRupiah(p.price)} | {p.durationMinutes || 60} menit | Kapasitas: {p.capacity || 1}
                    </p>
                  </div>
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={p.id} />
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                      Hapus
                    </Button>
                  </form>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-lg font-bold">+ Tambah Produk Baru</h2>
            <form action={handleCreate} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Nama Produk / Sesi</Label>
                <Input name="name" required placeholder="Contoh: Studio 60 Menit" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Slug URL</Label>
                <Input name="slug" placeholder="studio-60-menit" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tipe Layanan</Label>
                <select name="type" className="w-full rounded-md border bg-background px-3 py-2 text-xs">
                  <option value="studio">Studio Experience</option>
                  <option value="education">Education Program</option>
                  <option value="service">Creative Service</option>
                  <option value="school">School Program</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Harga (IDR)</Label>
                  <Input name="price" type="number" defaultValue="150000" required />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Durasi (Menit)</Label>
                  <Input name="duration" type="number" defaultValue="60" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Kapasitas Maksimal Peserta</Label>
                <Input name="capacity" type="number" defaultValue="1" />
              </div>
              <Button type="submit" className="w-full text-xs" size="sm">
                Simpan & Publikasikan
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
