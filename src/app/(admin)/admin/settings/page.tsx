import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { settings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SectionLabel } from "@/components/editorial"

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
        <SectionLabel number="01" label="KONFIGURASI SISTEM" />
        <h1 className="font-display text-2xl sm:text-3xl text-[#f3f1eb] font-normal">
          Pengaturan & Parameter Bisnis
        </h1>
        <p className="text-xs sm:text-sm text-[#6f6f6a]">
          Konfigurasi parameter bisnis Noire Space: jam operasional, window pemesanan, dan batas reschedule.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="border border-[#f3f1eb]/[0.1] divide-y divide-[#f3f1eb]/[0.08] bg-[#111111]">
            <div className="p-5 font-mono text-xs uppercase tracking-wider text-[#f3f1eb]">Parameter Bisnis Aktif (Enforced Engine)</div>
            <div className="p-5 space-y-3 text-xs sm:text-sm text-[#e8e6df]">
              <div className="flex justify-between items-center py-2.5 border-b border-[#f3f1eb]/[0.06]">
                <div>
                  <p className="font-mono text-xs text-[#f3f1eb]">Buffer Waktu Sesi (BR-03)</p>
                  <p className="text-xs text-[#6f6f6a]">Jeda waktu antar booking untuk persiapan dan sterilisasi ruangan/alat</p>
                </div>
                <span className="font-mono text-xs text-[#f3f1eb]">15 Menit</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-[#f3f1eb]/[0.06]">
                <div>
                  <p className="font-mono text-xs text-[#f3f1eb]">Masa Aktif Penahanan Slot (Hold Cart - BR-04)</p>
                  <p className="text-xs text-[#6f6f6a]">Batas waktu slot terkunci saat pelanggan masuk keranjang belanja</p>
                </div>
                <span className="font-mono text-xs text-[#f3f1eb]">15 Menit</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-[#f3f1eb]/[0.06]">
                <div>
                  <p className="font-mono text-xs text-[#f3f1eb]">Batas Waktu Reschedule (BR-07)</p>
                  <p className="text-xs text-[#6f6f6a]">Minimal jam sebelum sesi untuk pengajuan jadwal baru (maks. 1 kali)</p>
                </div>
                <span className="font-mono text-xs text-[#f3f1eb]">24 Jam</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-[#f3f1eb]/[0.06]">
                <div>
                  <p className="font-mono text-xs text-[#f3f1eb]">Kebijakan Pengembalian Dana (BR-08)</p>
                  <p className="text-xs text-[#6f6f6a]">Peraturan finansial untuk pembatalan pasca pembayaran berhasil</p>
                </div>
                <span className="font-mono text-xs text-[#e88] font-bold border border-[#6b1e1e] bg-[#1f0d0d] px-2 py-0.5">NO REFUND (Absolut)</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <div>
                  <p className="font-mono text-xs text-[#f3f1eb]">Gateway Pembayaran Utama</p>
                  <p className="text-xs text-[#6f6f6a]">Penyedia kanal transaksi terintegrasi (Midtrans Snap)</p>
                </div>
                <span className="font-mono text-xs text-[#f3f1eb]">Midtrans Snap</span>
              </div>
            </div>
          </div>

          {allSettings.length > 0 && (
            <div className="border border-[#f3f1eb]/[0.1] divide-y divide-[#f3f1eb]/[0.08] bg-[#111111]">
              <div className="p-4 font-mono text-xs uppercase tracking-wider text-[#f3f1eb]">Pengaturan Kustom Tersimpan</div>
              {allSettings.map((s) => (
                <div key={s.id} className="p-4 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#f3f1eb]">{s.key}</span> ({s.group})
                    <p className="text-[#6f6f6a] mt-0.5 font-mono text-[11px]">{JSON.stringify(s.value)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[#f3f1eb]">+ Parameter Konfigurasi</h2>
            <form action={handleSaveSetting} className="space-y-3.5 font-mono">
              <div className="space-y-1">
                <Label className="text-[11px] text-[#e8e6df]">Grup Konfigurasi</Label>
                <Input name="group" defaultValue="booking" required className="bg-[#0a0a0a] text-xs h-9 border-[#f3f1eb]/[0.12] text-[#f3f1eb]" />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-[#e8e6df]">Kunci (Key)</Label>
                <Input name="key" placeholder="booking_max_advance_days" required className="bg-[#0a0a0a] text-xs h-9 border-[#f3f1eb]/[0.12] text-[#f3f1eb]" />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-[#e8e6df]">Nilai (Value / JSON)</Label>
                <Input name="value" placeholder="30" required className="bg-[#0a0a0a] text-xs h-9 border-[#f3f1eb]/[0.12] text-[#f3f1eb]" />
              </div>
              <Button type="submit" className="w-full text-[10px] uppercase tracking-widest font-medium bg-[#f3f1eb] text-[#0a0a0a] hover:bg-[#e8e6df] rounded-none h-9 mt-1">
                Simpan Konfigurasi
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
