import Link from "next/link"
import { SectionLabel } from "@/components/editorial"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Kebijakan Privasi — Noire Space",
  description: "Kebijakan privasi dan perlindungan data pengguna platform Noire Space.",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-12 max-w-4xl">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#6f6f6a] hover:text-[#f3f1eb] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      <div className="space-y-4">
        <SectionLabel number="01" label="DATA PROTECTION" />
        <h1 className="font-display text-4xl sm:text-5xl font-normal text-[#f3f1eb] leading-tight">
          KEBIJAKAN PRIVASI
        </h1>
        <p className="font-mono text-xs text-[#6f6f6a]">DOKUMEN OPERASIONAL · OKTOBER 2026</p>
      </div>

      <div className="space-y-6">
        <section className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 lg:p-8 space-y-3">
          <span className="font-mono text-[10px] text-[#6f6f6a] uppercase">01 / PENGUMPULAN DATA</span>
          <h2 className="font-display text-lg text-[#f3f1eb] font-normal">Data Pengguna</h2>
          <p className="text-xs sm:text-sm text-[#6f6f6a] leading-relaxed">
            Kami mengumpulkan data berupa nama lengkap, alamat email, dan nomor telepon saat Anda mendaftar akun atau memesan sesi untuk keperluan konfirmasi pesanan, bukti faktur digital, dan reminder jadwal otomatis via email/WhatsApp.
          </p>
        </section>

        <section className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 lg:p-8 space-y-3">
          <span className="font-mono text-[10px] text-[#6f6f6a] uppercase">02 / KEAMANAN TRANSAKSI</span>
          <h2 className="font-display text-lg text-[#f3f1eb] font-normal">Keamanan Pembayaran</h2>
          <p className="text-xs sm:text-sm text-[#6f6f6a] leading-relaxed">
            Platform Noire Space tidak pernah menyimpan data kredensial sensitif seperti nomor kartu kredit atau token perbankan di server kami. Seluruh alur transaksi ditangani secara enkripsi SSL oleh payment gateway berlisensi (Midtrans).
          </p>
        </section>

        <section className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 lg:p-8 space-y-3">
          <span className="font-mono text-[10px] text-[#6f6f6a] uppercase">03 / KOMUNIKASI</span>
          <h2 className="font-display text-lg text-[#f3f1eb] font-normal">Komunikasi & Penggunaan Kontak</h2>
          <p className="text-xs sm:text-sm text-[#6f6f6a] leading-relaxed">
            Nomor telepon dan email Anda hanya digunakan untuk kebutuhan operasional layanan yang Anda pesan. Kami tidak menjual atau membagikan informasi pribadi Anda kepada pihak ketiga untuk kepentingan periklanan pihak luar.
          </p>
        </section>
      </div>
    </div>
  )
}
