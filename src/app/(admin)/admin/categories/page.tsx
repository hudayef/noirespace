import { requireAdmin } from "@/lib/modules/auth/rbac"
import { getCategories } from "@/lib/modules/catalog/catalog.service"
import { createCategoryAction, deleteCategoryAction } from "@/lib/modules/catalog/catalog.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function AdminCategoriesPage() {
  await requireAdmin()
  const categoryList = await getCategories(false)

  async function handleCreate(formData: FormData) {
    "use server"
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
    const id = formData.get("id") as string
    if (id) await deleteCategoryAction(id)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kategori Produk</h1>
        <p className="text-muted-foreground text-sm">Kelola pengelompokan layanan Noire Space.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border divide-y bg-card">
            {categoryList.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">Belum ada kategori.</p>
            ) : (
              categoryList.map((c) => (
                <div key={c.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">Slug: /{c.slug}</p>
                  </div>
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={c.id} />
                    <Button variant="ghost" size="sm" className="text-destructive">Hapus</Button>
                  </form>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-lg font-bold">+ Tambah Kategori</h2>
            <form action={handleCreate} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Nama Kategori</Label>
                <Input name="name" required placeholder="Contoh: Studio Rental" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Slug</Label>
                <Input name="slug" placeholder="studio-rental" />
              </div>
              <Button type="submit" className="w-full text-xs" size="sm">Simpan</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
