import NextAuth from "next-auth/next"
import GoogleProvider from "next-auth/providers/google"
import type { JWT } from "next-auth/jwt"
import type { User } from "next-auth"
import { getSupabaseAdmin } from "@/lib/supabase"

async function ensureUserInSupabase(params: { email?: string | null; name?: string | null; image?: string | null }) {
  const email = params.email?.toLowerCase() || null
  if (!email) return null

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('users')
    .upsert(
      { email, name: params.name || null, image: params.image || null },
      { onConflict: 'email' }
    )
    .select('id')
    .single()

  if (error) {
    return null
  }
  return data?.id || null
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        const appUser = user as User
        const supabaseUserId = await ensureUserInSupabase({
          email: appUser.email,
          name: appUser.name,
          image: appUser.image,
        })
        if (supabaseUserId) {
          const tokenWithId = token as JWT & { supabaseUserId?: string }
          tokenWithId.supabaseUserId = supabaseUserId
        }
      }
      return token
    },
    async session({ session, token }) {
      const tokenWithId = token as JWT & { supabaseUserId?: string }
      if (tokenWithId.supabaseUserId && session.user) {
        ;(session.user as User).id = tokenWithId.supabaseUserId
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
