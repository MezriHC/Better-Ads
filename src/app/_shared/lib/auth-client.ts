"use client"
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'
import type { User, Session } from './auth'

// Client Supabase pour le navigateur
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Hook pour l'authentification Supabase
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    // Récupérer la session actuelle
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setError(error.message)
          return
        }

        if (session) {
          setSession(session as Session)
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
            image: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
            emailVerified: session.user.email_confirmed_at ? true : false,
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session as Session)
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
          image: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
          emailVerified: session.user.email_confirmed_at ? true : false,
        })
      } else {
        setSession(null)
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Méthodes d'authentification
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      setError(error.message)
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      setError(error.message)
    }
  }

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    error,
    signInWithGoogle,
    signOut,
  }
}