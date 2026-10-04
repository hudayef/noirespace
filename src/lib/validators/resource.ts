import { z } from "zod"

export const locationSchema = z.object({
  name: z.string().min(1, "Nama lokasi wajib diisi"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  timezone: z.string().default("Asia/Jakarta"),
  status: z.enum(["active", "inactive"]).default("active"),
})

export const roomSchema = z.object({
  locationId: z.string().uuid("ID lokasi tidak valid"),
  name: z.string().min(1, "Nama ruangan wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  description: z.string().optional(),
  capacity: z.number().int().positive().default(1),
  status: z.enum(["active", "inactive", "maintenance"]).default("active"),
  images: z.array(z.string()).default([]),
})

export const resourceSchema = z.object({
  locationId: z.string().uuid("ID lokasi tidak valid"),
  name: z.string().min(1, "Nama resource wajib diisi"),
  type: z.enum(["equipment", "camera", "lighting", "other"]),
  description: z.string().optional(),
  quantity: z.number().int().min(1).default(1),
  status: z.enum(["active", "inactive"]).default("active"),
})

export const instructorSchema = z.object({
  userId: z.string().uuid().nullable().optional(),
  name: z.string().min(1, "Nama instruktur wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  bio: z.string().optional(),
  specializations: z.array(z.string()).default([]),
  photo: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
})

export type LocationInput = z.infer<typeof locationSchema>
export type RoomInput = z.infer<typeof roomSchema>
export type ResourceInput = z.infer<typeof resourceSchema>
export type InstructorInput = z.infer<typeof instructorSchema>
