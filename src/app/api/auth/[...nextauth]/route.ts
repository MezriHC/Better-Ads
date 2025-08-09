import NextAuth from "next-auth/next"
import GoogleProvider from "next-auth/providers/google"
import type { JWT } from "next-auth/jwt"
import type { User } from "next-auth"
import { getSupabaseAdmin } from "../../../_shared/lib/supabase"

async function ensureUserInSupabase(params: { email?: string | null; name?: string | null; image?: string | null }) {
  const email = params.email?.toLowerCase() || null
  if (!email) {
    console.log('❌ No email provided')
    return null
  }

  console.log('🔄 Attempting to create/update user:', { email, name: params.name, image: params.image })

  try {
    const supabase = getSupabaseAdmin()
    console.log('✅ Supabase admin client created')
    
    const { data, error } = await supabase
      .from('users')
      .upsert(
        { email, name: params.name || null, image: params.image || null },
        { onConflict: 'email' }
      )
      .select('id')
      .single()

    if (error) {
      console.error('❌ Supabase upsert error:', error)
      return null
    }
    
    console.log('✅ User created/updated successfully:', data)
    return data?.id || null
  } catch (err) {
    console.error('❌ Unexpected error in ensureUserInSupabase:', err)
    return null
  }
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
      console.log('🔄 JWT callback called:', { hasAccount: !!account, hasUser: !!user })
      if (account && user) {
        console.log('🔄 First-time login detected, creating/updating user in Supabase')
        const appUser = user as User
        const supabaseUserId = await ensureUserInSupabase({
          email: appUser.email,
          name: appUser.name,
          image: appUser.image,
        })
        if (supabaseUserId) {
          console.log('✅ Supabase user ID added to token:', supabaseUserId)
          const tokenWithId = token as JWT & { supabaseUserId?: string }
          tokenWithId.supabaseUserId = supabaseUserId
        } else {
          console.error('❌ Failed to get Supabase user ID')
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
