import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { getSchedules, createSchedule, getBusinessHours, upsertBusinessHours, getBlockedDates, createBlockedDate } from "@/lib/modules/scheduling/schedule.service"
import { getProducts } from "@/lib/modules/catalog/catalog.service"
import { getLocations } from "@/lib/modules/resource/resource.service"
import { formatTime } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]

export default async function AdminSchedulesPage() {
  await requireAdmin()
  const schedulesList = await getSchedules()
  const productList = await getProducts()
  const locations = await getLocations()
  const blockedList = await getBlockedDates()

  async function handleCreateSchedule(formData: FormData) {
    "use server"
    const productId = formData.get("productId") as string
    const dayOfWeek = formData.get("dayOfWeek") !== "" ? Number(formData.get("dayOfWeek")) : undefined
    const startTime = `${formData.get("startTime")}:00`
    const endTime = `${formData.get("endTime")}:00`

    if (!productId || !startTime || !endTime) return

    await createSchedule({
      productId,
      dayOfWeek,
      startTime,
      endTime,
      recurrenceType: "weekly",
      status: "active",
    })

    revalidatePath("/admin/schedules")
  }

  async function handleBlockDate(formData: FormData) {
    "use server"
    const date = formData.get("date") as string
    const reason = formData.get("reason") as string
    const type = (formData.get("type") as "holiday" | "maintenance" | "personal") || "holiday"

    if (!date) return

    await createBlockedDate({
      date,
      reason,
      type,
    })

    revalidatePath("/admin/schedules")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Jadwal & Ketersediaan</h1>
        <p className="text-muted-foreground text-sm">Atur template jadwal berulang dan hari libur / maintenance operasional.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-lg font-bold">+ Tambah Slot Berulang (Template Mingguan)</h2>
            <form action={handleCreateSchedule} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Pilih Produk / Layanan</Label>
                <select name="productId" className="w-full rounded-md border bg-background px-3 py-2 text-xs" required>
                  {productList.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Hari</Label>
                <select name="dayOfWeek" className="w-full rounded-md border bg-background px-3 py-2 text-xs">
                  {DAYS.map((d, idx) => (
                    <option key={idx} value={idx}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Jam Mulai</Label>
                  <Input type="time" name="startTime" defaultValue="10:00" required />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Jam Selesai</Label>
                  <Input type="time" name="endTime" defaultValue="11:00" required />
                </div>
              </div>
              <Button type="submit" size="sm" className="w-full text-xs">Simpan Slot</Button>
            </form>
          </div>

          <div className="rounded-lg border divide-y bg-card">
            <div className="p-4 font-bold text-sm">Daftar Slot Berulang ({schedulesList.length})</div>
            {schedulesList.length === 0 ? (
              <p className="p-4 text-xs text-muted-foreground">Belum ada template khusus (menggunakan slot otomatis jam kerja).</p>
            ) : (
              schedulesList.map((s) => (
                <div key={s.id} className="p-3 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold">{s.dayOfWeek !== null ? DAYS[s.dayOfWeek!] : "Spesifik"}</span>: {formatTime(s.startTime)} - {formatTime(s.endTime)} WIB
                  </div>
                  <span className="uppercase text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted">
                    {s.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-lg font-bold">+ Blokir Tanggal (Libur / Maintenance)</h2>
            <form action={handleBlockDate} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Tanggal</Label>
                <Input type="date" name="date" required />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tipe</Label>
                <select name="type" className="w-full rounded-md border bg-background px-3 py-2 text-xs">
                  <option value="holiday">Hari Libur Nasional</option>
                  <option value="maintenance">Perawatan Studio / Alat</option>
                  <option value="personal">Keperluan Internal</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Keterangan / Alasan</Label>
                <Input name="reason" placeholder="Contoh: Libur Hari Raya" />
              </div>
              <Button type="submit" size="sm" variant="destructive" className="w-full text-xs">
                Blokir Tanggal Ini
              </Button>
            </form>
          </div>

          <div className="rounded-lg border divide-y bg-card">
            <div className="p-4 font-bold text-sm">Daftar Tanggal Terblokir ({blockedList.length})</div>
            {blockedList.length === 0 ? (
              <p className="p-4 text-xs text-muted-foreground">Tidak ada tanggal yang diblokir.</p>
            ) : (
              blockedList.map((b) => (
                <div key={b.id} className="p-3 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold">{b.date}</span>: {b.reason || b.type}
                  </div>
                  <span className="uppercase text-[10px] font-bold px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">
                    {b.type}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
