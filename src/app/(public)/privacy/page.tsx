import Link from "next/link"
import { Lock, ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Kebijakan Privasi — Noire Space",
  description: "Kebijakan privasi dan perlindungan data pengguna platform Noire Space.",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 lg:px-12 py-16 space-y-10 max-w-4xl">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      <div className="space-y-3">
        <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-semibold flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <span>Data Protection</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">KEBIJAKAN PRIVASI</h1>
        <p className="text-xs text-neutral-400">Terakhir diperbarui: 5 Oktober 2026</p>
      </div>

      <div className="space-y-6">
        <section className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 lg:p-8 space-y-3">
          <h2 className="text-lg font-bold text-white">1. Pengumpulan Data Pengguna</h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Kami mengumpulkan data berupa nama lengkap, alamat email, dan nomor telepon saat Anda mendaftar akun atau memesan sesi untuk keperluan konfirmasi pesanan, bukti faktur digital, dan reminder jadwal otomatis via email/WhatsApp.
          </p>
        </section>

        <section className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 lg:p-8 space-y-3">
          <h2 className="text-lg font-bold text-white">2. Keamanan Pembayaran</h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Platform Noire Space tidak pernah menyimpan data kredensial sensitif seperti nomor kartu kredit atau token perbankan di server kami. Seluruh alur transaksi ditangani secara enkripsi SSL oleh payment gateway berlisensi (Midtrans).
          </p>
        </section>

        <section className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 lg:p-8 space-y-3">
          <h2 className="text-lg font-bold text-white">3. Komunikasi & Penggunaan Kontak</h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Nomor telepon dan email Anda hanya digunakan untuk kebutuhan operasional layanan yang Anda pesan. Kami tidak menjual atau membagikan informasi pribadi Anda kepada pihak ketiga untuk kepentingan periklanan pihak luar.
          </p>
        </section>
      </div>
    </div>
  )
}
