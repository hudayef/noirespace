import { z } from "zod"

export const schoolInquirySchema = z.object({
  schoolName: z.string().min(2, "Nama sekolah wajib diisi"),
  picName: z.string().min(2, "Nama PIC wajib diisi"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(8, "Nomor telepon tidak valid"),
  studentCount: z.number().int().positive().nullable().optional(),
  programInterest: z.string().nullable().optional(),
  preferredDates: z.array(z.string()).default([]),
  locationPreference: z.string().nullable().optional(),
  requirements: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export type SchoolInquiryInput = z.infer<typeof schoolInquirySchema>
