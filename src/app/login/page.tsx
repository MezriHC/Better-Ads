"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth-client"
import { IconBrandGoogle, IconMail, IconLock, IconLoader2 } from "@tabler/icons-react"

export default function LoginPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [email, setEmail] = useState("")
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard"
      })
    } catch (error) {
      console.error("Google sign in error:", error)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Pour l'instant, on ne fait rien - Coming Soon
    alert("Connexion par email bientôt disponible !")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <IconLock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue sur Better Ads
          </h1>
          <p className="text-gray-600">
            Connectez-vous pour créer vos publicités avec IA
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <IconLoader2 className="w-5 h-5 animate-spin text-gray-600" />
            ) : (
              <IconBrandGoogle className="w-5 h-5 text-gray-600" />
            )}
            <span className="text-gray-700 font-medium">
              {isGoogleLoading ? "Connexion..." : "Continuer avec Google"}
            </span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Email Form - Coming Soon */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="relative">
              <IconMail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-gray-50 cursor-not-allowed"
                disabled
              />
            </div>
            
            <button
              type="submit"
              disabled
              className="w-full py-3 bg-gray-300 text-gray-500 rounded-xl font-medium cursor-not-allowed flex items-center justify-center gap-2"
            >
              <IconMail className="w-4 h-4" />
              Connexion par email - Bientôt disponible
            </button>
          </form>

          {/* Coming Soon Badge */}
          <div className="mt-6 text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              🚧 Authentification email en cours de développement
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            En vous connectant, vous acceptez nos{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Conditions d'utilisation
            </a>{" "}
            et notre{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Politique de confidentialité
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}