import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { settings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function AdminSettingsPage() {
  await requireAdmin()

  const allSettings = await db.query.settings.findMany()

  async function handleSaveSetting(formData: FormData) {
    "use server"
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
          value: parsedVal as any,
          updatedAt: new Date(),
        })
        .where(eq(settings.id, existing.id))
    } else {
      await db.insert(settings).values({
        group,
        key,
        value: parsedVal as any,
        type: "string",
      })
    }

    revalidatePath("/admin/settings")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan Sistem & Kebijakan</h1>
        <p className="text-muted-foreground text-sm">
          Konfigurasi parameter bisnis Noire Space: jam operasional, window pemesanan, dan batas reschedule.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border divide-y bg-card">
            <div className="p-4 font-bold text-sm">Parameter Bisnis Aktif</div>
            <div className="p-4 space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-semibold">Buffer Waktu Sesi</p>
                  <p className="text-xs text-muted-foreground">Jeda waktu antar booking untuk persiapan ruangan/alat</p>
                </div>
                <span className="font-mono font-bold">15 Menit</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-semibold">Masa Aktif Penahanan Slot (Hold Cart)</p>
                  <p className="text-xs text-muted-foreground">Batas waktu slot terkunci saat pelanggan masuk keranjang</p>
                </div>
                <span className="font-mono font-bold">15 Menit</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-semibold">Batas Waktu Reschedule</p>
                  <p className="text-xs text-muted-foreground">Minimal jam sebelum sesi untuk pengajuan jadwal baru</p>
                </div>
                <span className="font-mono font-bold">24 Jam</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-semibold">Kebijakan Pengembalian Dana (Refund)</p>
                  <p className="text-xs text-muted-foreground">Peraturan finansial untuk pembatalan pasca bayar</p>
                </div>
                <span className="font-mono font-bold text-rose-500">NO REFUND (Absolut)</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="font-semibold">Gateway Pembayaran Utama</p>
                  <p className="text-xs text-muted-foreground">Penyedia kanal transaksi terintegrasi</p>
                </div>
                <span className="font-mono font-bold">Midtrans Snap</span>
              </div>
            </div>
          </div>

          {allSettings.length > 0 && (
            <div className="rounded-lg border divide-y bg-card">
              <div className="p-4 font-bold text-sm">Pengaturan Kustom Tersimpan</div>
              {allSettings.map((s) => (
                <div key={s.id} className="p-4 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono font-bold">{s.key}</span> ({s.group})
                    <p className="text-muted-foreground mt-0.5">{JSON.stringify(s.value)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-lg font-bold">+ Simpan Parameter Konfigurasi</h2>
            <form action={handleSaveSetting} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Grup</Label>
                <Input name="group" defaultValue="booking" required />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Kunci (Key)</Label>
                <Input name="key" placeholder="booking_max_advance_days" required />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Nilai (Value / JSON)</Label>
                <Input name="value" placeholder="30" required />
              </div>
              <Button type="submit" size="sm" className="w-full text-xs">
                Simpan Konfigurasi
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
