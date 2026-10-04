import { auth } from "@/lib/modules/auth"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isAccountRoute = nextUrl.pathname.startsWith("/account")
  const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")

  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL("/", nextUrl))
  }

  if ((isAdminRoute || isAccountRoute) && !isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl))
  }

  if (isAdminRoute && isLoggedIn) {
    const roles = (req.auth?.user as any)?.roles || []
    const isAdmin = roles.some((r: string) => ["super_admin", "admin", "staff"].includes(r))
    if (!isAdmin) {
      return Response.redirect(new URL("/", nextUrl))
    }
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
