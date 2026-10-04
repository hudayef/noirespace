import Link from "next/link"
import { getProducts } from "@/lib/modules/catalog/catalog.service"
import { formatRupiah } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Studio Rental",
  description: "Studio foto dan konten profesional dengan peralatan lighting modern di Noire Space.",
}

export default async function StudioPage() {
  const items = await getProducts({ type: "studio", status: "published" })

  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">STUDIO EXPERIENCE</h1>
        <p className="text-muted-foreground max-w-2xl">
          Ruang studio profesional siap pakai dengan tata cahaya terkalibrasi dan peralatan standar industri.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <p className="text-muted-foreground col-span-full">Belum ada paket studio yang dipublikasikan.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-lg border bg-card p-6 flex flex-col justify-between hover:border-foreground/40 transition-colors">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Studio</span>
                <h2 className="text-xl font-bold">{item.name}</h2>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {item.shortDescription || item.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                  {item.durationMinutes && <span>Durasi: {item.durationMinutes} menit</span>}
                  {item.capacity && <span>Maks: {item.capacity} orang</span>}
                </div>
              </div>
              <div className="pt-6 mt-6 border-t flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground block">Mulai Dari</span>
                  <span className="font-bold text-lg">{formatRupiah(item.price)}</span>
                </div>
                <Link href={`/studio/${item.slug}`}>
                  <Button size="sm">Pesan Slot</Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
