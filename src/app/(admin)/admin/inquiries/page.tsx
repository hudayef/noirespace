import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { getSchoolInquiries, updateSchoolInquiryStatus, deleteSchoolInquiry } from "@/lib/modules/school/inquiry.service"
import { formatDate } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { AutoSubmitSelect } from "@/components/ui/auto-submit-select"
import { SectionLabel, StatusBadge } from "@/components/editorial"
import { MessageSquare, Trash2 } from "lucide-react"

export default async function AdminInquiriesPage() {
  await requireAdmin()
  const list = await getSchoolInquiries()

  async function handleStatusChange(formData: FormData) {
    "use server"
    await requireAdmin()
    const id = formData.get("id") as string
    const status = formData.get("status") as "new" | "contacted" | "proposal_sent" | "confirmed" | "declined"
    const adminNotes = formData.get("adminNotes") as string

    if (!id || !status) return

    await updateSchoolInquiryStatus(id, status, adminNotes)
    revalidatePath("/admin/inquiries")
  }

  async function handleDelete(formData: FormData) {
    "use server"
    await requireAdmin()
    const id = formData.get("id") as string
    if (!id) return

    await deleteSchoolInquiry(id)
    revalidatePath("/admin/inquiries")
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <SectionLabel number="01" label="KEMITRAAN SEKOLAH" />
        <h1 className="font-display text-2xl sm:text-3xl text-[#f3f1eb] font-normal">
          Pengajuan Kerjasama (B2B)
        </h1>
        <p className="text-xs sm:text-sm text-[#6f6f6a]">
          Alur peninjauan formulir kerjasama workshop, study trip, dan kemitraan kurikulum sekolah.
        </p>
      </div>

      <div className="border border-[#f3f1eb]/[0.1] divide-y divide-[#f3f1eb]/[0.08] bg-[#111111]">
        {list.length === 0 ? (
          <p className="p-8 text-center font-mono text-xs text-[#6f6f6a]">Belum ada pengajuan masuk dari institusi sekolah.</p>
        ) : (
          list.map((inq) => {
            const cleanPhone = (inq.phone || "").replace(/[^0-9]/g, "")
            const waTarget = cleanPhone.startsWith("0") ? `62${cleanPhone.slice(1)}` : cleanPhone
            const waMessage = encodeURIComponent(
              `Halo Bapak/Ibu ${inq.picName} dari ${inq.schoolName},\n\n` +
              `Terima kasih telah mengajukan minat kerjasama program Noire Space terkait ${inq.programInterest || "edukasi"}.\n` +
              `Kami dari tim partnership Noire Space ingin mendiskusikan proposal dan detail pelaksanaan.`
            )
            const waUrl = cleanPhone ? `https://wa.me/${waTarget}?text=${waMessage}` : null

            return (
              <div key={inq.id} className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="space-y-1.5 font-mono">
                  <div className="flex items-center gap-2.5">
                    <span className="font-display text-base text-[#f3f1eb] font-normal">{inq.schoolName}</span>
                    <StatusBadge status={inq.status} />
                  </div>
                  <p className="text-xs text-[#6f6f6a]">
                    PIC: <strong className="text-[#f3f1eb] font-normal">{inq.picName}</strong> · Kontak: {inq.phone} ({inq.email})
                  </p>
                  <p className="text-xs text-[#6f6f6a]">
                    Program: <strong className="text-[#e8e6df] font-normal">{inq.programInterest || "-"}</strong> · Estimasi: {inq.studentCount || 0} siswa · Tgl: {formatDate(inq.createdAt)}
                  </p>
                  {inq.notes && <p className="text-xs italic text-[#6f6f6a]">Catatan: {inq.notes}</p>}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#f3f1eb]/[0.15] bg-[#141414] text-[#e8e6df] hover:text-[#f3f1eb] font-mono text-xs transition-colors"
                    >
                      <MessageSquare className="h-3 w-3 text-[#6f6f6a]" />
                      <span>Chat WA</span>
                    </a>
                  )}

                  <form action={handleStatusChange} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={inq.id} />
                    <AutoSubmitSelect
                      name="status"
                      defaultValue={inq.status}
                      aria-label={`Ubah status pengajuan ${inq.schoolName}`}
                      className="border border-[#f3f1eb]/[0.15] bg-[#0a0a0a] px-2.5 py-1.5 font-mono text-xs text-[#f3f1eb] focus:outline-none focus:border-[#f3f1eb]/[0.4]"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="proposal_sent">Proposal Sent</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="declined">Declined</option>
                    </AutoSubmitSelect>
                  </form>

                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={inq.id} />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="text-[#6f6f6a] hover:text-[#e88] h-8 px-2"
                      aria-label={`Hapus pengajuan ${inq.schoolName}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
