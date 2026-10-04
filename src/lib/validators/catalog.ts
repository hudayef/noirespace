import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  description: z.string().optional(),
  parentId: z.string().uuid().nullable().optional(),
  sortOrder: z.number().int().default(0),
  status: z.enum(["active", "inactive"]).default("active"),
})

export const productSchema = z.object({
  categoryId: z.string().uuid().nullable().optional(),
  name: z.string().min(1, "Nama produk wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  type: z.enum(["education", "studio", "service", "school"]),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().int().nonnegative().default(0),
  comparePrice: z.number().int().nonnegative().nullable().optional(),
  durationMinutes: z.number().int().positive().nullable().optional(),
  capacity: z.number().int().positive().nullable().optional(),
  minBookingNoticeHours: z.number().int().nonnegative().default(24),
  maxAdvanceBookingDays: z.number().int().positive().default(30),
  bufferMinutes: z.number().int().nonnegative().default(15),
  requiresInstructor: z.boolean().default(false),
  requiresRoom: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  images: z.array(z.string()).default([]),
  includes: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
})

export type CategoryInput = z.infer<typeof categorySchema>
export type ProductInput = z.infer<typeof productSchema>
