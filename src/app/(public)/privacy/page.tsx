export const metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi perlindungan data pengguna Noire Space.",
}

export default function PrivacyPage() {
  return (
    <div className="container py-16 space-y-8 max-w-4xl prose dark:prose-invert">
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight">KEBIJAKAN PRIVASI</h1>
      <p className="text-sm text-muted-foreground">Terakhir diperbarui: 4 Oktober 2026</p>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">1. Pengumpulan Data</h2>
        <p className="text-sm text-muted-foreground">
          Kami mengumpulkan data berupa nama lengkap, alamat email, dan nomor telepon saat Anda mendaftar atau melakukan transaksi untuk keperluan konfirmasi pesanan dan administrasi jadwal.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">2. Keamanan Pembayaran</h2>
        <p className="text-sm text-muted-foreground">
          Platform tidak menyimpan data kredensial kartu kredit atau rekening bank Anda secara langsung. Seluruh proses transaksi moneter ditangani secara aman oleh penyedia payment gateway berlisensi (Midtrans).
        </p>
      </section>
    </div>
  )
}
