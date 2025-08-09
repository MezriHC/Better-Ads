"use client"

import dynamic from "next/dynamic"

// Charger le hook auth seulement côté client
const AuthRedirect = dynamic(() => import('./_shared/components/AuthRedirect'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center flex flex-col gap-4 items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    </div>
  )
})

export default function Home() {
  return <AuthRedirect />
}
