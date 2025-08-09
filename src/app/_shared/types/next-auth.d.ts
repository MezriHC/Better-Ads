declare module "next-auth" {
  interface Session {
    user: {
      id: string // Supabase user id
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface User {
    id: string // Supabase user id
    name?: string | null
    email?: string | null
    image?: string | null
  }
}
