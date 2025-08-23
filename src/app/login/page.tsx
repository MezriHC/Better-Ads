"use client"

import { useState, useCallback } from "react"
import { signIn } from "next-auth/react"
import { IconMail, IconLock } from "@tabler/icons-react"

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

export default function LoginPage() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleGoogleSignIn = useCallback(async () => {
    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
      })
    } catch {
    }
  }, [])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Header */}
        <div className="text-center flex flex-col gap-8">
          <div className="flex flex-col gap-4 items-center">
            <div className="w-12 h-12 bg-sidebar-primary rounded-xl flex items-center justify-center">
              <IconLock className="w-6 h-6 text-sidebar-primary-foreground" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-foreground">
                Welcome to Better Ads
              </h1>
              <p className="text-muted-foreground">
                Sign in to create your AI-powered advertisements
              </p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex flex-col gap-4">
            
            {/* Google Sign In avec redirection directe */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-muted/50 border border-border/50 rounded-xl hover:bg-muted hover:border-border hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer group"
            >
              <GoogleLogo className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="font-semibold text-foreground transition-colors">
                Continue with Google
              </span>
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">or</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:border-transparent transition-colors text-foreground placeholder:text-muted-foreground"
                />
              </div>
              
              <div className="relative">
                <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Password"
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
                Sign in
              </button>
            </form>

          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            By signing in, you agree to our{" "}
            <a href="#" className="text-foreground hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-foreground hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}