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
    <header className="sticky top-0 z-50 w-full border-b border-[#f3f1eb]/[0.08] bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-6 lg:px-12">
        <Link href="/" className="group flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#6f6f6a] group-hover:text-[#f3f1eb] transition-colors">
            01 /
          </span>
          <span className="font-display text-lg sm:text-xl font-normal tracking-[0.18em] text-[#f3f1eb]">
            NOIRE <span className="text-[#6f6f6a] font-light">SPACE</span>
          </span>
        </Link>
        <NavMenu user={userData} />
      </div>
    </header>
  )
}
