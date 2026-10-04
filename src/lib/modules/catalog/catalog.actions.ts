"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { logAudit } from "@/lib/modules/audit"
import { productSchema, categorySchema, type ProductInput, type CategoryInput } from "@/lib/validators/catalog"
import * as catalogService from "./catalog.service"

export async function createProductAction(input: ProductInput) {
  const user = await requireAdmin()
  const validated = productSchema.parse(input)
  const product = await catalogService.createProduct(validated)

  await logAudit({
    userId: user.id,
    action: "create",
    entityType: "product",
    entityId: product.id,
    after: product as unknown as Record<string, unknown>,
  })

  revalidatePath("/admin/products")
  revalidatePath("/programs")
  revalidatePath("/studio")
  revalidatePath("/services")
  return { success: true, product }
}

export async function updateProductAction(id: string, input: Partial<ProductInput>) {
  const user = await requireAdmin()
  const existing = await catalogService.getProductById(id)
  if (!existing) throw new Error("Product not found")

  const updated = await catalogService.updateProduct(id, input)

  await logAudit({
    userId: user.id,
    action: "update",
    entityType: "product",
    entityId: id,
    before: existing as unknown as Record<string, unknown>,
    after: updated as unknown as Record<string, unknown>,
  })

  revalidatePath("/admin/products")
  revalidatePath(`/programs/${existing.slug}`)
  revalidatePath(`/studio/${existing.slug}`)
  revalidatePath(`/services/${existing.slug}`)
  return { success: true, product: updated }
}

export async function deleteProductAction(id: string) {
  const user = await requireAdmin()
  const existing = await catalogService.getProductById(id)
  if (!existing) throw new Error("Product not found")

  const deleted = await catalogService.deleteProduct(id)

  await logAudit({
    userId: user.id,
    action: "delete",
    entityType: "product",
    entityId: id,
    before: existing as unknown as Record<string, unknown>,
  })

  revalidatePath("/admin/products")
  return { success: true, product: deleted }
}

export async function createCategoryAction(input: CategoryInput) {
  const user = await requireAdmin()
  const validated = categorySchema.parse(input)
  const category = await catalogService.createCategory(validated)

  await logAudit({
    userId: user.id,
    action: "create",
    entityType: "category",
    entityId: category.id,
    after: category as unknown as Record<string, unknown>,
  })

  revalidatePath("/admin/categories")
  return { success: true, category }
}

export async function updateCategoryAction(id: string, input: Partial<CategoryInput>) {
  const user = await requireAdmin()
  const existing = await catalogService.getCategoryBySlug(id)
  const updated = await catalogService.updateCategory(id, input)

  await logAudit({
    userId: user.id,
    action: "update",
    entityType: "category",
    entityId: id,
    before: existing as unknown as Record<string, unknown>,
    after: updated as unknown as Record<string, unknown>,
  })

  revalidatePath("/admin/categories")
  return { success: true, category: updated }
}

export async function deleteCategoryAction(id: string) {
  const user = await requireAdmin()
  const deleted = await catalogService.deleteCategory(id)

  await logAudit({
    userId: user.id,
    action: "delete",
    entityType: "category",
    entityId: id,
  })

  revalidatePath("/admin/categories")
  return { success: true, category: deleted }
}
