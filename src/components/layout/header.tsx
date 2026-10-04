import Link from "next/link"
import { auth } from "@/lib/modules/auth"
import { Button } from "@/components/ui/button"

export async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-widest">
            NOIRE SPACE
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/programs" className="text-muted-foreground hover:text-foreground transition-colors">Program</Link>
            <Link href="/studio" className="text-muted-foreground hover:text-foreground transition-colors">Studio</Link>
            <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">Layanan</Link>
            <Link href="/school" className="text-muted-foreground hover:text-foreground transition-colors">Sekolah</Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">Tentang</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {session?.user ? (
            <div className="flex items-center gap-4">
              <Link href="/account">
                <Button variant="ghost" size="sm">{session.user.name}</Button>
              </Link>
              {(session.user as any).roles?.some((r: string) => ["super_admin", "admin", "staff"].includes(r)) && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">Admin</Button>
                </Link>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm">Masuk</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
