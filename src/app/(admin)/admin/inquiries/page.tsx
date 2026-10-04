import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { getSchoolInquiries, updateSchoolInquiryStatus } from "@/lib/modules/school/inquiry.service"
import { formatDate } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"

export default async function AdminInquiriesPage() {
  await requireAdmin()
  const list = await getSchoolInquiries()

  async function handleStatusChange(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    const status = formData.get("status") as any
    const adminNotes = formData.get("adminNotes") as string

    if (!id || !status) return

    await updateSchoolInquiryStatus(id, status, adminNotes)
    revalidatePath("/admin/inquiries")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengajuan Kerjasama Sekolah (B2B)</h1>
        <p className="text-muted-foreground text-sm">Alur peninjauan formulir kerjasama workshop dan program kurikulum sekolah.</p>
      </div>

      <div className="rounded-lg border divide-y bg-card">
        {list.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">Belum ada pengajuan masuk dari institusi sekolah.</p>
        ) : (
          list.map((inq) => (
            <div key={inq.id} className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base">{inq.schoolName}</span>
                  <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded border bg-muted">
                    {inq.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  PIC: <strong>{inq.picName}</strong> | Kontak: {inq.phone} ({inq.email})
                </p>
                <p className="text-xs text-muted-foreground">
                  Program: {inq.programInterest || "-"} | Estimasi: {inq.studentCount || 0} siswa | Tgl: {formatDate(inq.createdAt)}
                </p>
                {inq.notes && <p className="text-xs italic text-muted-foreground">Catatan: {inq.notes}</p>}
              </div>

              <form action={handleStatusChange} className="flex items-center gap-2">
                <input type="hidden" name="id" value={inq.id} />
                <select name="status" defaultValue={inq.status} className="rounded-md border bg-background px-2 py-1 text-xs">
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="proposal_sent">Proposal Sent</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="declined">Declined</option>
                </select>
                <Button type="submit" size="sm" variant="outline" className="text-xs">
                  Update Status
                </Button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
