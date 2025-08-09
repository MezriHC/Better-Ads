import { betterAuth } from "better-auth"
import { supabaseAdapter } from "better-auth/adapters/supabase"
import { supabaseAdmin } from "./supabase"

export const auth = betterAuth({
  database: supabaseAdapter(supabaseAdmin),
  
  // Base URL configuration
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!,

  // Social providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: ["openid", "email", "profile"],
      mapProfileToUser: (profile) => {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          emailVerified: profile.email_verified,
        }
      }
    },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },

  // Security settings
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },

  // Rate limiting pour la sécurité
  rateLimit: {
    window: 60, // 60 secondes
    max: 100, // max 100 requêtes par minute
    customRules: {
      "/sign-in/*": {
        window: 60,
        max: 5, // max 5 tentatives de connexion par minute
      },
    },
  },
})

// Export types for TypeScript
export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user