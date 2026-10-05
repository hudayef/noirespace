import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { getSchoolInquiries, updateSchoolInquiryStatus, deleteSchoolInquiry } from "@/lib/modules/school/inquiry.service"
import { formatDate } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { GraduationCap, MessageSquare, Trash2 } from "lucide-react"

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
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <GraduationCap className="h-6 w-6 text-emerald-400" />
          <span>Pengajuan Kerjasama Sekolah (B2B)</span>
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Alur peninjauan formulir kerjasama workshop, study trip, dan kemitraan kurikulum sekolah.
        </p>
      </div>

      <div className="rounded-xl border border-white/[0.08] divide-y divide-white/[0.06] bg-[#121217]">
        {list.length === 0 ? (
          <p className="p-8 text-center text-xs text-neutral-400">Belum ada pengajuan masuk dari institusi sekolah.</p>
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
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-base text-white">{inq.schoolName}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-white/10 bg-white/5 text-neutral-300">
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    PIC: <strong className="text-white">{inq.picName}</strong> • Kontak: {inq.phone} ({inq.email})
                  </p>
                  <p className="text-xs text-neutral-400">
                    Program: <strong className="text-amber-300">{inq.programInterest || "-"}</strong> • Estimasi: {inq.studentCount || 0} siswa • Tgl: {formatDate(inq.createdAt)}
                  </p>
                  {inq.notes && <p className="text-xs italic text-neutral-500">Catatan: {inq.notes}</p>}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition-colors"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Chat WhatsApp</span>
                    </a>
                  )}

                  <form action={handleStatusChange} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={inq.id} />
                    <select
                      name="status"
                      defaultValue={inq.status}
                      onChange={(e) => e.target.form?.requestSubmit()}
                      aria-label={`Ubah status pengajuan ${inq.schoolName}`}
                      className="rounded-md border border-white/[0.12] bg-[#09090b] px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="proposal_sent">Proposal Sent</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="declined">Declined</option>
                    </select>
                  </form>

                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={inq.id} />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="text-neutral-500 hover:text-rose-400 h-8 px-2"
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
