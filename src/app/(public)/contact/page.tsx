export const metadata = {
  title: "Hubungi Kami",
  description: "Kontak dan lokasi Noire Space studio & edukasi.",
}

export default function ContactPage() {
  return (
    <div className="container py-16 space-y-12 max-w-4xl">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">HUBUNGI KAMI</h1>
        <p className="text-muted-foreground text-lg">Punya pertanyaan seputar program, rental studio, atau kolaborasi?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-lg border p-8 space-y-4">
          <h2 className="text-xl font-bold">Studio & Office</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Noire Space Creative Hub</p>
            <p>Jam Operasional: Senin - Sabtu (09:00 - 18:00 WIB)</p>
            <p>Minggu & Hari Libur: Khusus Sesi Terjadwal</p>
          </div>
        </div>

        <div className="rounded-lg border p-8 space-y-4">
          <h2 className="text-xl font-bold">Komunikasi</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Email: hello@noirespace.com</p>
            <p>WhatsApp: +62 812-3456-7890</p>
            <p>Instagram: @noirespace</p>
          </div>
        </div>
      </div>
    </div>
  )
}
