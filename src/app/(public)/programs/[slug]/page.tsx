import { notFound } from "next/navigation"
import Link from "next/link"
import { getProductBySlug } from "@/lib/modules/catalog/catalog.service"
import { formatRupiah } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Program Tidak Ditemukan" }
  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription,
  }
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product || product.status !== "published") {
    notFound()
  }

  const includes = (product.includes as string[]) || []
  const requirements = (product.requirements as string[]) || []

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Program Edukasi</span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mt-2">{product.name}</h1>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {product.description || product.shortDescription}
            </p>
          </div>

          {includes.length > 0 && (
            <div className="space-y-4 rounded-lg border p-6">
              <h2 className="text-xl font-bold">Apa yang Kamu Dapatkan:</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {includes.map((inc, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {requirements.length > 0 && (
            <div className="space-y-4 rounded-lg border p-6">
              <h2 className="text-xl font-bold">Persyaratan:</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {requirements.map((req, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <div className="rounded-lg border bg-card p-6 space-y-6 sticky top-24">
            <div>
              <span className="text-xs text-muted-foreground block">Biaya Registrasi</span>
              <span className="text-3xl font-bold">{product.price === 0 ? "Gratis" : formatRupiah(product.price)}</span>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground border-y py-4">
              {product.durationMinutes && (
                <div className="flex justify-between">
                  <span>Total Durasi</span>
                  <span className="font-medium text-foreground">{product.durationMinutes} menit</span>
                </div>
              )}
              {product.capacity && (
                <div className="flex justify-between">
                  <span>Kapasitas Kelas</span>
                  <span className="font-medium text-foreground">{product.capacity} peserta</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Konfirmasi</span>
                <span className="font-medium text-foreground">Instan via Email</span>
              </div>
            </div>

            <Link href={`/booking?productId=${product.id}`} className="block">
              <Button size="lg" className="w-full">
                Daftar & Pilih Jadwal
              </Button>
            </Link>

            <p className="text-xs text-center text-muted-foreground">
              Sesuai kebijakan Noire Space, pendaftaran yang telah dibayar tidak dapat direfund.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
