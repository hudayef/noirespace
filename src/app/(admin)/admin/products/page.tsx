import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { getProducts, getCategories } from "@/lib/modules/catalog/catalog.service"
import { formatRupiah } from "@/lib/utils/format"
import { createProductAction, deleteProductAction } from "@/lib/modules/catalog/catalog.actions"
import { DeleteProductButton } from "@/components/features/admin/delete-product-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, Plus } from "lucide-react"

export default async function AdminProductsPage() {
  await requireAdmin()
  const productList = await getProducts()
  const categoriesList = await getCategories(false)

  async function handleCreate(formData: FormData) {
    "use server"
    await requireAdmin()
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
    revalidatePath("/admin/products")
  }

  async function handleDelete(id: string) {
    "use server"
    await requireAdmin()
    await deleteProductAction(id)
    revalidatePath("/admin/products")
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Package className="h-6 w-6 text-[#f3f1eb]" />
          <span>Katalog Produk & Sesi</span>
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Kelola paket rental studio, program edukasi kreator, dan layanan komersial Noire Space.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
              Daftar Layanan Aktif ({productList.length})
            </h2>
          </div>

          <div className="rounded-xl border border-white/[0.08] divide-y divide-white/[0.06] bg-[#121217]">
            {productList.length === 0 ? (
              <p className="p-8 text-center text-xs text-neutral-400">Belum ada produk terdaftar dalam katalog.</p>
            ) : (
              productList.map((p) => (
                <div key={p.id} className="p-4 sm:p-5 flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-white/10 bg-white/5 text-neutral-300">
                        {p.type}
                      </span>
                      <span className="text-xs text-neutral-500 font-mono">/{p.slug}</span>
                    </div>
                    <p className="font-bold text-sm sm:text-base text-white">{p.name}</p>
                    <p className="text-xs text-neutral-400">
                      <strong className="text-[#e8e6df]">{formatRupiah(p.price)}</strong> • {p.durationMinutes || 60} Menit • Kapasitas: {p.capacity || 1}
                    </p>
                  </div>

                  <DeleteProductButton productId={p.id} productName={p.name} onDelete={handleDelete} />
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 space-y-5 sticky top-24">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="h-4 w-4 text-[#f3f1eb]" />
              <span>Tambah Produk Baru</span>
            </h2>

            <form action={handleCreate} className="space-y-3.5">
              <div className="space-y-1">
                <Label htmlFor="prod-name" className="text-xs text-neutral-300">Nama Produk / Sesi</Label>
                <Input id="prod-name" name="name" required placeholder="Contoh: Studio 60 Menit" className="bg-[#09090b] text-xs h-9" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="prod-slug" className="text-xs text-neutral-300">Slug URL (Opsional)</Label>
                <Input id="prod-slug" name="slug" placeholder="studio-60-menit" className="bg-[#09090b] text-xs h-9" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="prod-type" className="text-xs text-neutral-300">Tipe Layanan</Label>
                <select id="prod-type" name="type" className="w-full rounded-md border border-white/[0.12] bg-[#09090b] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f3f1eb]/[0.4]">
                  <option value="studio">Studio Experience</option>
                  <option value="education">Education Program</option>
                  <option value="service">Creative Service</option>
                  <option value="school">School Program</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="prod-category" className="text-xs text-neutral-300">Kategori (Opsional)</Label>
                <select id="prod-category" name="categoryId" className="w-full rounded-md border border-white/[0.12] bg-[#09090b] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f3f1eb]/[0.4]">
                  <option value="">Tanpa Kategori</option>
                  {categoriesList.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="prod-price" className="text-xs text-neutral-300">Tarif (IDR)</Label>
                  <Input id="prod-price" name="price" type="number" defaultValue="150000" required className="bg-[#09090b] text-xs h-9" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="prod-duration" className="text-xs text-neutral-300">Durasi (Menit)</Label>
                  <Input id="prod-duration" name="duration" type="number" defaultValue="60" className="bg-[#09090b] text-xs h-9" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="prod-capacity" className="text-xs text-neutral-300">Kapasitas Maksimal</Label>
                <Input id="prod-capacity" name="capacity" type="number" defaultValue="1" className="bg-[#09090b] text-xs h-9" />
              </div>

              <Button type="submit" className="w-full text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200 h-10 mt-2">
                Simpan & Publikasikan
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
