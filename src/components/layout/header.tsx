import Link from "next/link"
import { auth } from "@/lib/modules/auth"
import { NavMenu } from "./nav-menu"

export async function Header() {
  const session = await auth()

  const userData = session?.user
    ? {
        name: session.user.name,
        roles: (session.user as { roles?: string[] }).roles || [],
      }
    : null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#09090b]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#09090b]/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
        <Link href="/" className="group flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400/90 shadow-[0_0_12px_rgba(251,191,36,0.6)] group-hover:scale-125 transition-transform" />
          <span className="text-xl font-extrabold tracking-[0.22em] text-white">
            NOIRE<span className="text-white/40 font-light">SPACE</span>
          </span>
        </Link>
        <NavMenu user={userData} />
      </div>
    </header>
  )
}
