"use client"

import { useState } from "react"
import { signIn } from "@/lib/auth-client"
import { IconBrandGoogle, IconMail, IconLock, IconLoader2 } from "@tabler/icons-react"

export default function LoginPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard"
      })
    } catch (error) {
      setIsGoogleLoading(false)
    }
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-sidebar-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <IconLock className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Bienvenue sur Better Ads
          </h1>
          <p className="text-muted-foreground">
            Connectez-vous pour créer vos publicités avec IA
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex flex-col gap-4">
            
            {/* Google Sign In - Style de la Sidebar */}
            <div className="w-full cursor-pointer">
              <div
                className="p-[2px] rounded-[16px] bg-gradient-to-b from-black/20 to-transparent dark:from-white/20"
              >
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="group rounded-[14px] bg-foreground dark:bg-white shadow-lg hover:shadow-md active:shadow-sm transition-all active:scale-[0.98] w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="px-6 py-3 bg-gradient-to-b from-transparent to-white/10 dark:to-black/10 rounded-[12px] flex items-center justify-center gap-3">
                    {isGoogleLoading ? (
                      <IconLoader2 className="w-5 h-5 animate-spin text-background dark:text-black" />
                    ) : (
                      <IconBrandGoogle className="w-5 h-5 text-background dark:text-black" />
                    )}
                    <span className="font-semibold text-background dark:text-black">
                      {isGoogleLoading ? "Connexion..." : "Continuer avec Google"}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">ou</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:border-transparent transition-colors text-foreground placeholder:text-muted-foreground"
                />
              </div>
              
              <div className="relative">
                <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:border-transparent transition-colors text-foreground placeholder:text-muted-foreground"
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-3 bg-sidebar-accent text-sidebar-accent-foreground rounded-lg font-medium hover:bg-sidebar-accent/80 transition-colors flex items-center justify-center gap-2"
              >
                <IconMail className="w-4 h-4" />
                Se connecter
              </button>
            </form>

          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>
            En vous connectant, vous acceptez nos{" "}
            <a href="#" className="text-foreground hover:underline">
              Conditions d'utilisation
            </a>{" "}
            et notre{" "}
            <a href="#" className="text-foreground hover:underline">
              Politique de confidentialité
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}