import { db } from "@/lib/db"
import { products, categories } from "@/lib/db/schema"
import { eq, and, desc } from "drizzle-orm"
import type { ProductInput, CategoryInput } from "@/lib/validators/catalog"

export async function getCategories(onlyActive = true) {
  if (onlyActive) {
    return db.query.categories.findMany({
      where: eq(categories.status, "active"),
      orderBy: [categories.sortOrder],
    })
  }
  return db.query.categories.findMany({
    orderBy: [categories.sortOrder],
  })
}

export async function getCategoryBySlug(slug: string) {
  return db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  })
}

export async function getProducts(filters?: {
  type?: "education" | "studio" | "service" | "school"
  categoryId?: string
  status?: "draft" | "published" | "archived"
  featured?: boolean
}) {
  const conditions = []
  if (filters?.type) conditions.push(eq(products.type, filters.type))
  if (filters?.categoryId) conditions.push(eq(products.categoryId, filters.categoryId))
  if (filters?.status) conditions.push(eq(products.status, filters.status))
  if (filters?.featured !== undefined) conditions.push(eq(products.featured, filters.featured))

  return db.query.products.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    orderBy: [desc(products.createdAt)],
  })
}

export async function getProductBySlug(slug: string) {
  return db.query.products.findFirst({
    where: eq(products.slug, slug),
  })
}

export async function getProductById(id: string) {
  return db.query.products.findFirst({
    where: eq(products.id, id),
  })
}

export async function createProduct(data: ProductInput) {
  const [created] = await db.insert(products).values(data).returning()
  return created
}

export async function updateProduct(id: string, data: Partial<ProductInput>) {
  const [updated] = await db
    .update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning()
  return updated
}

export async function deleteProduct(id: string) {
  const [deleted] = await db.delete(products).where(eq(products.id, id)).returning()
  return deleted
}

export async function createCategory(data: CategoryInput) {
  const [created] = await db.insert(categories).values(data).returning()
  return created
}

export async function updateCategory(id: string, data: Partial<CategoryInput>) {
  const [updated] = await db
    .update(categories)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(categories.id, id))
    .returning()
  return updated
}

export async function deleteCategory(id: string) {
  const [deleted] = await db.delete(categories).where(eq(categories.id, id)).returning()
  return deleted
}
