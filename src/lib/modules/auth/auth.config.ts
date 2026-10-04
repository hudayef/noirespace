import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db } from "@/lib/db"
import { users, userRoles, roles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const password = credentials.password as string

        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        })

        if (!user || user.status !== "active") return null

        const isValid = await compare(password, user.passwordHash)
        if (!isValid) return null

        const userRoleRecords = await db
          .select({ slug: roles.slug })
          .from(userRoles)
          .innerJoin(roles, eq(userRoles.roleId, roles.id))
          .where(eq(userRoles.userId, user.id))

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: userRoleRecords.map((r) => r.slug),
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.roles = (user as any).roles
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).roles = token.roles
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
}
