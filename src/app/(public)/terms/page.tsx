import Link from "next/link"
import { ShieldAlert, ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Syarat & Ketentuan — Noire Space",
  description: "Syarat dan ketentuan penggunaan platform dan pemesanan layanan Noire Space.",
}

export default function TermsPage() {
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
          <ShieldAlert className="h-4 w-4" />
          <span>Legal Agreement</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">SYARAT & KETENTUAN</h1>
        <p className="text-xs text-neutral-400">Terakhir diperbarui: 5 Oktober 2026</p>
      </div>

      <div className="space-y-6">
        <section className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 lg:p-8 space-y-3">
          <h2 className="text-lg font-bold text-white">1. Ketentuan Pemesanan & Pembayaran</h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Semua transaksi pemesanan rental studio, program edukasi kreator, dan layanan komersial wajib diselesaikan melalui kanal pembayaran resmi platform (Midtrans). Slot reservasi baru dianggap sah dan terkonfirmasi setelah sistem menerima notifikasi pembayaran berstatus lunas.
          </p>
        </section>

        <section className="rounded-xl border border-rose-500/20 bg-[#161214] p-6 lg:p-8 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-rose-400 font-bold">2.</span>
            <span>Kebijakan Tanpa Pengembalian Dana (No-Refund Policy)</span>
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Noire Space menerapkan kebijakan tegas <strong className="text-white">Non-Refundable</strong>. Seluruh pembayaran yang telah berhasil tidak dapat dicairkan atau dikembalikan dalam bentuk dana tunai dengan alasan apa pun.
          </p>
        </section>

        <section className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 lg:p-8 space-y-3">
          <h2 className="text-lg font-bold text-white">3. Ketentuan Penjadwalan Ulang (Reschedule)</h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Pelanggan diperkenankan mengajukan reschedule jadwal sesi mandiri melalui dashboard akun dengan ketentuan:
          </p>
          <ul className="list-disc list-inside text-xs text-neutral-400 space-y-1 pl-2">
            <li>Maksimal pengajuan adalah 1 (satu) kali per nomor booking.</li>
            <li>Diajukan minimal 24 jam sebelum waktu sesi awal dimulai.</li>
            <li>Pemilihan jadwal baru bergantung pada ketersediaan slot kosong di sistem.</li>
          </ul>
        </section>

        <section className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 lg:p-8 space-y-3">
          <h2 className="text-lg font-bold text-white">4. Penggunaan Ruangan & Inventaris Alat</h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Pengguna studio bertanggung jawab penuh atas keamanan peralatan yang dipinjamkan selama sesi berlangsung. Kerusakan alat yang diakibatkan oleh kelalaian penggunaan di luar SOP akan dibebankan kepada pihak penyewa.
          </p>
        </section>
      </div>
    </div>
  )
}
