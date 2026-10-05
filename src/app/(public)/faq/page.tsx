import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HelpCircle, MessageSquare, ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Pertanyaan Umum (FAQ) — Noire Space",
  description: "Pertanyaan yang sering diajukan mengenai layanan studio, edukasi, dan kebijakan Noire Space.",
}

const faqs = [
  {
    q: "Apakah bisa mengajukan pengembalian dana (refund) jika berhalangan hadir?",
    a: "Sesuai kebijakan resmi Noire Space, seluruh pemesanan yang telah dibayar bersifat non-refundable (tidak dapat di-refund). Namun, Anda dapat mengajukan Reschedule mandiri maksimal 24 jam sebelum jadwal sesi Anda melalui dashboard akun.",
  },
  {
    q: "Bagaimana cara melakukan reschedule jadwal?",
    a: "Masuk ke akun Anda, buka menu Riwayat Booking, pilih sesi terkonfirmasi yang ingin diubah, lalu pilih tanggal dan slot jam baru yang tersedia.",
  },
  {
    q: "Apakah peralatan studio sudah termasuk dalam biaya rental?",
    a: "Ya, setiap paket rental studio mencakup lighting dasar, stand, trigger universal, background terpasang, dan asistensi teknis ruang studio.",
  },
  {
    q: "Berapa lama batas waktu pembayaran setelah booking dibuat?",
    a: "Pelanggan memiliki waktu 24 jam untuk menyelesaikan transaksi melalui Midtrans. Jika dalam 24 jam pembayaran belum selesai, pesanan dan booking slot akan otomatis dibatalkan sistem.",
  },
  {
    q: "Bagaimana alur kemitraan program kurikulum sekolah?",
    a: "Pihak sekolah dapat mengisi formulir pengajuan di halaman Program Sekolah. Tim edukasi kami akan menghubungi PIC dalam 1-2 hari kerja untuk presentasi proposal dan penjadwalan.",
  },
]

export default function FAQPage() {
  return (
    <div className="container mx-auto px-6 lg:px-12 py-16 space-y-12 max-w-4xl">
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
          <HelpCircle className="h-4 w-4" />
          <span>Bantuan & Kebijakan</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">PERTANYAAN UMUM</h1>
        <p className="text-base text-neutral-300 leading-relaxed">
          Jawaban atas pertanyaan yang paling sering diajukan seputar operasional studio, program edukasi, dan ketentuan pemesanan.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 lg:p-7 space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-start gap-2">
              <span className="text-amber-400 font-mono text-sm shrink-0 mt-0.5">Q.</span>
              <span>{faq.q}</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed pl-5">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-[#121217] p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-white">Punya pertanyaan lain yang belum terjawab?</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Tim concierge Noire Space siap membantu menjawab pertanyaan Anda.</p>
        </div>
        <Link href="/contact">
          <Button size="sm" className="h-10 text-xs uppercase tracking-wider font-bold bg-white text-black hover:bg-neutral-200 flex items-center gap-1.5 shrink-0">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Hubungi Kami</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
