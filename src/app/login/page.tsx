"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth-client"
import { IconBrandGoogle, IconMail, IconSparkles, IconLoader2, IconShieldCheck } from "@tabler/icons-react"

export default function LoginPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [showEmailSoon, setShowEmailSoon] = useState(false)

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
    setShowEmailSoon(true)
    setTimeout(() => setShowEmailSoon(false), 3000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-chart-1/5 via-background to-chart-2/5"></div>
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-chart-3/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-chart-4/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-chart-1 to-chart-2 rounded-3xl mb-6 shadow-xl">
            <IconSparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
            Better Ads
          </h1>
          <p className="text-lg text-muted-foreground">
            Créez vos publicités avec l'IA
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-border p-8 relative overflow-hidden">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-chart-1/5 via-transparent to-chart-2/5 rounded-3xl"></div>
          
          <div className="relative z-10 flex flex-col gap-6">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-chart-1/20 to-chart-2/20 rounded-2xl group-hover:opacity-100 opacity-0 transition-opacity"></div>
              {isGoogleLoading ? (
                <IconLoader2 className="w-6 h-6 animate-spin relative z-10" />
              ) : (
                <IconBrandGoogle className="w-6 h-6 relative z-10" />
              )}
              <span className="font-semibold text-lg relative z-10">
                {isGoogleLoading ? "Connexion..." : "Continuer avec Google"}
              </span>
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground font-medium">ou</span>
              </div>
            </div>

            {/* Email Form - Coming Soon */}
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <IconMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 text-foreground placeholder:text-muted-foreground cursor-not-allowed opacity-60"
                  disabled
                />
              </div>
              
              <button
                type="submit"
                disabled
                className="w-full py-4 bg-secondary text-secondary-foreground rounded-2xl font-semibold cursor-not-allowed flex items-center justify-center gap-3 opacity-60"
              >
                <IconMail className="w-5 h-5" />
                Connexion par email - Bientôt disponible
              </button>
            </form>

            {/* Coming Soon Badge */}
            {showEmailSoon && (
              <div className="text-center animate-fade-in-up">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-chart-4/20 text-chart-4 border border-chart-4/30">
                  <IconShieldCheck className="w-4 h-4" />
                  Authentification email en développement
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="flex flex-col items-center gap-2 p-4 bg-card/40 rounded-2xl border border-border/50">
              <div className="w-10 h-10 bg-chart-1/20 rounded-xl flex items-center justify-center">
                <IconSparkles className="w-5 h-5 text-chart-1" />
              </div>
              <span className="text-sm font-medium text-foreground">IA Avancée</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-card/40 rounded-2xl border border-border/50">
              <div className="w-10 h-10 bg-chart-2/20 rounded-xl flex items-center justify-center">
                <IconShieldCheck className="w-5 h-5 text-chart-2" />
              </div>
              <span className="text-sm font-medium text-foreground">Sécurisé</span>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              En vous connectant, vous acceptez nos{" "}
              <a href="#" className="text-chart-1 hover:text-chart-1/80 transition-colors font-medium">
                Conditions d'utilisation
              </a>{" "}
              et notre{" "}
              <a href="#" className="text-chart-1 hover:text-chart-1/80 transition-colors font-medium">
                Politique de confidentialité
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}