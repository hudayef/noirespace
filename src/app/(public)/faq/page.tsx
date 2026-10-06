import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SectionLabel } from "@/components/editorial"
import { ArrowLeft } from "lucide-react"

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

      <div className="space-y-3">
        <SectionLabel number="01" label="BANTUAN & KEBIJAKAN" />
        <h1 className="font-display text-4xl sm:text-5xl font-normal text-[#f3f1eb] leading-tight">
          PERTANYAAN UMUM
        </h1>
        <p className="text-sm sm:text-base text-[#6f6f6a] leading-relaxed">
          Jawaban atas pertanyaan yang paling sering diajukan seputar operasional studio, program edukasi, dan ketentuan pemesanan.
        </p>
      </div>

      <div className="space-y-4 font-mono text-xs">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 lg:p-7 space-y-2">
            <h2 className="text-sm font-sans font-medium text-[#f3f1eb] flex items-start gap-2">
              <span className="font-mono text-[11px] text-[#6f6f6a] shrink-0 mt-0.5">Q.</span>
              <span>{faq.q}</span>
            </h2>
            <p className="text-[#6f6f6a] leading-relaxed pl-5 text-xs font-sans">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-mono text-xs uppercase tracking-wider text-[#f3f1eb]">Punya pertanyaan lain?</h3>
          <p className="text-xs text-[#6f6f6a] mt-0.5">Tim concierge Noire Space siap membantu menjawab pertanyaan Anda.</p>
        </div>
        <Link href="/contact">
          <Button variant="outline" size="sm" className="font-mono text-[10px] uppercase tracking-wider border-[#f3f1eb]/[0.15] text-[#e8e6df] hover:text-[#f3f1eb] rounded-none flex items-center gap-1.5 shrink-0">
            <span>Hubungi Kami</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
