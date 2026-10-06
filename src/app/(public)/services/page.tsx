import { getProducts } from "@/lib/modules/catalog/catalog.service"
import { formatRupiah } from "@/lib/utils/format"
import { SectionLabel, CatalogRow } from "@/components/editorial"

export const metadata = {
  title: "Layanan Kreatif Komersial — Noire Space",
  description: "Layanan fotografi produk, portofolio, dan produksi konten digital komersial di Noire Space Jakarta.",
}

export default async function ServicesPage() {
  const items = await getProducts({ type: "service", status: "published" })

  return (
    <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-16">
      <div className="space-y-4 max-w-3xl">
        <SectionLabel number="03" label="COMMERCIAL PRODUCTION" />
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-[#f3f1eb] leading-tight">
          LAYANAN KREATIF
        </h1>
        <p className="text-sm sm:text-base text-[#6f6f6a] leading-relaxed">
          Solusi produksi visual terpadu untuk brand dan UMKM: fotografi katalog e-commerce, lookbook fashion, editorial portrait, generative AI assets, hingga manajemen konten end-to-end.
        </p>
      </div>

      <div className="border-t border-[#f3f1eb]/[0.08]">
        {items.length === 0 ? (
          <p className="font-mono text-xs text-[#6f6f6a] py-16 text-center uppercase tracking-wider">
            Belum ada layanan yang dipublikasikan.
          </p>
        ) : (
          items.map((item, idx) => {
            const meta = [
              item.durationMinutes ? `ESTIMASI: ${item.durationMinutes} MENIT` : null,
              "OUTPUT: HIGH-RES DIGITAL",
            ]
              .filter(Boolean)
              .join(" · ")

            return (
              <CatalogRow
                key={item.id}
                index={idx + 1}
                title={item.name}
                category="CREATIVE SERVICE"
                description={item.shortDescription || item.description}
                metadata={meta}
                priceText={`Mulai dari ${formatRupiah(item.price)}`}
                href={`/services/${item.slug}`}
                ctaText="PESAN LAYANAN"
              />
            )
          })
        )}
      </div>
    </div>
  )
}
