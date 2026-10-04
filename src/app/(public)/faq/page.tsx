export const metadata = {
  title: "Pertanyaan Umum (FAQ)",
  description: "Pertanyaan yang sering diajukan mengenai layanan Noire Space.",
}

const faqs = [
  {
    q: "Apakah bisa mengajukan pengembalian dana (refund) jika berhalangan hadir?",
    a: "Sesuai kebijakan resmi Noire Space, seluruh pemesanan yang telah dibayar bersifat non-refundable (tidak dapat di-refund). Namun, Anda dapat mengajukan Reschedule maksimal 24 jam sebelum jadwal sesi Anda melalui dashboard akun.",
  },
  {
    q: "Bagaimana cara melakukan reschedule jadwal?",
    a: "Masuk ke akun Anda, buka menu Booking Saya, pilih sesi yang ingin dijadwalkan ulang, lalu pilih tanggal dan slot waktu baru yang masih tersedia.",
  },
  {
    q: "Apakah peralatan studio sudah termasuk dalam biaya rental?",
    a: "Ya, setiap paket rental studio mencakup lighting dasar, stand, trigger universal, dan asistensi teknis ruang studio.",
  },
  {
    q: "Bagaimana alur pemesanan program sekolah?",
    a: "Pihak sekolah dapat mengisi formulir pengajuan di halaman Program Sekolah. Tim edukasi kami akan menghubungi PIC dalam 1-2 hari kerja untuk presentasi proposal dan penjadwalan.",
  },
]

export default function FAQPage() {
  return (
    <div className="container py-16 space-y-12 max-w-4xl">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">PERTANYAAN UMUM</h1>
        <p className="text-muted-foreground text-lg">Jawaban atas pertanyaan yang paling sering diajukan terkait Noire Space.</p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-lg border p-6 space-y-2">
            <h2 className="text-lg font-bold">{faq.q}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
