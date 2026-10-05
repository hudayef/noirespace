import { db } from "@/lib/db"
import { schoolInquiries } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import type { SchoolInquiryInput } from "@/lib/validators/school"
import { sendNotification } from "@/lib/modules/notification/notification.service"

export async function createSchoolInquiry(data: SchoolInquiryInput) {
  const [created] = await db.insert(schoolInquiries).values(data).returning()

  sendNotification({
    type: "school_inquiry_received",
    channel: "whatsapp",
    title: "Pengajuan Kerjasama Sekolah Diterima — Noire Space",
    body: `Halo Bapak/Ibu ${created.picName}, pengajuan kemitraan dari ${created.schoolName} telah kami terima. Tim partnership Noire Space akan segera menghubungi Anda.`,
    data: {
      phone: created.phone,
      recipientEmail: created.email,
      schoolName: created.schoolName,
    },
  }).catch(() => {})

  return created
}

export async function getSchoolInquiries(status?: "new" | "contacted" | "proposal_sent" | "confirmed" | "declined") {
  if (status) {
    return db.query.schoolInquiries.findMany({
      where: eq(schoolInquiries.status, status),
      orderBy: [desc(schoolInquiries.createdAt)],
    })
  }
  return db.query.schoolInquiries.findMany({
    orderBy: [desc(schoolInquiries.createdAt)],
  })
}

export async function updateSchoolInquiryStatus(
  id: string,
  status: "new" | "contacted" | "proposal_sent" | "confirmed" | "declined",
  adminNotes?: string,
  handledBy?: string
) {
  const [updated] = await db
    .update(schoolInquiries)
    .set({
      status,
      adminNotes,
      handledBy,
      updatedAt: new Date(),
    })
    .where(eq(schoolInquiries.id, id))
    .returning()
  return updated
}

export async function deleteSchoolInquiry(id: string) {
  const [deleted] = await db.delete(schoolInquiries).where(eq(schoolInquiries.id, id)).returning()
  return deleted
}
