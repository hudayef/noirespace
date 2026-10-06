import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import {
  getSchedules, createSchedule, deleteSchedule,
  getBusinessHours, upsertBusinessHours,
  getBlockedDates, createBlockedDate, deleteBlockedDate,
} from "@/lib/modules/scheduling/schedule.service"
import { getProducts } from "@/lib/modules/catalog/catalog.service"
import { getLocations } from "@/lib/modules/resource/resource.service"
import { formatTime } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarClock, Trash2 } from "lucide-react"

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]

export default async function AdminSchedulesPage() {
  await requireAdmin()
  const schedulesList = await getSchedules()
  const productList = await getProducts()
  const locations = await getLocations()
  const blockedList = await getBlockedDates()
  const businessHoursList = await getBusinessHours()
  const firstLocationId = locations[0]?.id

  async function handleCreateSchedule(formData: FormData) {
    "use server"
    await requireAdmin()
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

  async function handleDeleteSchedule(formData: FormData) {
    "use server"
    await requireAdmin()
    const id = formData.get("id") as string
    if (id) await deleteSchedule(id)
    revalidatePath("/admin/schedules")
  }

  async function handleBlockDate(formData: FormData) {
    "use server"
    await requireAdmin()
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

  async function handleDeleteBlockedDate(formData: FormData) {
    "use server"
    await requireAdmin()
    const id = formData.get("id") as string
    if (id) await deleteBlockedDate(id)
    revalidatePath("/admin/schedules")
  }

  async function handleSaveBusinessHours(formData: FormData) {
    "use server"
    await requireAdmin()
    const locationId = formData.get("locationId") as string
    const dayOfWeek = Number(formData.get("dayOfWeek"))
    const openTime = `${formData.get("openTime")}:00`
    const closeTime = `${formData.get("closeTime")}:00`
    const isClosed = formData.get("isClosed") === "on"

    if (!locationId || Number.isNaN(dayOfWeek)) return

    await upsertBusinessHours({ locationId, dayOfWeek, openTime, closeTime, isClosed })
    revalidatePath("/admin/schedules")
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <CalendarClock className="h-6 w-6 text-[#f3f1eb]" />
          <span>Jadwal & Ketersediaan</span>
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Atur template jadwal berulang dan hari libur / maintenance operasional.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 space-y-4">
            <h2 className="text-base font-bold text-white">+ Tambah Slot Berulang (Template Mingguan)</h2>
            <form action={handleCreateSchedule} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Pilih Produk / Layanan</Label>
                <select name="productId" className="w-full rounded-md border border-white/[0.12] bg-[#09090b] px-3 py-2 text-xs text-white" required>
                  {productList.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Hari</Label>
                <select name="dayOfWeek" className="w-full rounded-md border border-white/[0.12] bg-[#09090b] px-3 py-2 text-xs text-white">
                  {DAYS.map((d, idx) => (
                    <option key={idx} value={idx}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-neutral-300">Jam Mulai</Label>
                  <Input type="time" name="startTime" defaultValue="10:00" required className="bg-[#09090b] border-white/[0.12] text-xs h-9 text-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-neutral-300">Jam Selesai</Label>
                  <Input type="time" name="endTime" defaultValue="11:00" required className="bg-[#09090b] border-white/[0.12] text-xs h-9 text-white" />
                </div>
              </div>
              <Button type="submit" size="sm" className="w-full text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200 h-9">
                Simpan Slot
              </Button>
            </form>
          </div>

          <div className="rounded-xl border border-white/[0.08] divide-y divide-white/[0.06] bg-[#121217]">
            <div className="p-4 font-bold text-sm text-white">Daftar Slot Berulang ({schedulesList.length})</div>
            {schedulesList.length === 0 ? (
              <p className="p-4 text-xs text-neutral-500">Belum ada template khusus (menggunakan slot otomatis jam kerja).</p>
            ) : (
              schedulesList.map((s) => (
                <div key={s.id} className="p-4 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white">{s.dayOfWeek !== null ? DAYS[s.dayOfWeek!] : "Spesifik"}</span>:{" "}
                    <span className="text-[#e8e6df]">{formatTime(s.startTime)} - {formatTime(s.endTime)} WIB</span>
                    <p className="text-neutral-400 mt-0.5">{productList.find((p) => p.id === s.productId)?.name || "Produk"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#f3f1eb]/[0.15] bg-[#141414] text-[#f3f1eb]">
                      {s.status}
                    </span>
                    <form action={handleDeleteSchedule}>
                      <input type="hidden" name="id" value={s.id} />
                      <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-[#e88] h-7 px-2">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 space-y-4">
            <h2 className="text-base font-bold text-white">+ Blokir Tanggal (Libur / Maintenance)</h2>
            <form action={handleBlockDate} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Tanggal</Label>
                <Input type="date" name="date" required className="bg-[#09090b] border-white/[0.12] text-xs h-9 text-white" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Tipe</Label>
                <select name="type" className="w-full rounded-md border border-white/[0.12] bg-[#09090b] px-3 py-2 text-xs text-white">
                  <option value="holiday">Hari Libur Nasional</option>
                  <option value="maintenance">Perawatan Studio / Alat</option>
                  <option value="personal">Keperluan Internal</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Keterangan / Alasan</Label>
                <Input name="reason" placeholder="Contoh: Libur Hari Raya" className="bg-[#09090b] border-white/[0.12] text-xs h-9 text-white" />
              </div>
              <Button type="submit" size="sm" variant="destructive" className="w-full text-xs uppercase tracking-widest font-bold h-9">
                Blokir Tanggal Ini
              </Button>
            </form>
          </div>

          <div className="rounded-xl border border-white/[0.08] divide-y divide-white/[0.06] bg-[#121217]">
            <div className="p-4 font-bold text-sm text-white">Daftar Tanggal Terblokir ({blockedList.length})</div>
            {blockedList.length === 0 ? (
              <p className="p-4 text-xs text-neutral-500">Tidak ada tanggal yang diblokir.</p>
            ) : (
              blockedList.map((b) => (
                <div key={b.id} className="p-4 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white">{b.date}</span>: {b.reason || b.type}
                    {b.startTime && b.endTime && (
                      <p className="text-neutral-400 mt-0.5">{formatTime(b.startTime)} - {formatTime(b.endTime)} WIB</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="uppercase font-mono text-[9px] px-2 py-0.5 border border-[#6b1e1e] bg-[#1f0d0d] text-[#e88]">
                      {b.type}
                    </span>
                    <form action={handleDeleteBlockedDate}>
                      <input type="hidden" name="id" value={b.id} />
                      <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-[#e88] h-7 px-2">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {firstLocationId && (
        <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white">Jam Operasional Harian</h2>
            <p className="text-xs text-neutral-400">
              Tentukan jam buka, jam tutup, dan hari libur reguler per hari untuk lokasi utama.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {DAYS.map((dayName, idx) => {
              const current = businessHoursList.find((bh) => bh.dayOfWeek === idx)
              const defaultOpen = current?.openTime?.slice(0, 5) || "09:00"
              const defaultClose = current?.closeTime?.slice(0, 5) || "21:00"
              const isClosed = current?.isClosed || false

              return (
                <form
                  key={idx}
                  action={handleSaveBusinessHours}
                  className="rounded-lg border border-white/[0.08] p-3.5 bg-[#09090b] space-y-2.5 text-xs"
                >
                  <input type="hidden" name="locationId" value={firstLocationId} />
                  <input type="hidden" name="dayOfWeek" value={idx} />
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-white">{dayName}</span>
                    <label className="flex items-center gap-1.5 font-normal text-[11px] cursor-pointer text-neutral-400 hover:text-white">
                      <input
                        type="checkbox"
                        name="isClosed"
                        defaultChecked={isClosed}
                        className="rounded border-white/20 bg-black"
                      />
                      <span>Tutup</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[10px] text-neutral-400">Buka</Label>
                      <Input
                        type="time"
                        name="openTime"
                        defaultValue={defaultOpen}
                        className="h-8 text-xs px-2 bg-[#121217] border-white/[0.12] text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-neutral-400">Tutup</Label>
                      <Input
                        type="time"
                        name="closeTime"
                        defaultValue={defaultClose}
                        className="h-8 text-xs px-2 bg-[#121217] border-white/[0.12] text-white"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" size="sm" variant="outline" className="w-full h-7 text-[10px] uppercase font-bold border-white/[0.12] text-neutral-300 hover:text-white hover:bg-white/[0.06]">
                    Simpan {dayName}
                  </Button>
                </form>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

