import Link from "next/link"
import { SectionLabel } from "@/components/editorial"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Syarat & Ketentuan — Noire Space",
  description: "Syarat dan ketentuan penggunaan platform dan pemesanan layanan Noire Space.",
}

export default function TermsPage() {
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
        <SectionLabel number="01" label="LEGAL AGREEMENT" />
        <h1 className="font-display text-4xl sm:text-5xl font-normal text-[#f3f1eb] leading-tight">
          SYARAT & KETENTUAN
        </h1>
        <p className="font-mono text-xs text-[#6f6f6a]">DOKUMEN OPERASIONAL · OKTOBER 2026</p>
      </div>

      <div className="space-y-6">
        <section className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 lg:p-8 space-y-3">
          <span className="font-mono text-[10px] text-[#6f6f6a] uppercase">01 / KETENTUAN TRANSAKSI</span>
          <h2 className="font-display text-lg text-[#f3f1eb] font-normal">Pemesanan & Pembayaran</h2>
          <p className="text-xs sm:text-sm text-[#6f6f6a] leading-relaxed">
            Semua transaksi pemesanan rental studio, program edukasi kreator, dan layanan komersial wajib diselesaikan melalui kanal pembayaran resmi platform (Midtrans). Slot reservasi baru dianggap sah dan terkonfirmasi setelah sistem menerima notifikasi pembayaran berstatus lunas.
          </p>
        </section>

        <section className="border border-[#f3f1eb]/[0.2] bg-[#111111] p-6 lg:p-8 space-y-3">
          <span className="font-mono text-[10px] text-[#e8e6df] uppercase tracking-wider">02 / ATURAN BISNIS MUTLAK</span>
          <h2 className="font-display text-lg text-[#f3f1eb] font-normal">Kebijakan Non-Refundable (Tanpa Pengembalian Dana)</h2>
          <p className="text-xs sm:text-sm text-[#e8e6df] leading-relaxed">
            Noire Space menerapkan kebijakan tegas <strong className="text-[#f3f1eb]">Non-Refundable</strong>. Seluruh pembayaran yang telah berhasil tidak dapat dicairkan atau dikembalikan dalam bentuk dana tunai dengan alasan apa pun.
          </p>
        </section>

        <section className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 lg:p-8 space-y-3">
          <span className="font-mono text-[10px] text-[#6f6f6a] uppercase">03 / PENJADWALAN ULANG</span>
          <h2 className="font-display text-lg text-[#f3f1eb] font-normal">Ketentuan Reschedule Sesi</h2>
          <p className="text-xs sm:text-sm text-[#6f6f6a] leading-relaxed">
            Pelanggan diperkenankan mengajukan reschedule jadwal sesi mandiri melalui dashboard akun dengan ketentuan:
          </p>
          <ul className="font-mono text-xs text-[#6f6f6a] space-y-1.5 pl-2">
            <li>• Maksimal pengajuan adalah 1 (satu) kali per nomor booking.</li>
            <li>• Diajukan minimal 24 jam sebelum waktu sesi awal dimulai.</li>
            <li>• Pemilihan jadwal baru bergantung pada ketersediaan slot kosong di sistem.</li>
          </ul>
        </section>

        <section className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 lg:p-8 space-y-3">
          <span className="font-mono text-[10px] text-[#6f6f6a] uppercase">04 / TATA TERTIB RUANG</span>
          <h2 className="font-display text-lg text-[#f3f1eb] font-normal">Penggunaan Ruangan & Inventaris Alat</h2>
          <p className="text-xs sm:text-sm text-[#6f6f6a] leading-relaxed">
            Pengguna studio bertanggung jawab penuh atas keamanan peralatan yang dipinjamkan selama sesi berlangsung. Kerusakan alat yang diakibatkan oleh kelalaian penggunaan di luar SOP akan dibebankan kepada pihak penyewa.
          </p>
        </section>
      </div>
    </div>
  )
}
