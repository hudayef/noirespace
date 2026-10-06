import { requireAdmin } from "@/lib/modules/auth/rbac"
import { getCategories } from "@/lib/modules/catalog/catalog.service"
import { createCategoryAction, deleteCategoryAction } from "@/lib/modules/catalog/catalog.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FolderOpen, Trash2 } from "lucide-react"

export default async function AdminCategoriesPage() {
  await requireAdmin()
  const categoryList = await getCategories(false)

  async function handleCreate(formData: FormData) {
    "use server"
    await requireAdmin()
    const name = formData.get("name") as string
    const slug = (formData.get("slug") as string) || name.toLowerCase().replace(/\s+/g, "-")
    const description = (formData.get("description") as string) || undefined

    await createCategoryAction({
      name,
      slug,
      description,
      sortOrder: 0,
      status: "active",
    })
  }

  async function handleDelete(formData: FormData) {
    "use server"
    await requireAdmin()
    const id = formData.get("id") as string
    if (id) await deleteCategoryAction(id)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <FolderOpen className="h-6 w-6 text-[#f3f1eb]" />
          <span>Kategori Produk & Layanan</span>
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Kelola pengelompokan layanan studio, program edukasi, dan penawaran Noire Space.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-white/[0.08] divide-y divide-white/[0.06] bg-[#121217]">
            {categoryList.length === 0 ? (
              <p className="p-8 text-center text-xs text-neutral-400">Belum ada kategori terdaftar.</p>
            ) : (
              categoryList.map((c) => (
                <div key={c.id} className="p-5 flex justify-between items-center text-sm">
                  <div className="space-y-0.5">
                    <p className="font-bold text-white">{c.name}</p>
                    <p className="text-xs text-neutral-500 font-mono">/{c.slug}</p>
                    {c.description && <p className="text-xs text-neutral-400 mt-1">{c.description}</p>}
                  </div>
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={c.id} />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="text-neutral-500 hover:text-[#e88] h-8 px-2"
                      aria-label={`Hapus kategori ${c.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 space-y-4">
            <h2 className="text-base font-bold text-white">+ Tambah Kategori</h2>
            <form action={handleCreate} className="space-y-3.5">
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Nama Kategori</Label>
                <Input name="name" required placeholder="Contoh: Studio Rental" className="bg-[#09090b] text-xs h-9 border-white/[0.12]" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Slug URL (Opsional)</Label>
                <Input name="slug" placeholder="studio-rental" className="bg-[#09090b] text-xs h-9 border-white/[0.12]" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Deskripsi Singkat</Label>
                <Input name="description" placeholder="Penjelasan kategori..." className="bg-[#09090b] text-xs h-9 border-white/[0.12]" />
              </div>
              <Button type="submit" className="w-full text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200 h-9 mt-1">
                Simpan Kategori
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
