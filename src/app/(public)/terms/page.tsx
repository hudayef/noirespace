export const metadata = {
  title: "Syarat & Ketentuan",
  description: "Syarat dan ketentuan penggunaan platform Noire Space.",
}

export default function TermsPage() {
  return (
    <div className="container py-16 space-y-8 max-w-4xl prose dark:prose-invert">
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight">SYARAT & KETENTUAN</h1>
      <p className="text-sm text-muted-foreground">Terakhir diperbarui: 4 Oktober 2026</p>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">1. Ketentuan Pemesanan</h2>
        <p className="text-sm text-muted-foreground">
          Semua transaksi pemesanan studio, program edukasi, dan layanan kreatif wajib diselesaikan melalui payment gateway resmi platform. Slot jadwal baru dianggap sah setelah status pembayaran terkonfirmasi Lunas.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">2. Kebijakan Non-Refund</h2>
        <p className="text-sm text-muted-foreground">
          Noire Space menerapkan kebijakan tegas tanpa pengembalian dana (No Refund Policy). Pembayaran yang telah berhasil tidak dapat dicairkan kembali dengan alasan apa pun.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">3. Ketentuan Penjadwalan Ulang (Reschedule)</h2>
        <p className="text-sm text-muted-foreground">
          Pelanggan diperkenankan melakukan penjadwalan ulang sesi sebanyak 1 (satu) kali dengan pemberitahuan minimal 24 jam sebelum waktu sesi dimulai, tergantung ketersediaan slot kosong.
        </p>
      </section>
    </div>
  )
}
