export const metadata = {
  title: "Tentang Kami",
  description: "Mengenal ekosistem teknologi kreatif Noire Space.",
}

export default function AboutPage() {
  return (
    <div className="container py-16 space-y-12 max-w-4xl">
      <div className="space-y-4">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Our Story</span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">LEARN. CREATE. EARN.</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Noire Space adalah creative technology ecosystem yang didirikan untuk mempercepat pertumbuhan kreator muda melalui penguasaan teknologi visual, kecerdasan buatan, dan kemandirian berkarya.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">01. Learn</h2>
          <p className="text-sm text-muted-foreground">Edukasi berbasis praktik langsung, dimentori oleh praktisi aktif di industri komersial modern.</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">02. Create</h2>
          <p className="text-sm text-muted-foreground">Akses ke fasilitas studio berstandar industri, peralatan lighting profesional, dan ekosistem software terkini.</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">03. Earn</h2>
          <p className="text-sm text-muted-foreground">Menghubungkan portofolio siswa dengan kebutuhan riil pasar digital dan peluang komersial nyata.</p>
        </div>
      </div>
    </div>
  )
}
