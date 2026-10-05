import { auth } from "."

export async function getCurrentUser() {
  const session = await auth()
  return session?.user ?? null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")
  return user
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth()
  const roles = (user as { roles?: string[] }).roles || []
  const hasRole = roles.some((r: string) => allowedRoles.includes(r))
  if (!hasRole) throw new Error("Forbidden")
  return user
}

export async function requireAdmin() {
  return requireRole(["super_admin", "admin"])
}

export async function requireStaff() {
  return requireRole(["super_admin", "admin", "staff"])
}
