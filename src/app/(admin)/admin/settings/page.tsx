import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { settings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings as SettingsIcon } from "lucide-react"

export default async function AdminSettingsPage() {
  await requireAdmin()

  const allSettings = await db.query.settings.findMany()

  async function handleSaveSetting(formData: FormData) {
    "use server"
    await requireAdmin()
    const group = (formData.get("group") as string) || "general"
    const key = formData.get("key") as string
    const valueStr = formData.get("value") as string

    if (!key) return

    let parsedVal: unknown = valueStr
    try {
      parsedVal = JSON.parse(valueStr)
    } catch {
      parsedVal = valueStr
    }

    const existing = await db.query.settings.findFirst({
      where: eq(settings.key, key),
    })

    if (existing) {
      await db
        .update(settings)
        .set({
          value: parsedVal,
          updatedAt: new Date(),
        })
        .where(eq(settings.id, existing.id))
    } else {
      await db.insert(settings).values({
        group,
        key,
        value: parsedVal,
        type: "string",
      })
    }

    revalidatePath("/admin/settings")
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <SettingsIcon className="h-6 w-6 text-amber-400" />
          <span>Pengaturan Sistem & Kebijakan</span>
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Konfigurasi parameter bisnis Noire Space: jam operasional, window pemesanan, dan batas reschedule.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-white/[0.08] divide-y divide-white/[0.06] bg-[#121217]">
            <div className="p-5 font-bold text-sm text-white">Parameter Bisnis Aktif (Enforced Engine)</div>
            <div className="p-5 space-y-3 text-xs sm:text-sm text-neutral-300">
              <div className="flex justify-between items-center py-2.5 border-b border-white/[0.06]">
                <div>
                  <p className="font-semibold text-white">Buffer Waktu Sesi (BR-03)</p>
                  <p className="text-xs text-neutral-500">Jeda waktu antar booking untuk persiapan dan sterilisasi ruangan/alat</p>
                </div>
                <span className="font-mono font-bold text-amber-300">15 Menit</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-white/[0.06]">
                <div>
                  <p className="font-semibold text-white">Masa Aktif Penahanan Slot (Hold Cart - BR-04)</p>
                  <p className="text-xs text-neutral-500">Batas waktu slot terkunci saat pelanggan masuk keranjang belanja</p>
                </div>
                <span className="font-mono font-bold text-amber-300">15 Menit</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-white/[0.06]">
                <div>
                  <p className="font-semibold text-white">Batas Waktu Reschedule (BR-07)</p>
                  <p className="text-xs text-neutral-500">Minimal jam sebelum sesi untuk pengajuan jadwal baru (maks. 1 kali)</p>
                </div>
                <span className="font-mono font-bold text-amber-300">24 Jam</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-white/[0.06]">
                <div>
                  <p className="font-semibold text-white">Kebijakan Pengembalian Dana (BR-08)</p>
                  <p className="text-xs text-neutral-500">Peraturan finansial untuk pembatalan pasca pembayaran berhasil</p>
                </div>
                <span className="font-mono font-bold text-rose-400">NO REFUND (Absolut)</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <div>
                  <p className="font-semibold text-white">Gateway Pembayaran Utama</p>
                  <p className="text-xs text-neutral-500">Penyedia kanal transaksi terintegrasi (Midtrans Snap)</p>
                </div>
                <span className="font-mono font-bold text-emerald-400">Midtrans Snap</span>
              </div>
            </div>
          </div>

          {allSettings.length > 0 && (
            <div className="rounded-xl border border-white/[0.08] divide-y divide-white/[0.06] bg-[#121217]">
              <div className="p-4 font-bold text-sm text-white">Pengaturan Kustom Tersimpan</div>
              {allSettings.map((s) => (
                <div key={s.id} className="p-4 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono font-bold text-white">{s.key}</span> ({s.group})
                    <p className="text-neutral-500 mt-0.5">{JSON.stringify(s.value)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 space-y-4">
            <h2 className="text-base font-bold text-white">+ Simpan Parameter Konfigurasi</h2>
            <form action={handleSaveSetting} className="space-y-3.5">
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Grup Konfigurasi</Label>
                <Input name="group" defaultValue="booking" required className="bg-[#09090b] text-xs h-9 border-white/[0.12]" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Kunci (Key)</Label>
                <Input name="key" placeholder="booking_max_advance_days" required className="bg-[#09090b] text-xs h-9 border-white/[0.12]" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-neutral-300">Nilai (Value / JSON)</Label>
                <Input name="value" placeholder="30" required className="bg-[#09090b] text-xs h-9 border-white/[0.12]" />
              </div>
              <Button type="submit" className="w-full text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200 h-9 mt-1">
                Simpan Konfigurasi
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
