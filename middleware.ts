import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

// Routes protégées par NextAuth
const PROTECTED_ROUTES = ["/dashboard"]

// Routes admin protégées
const ADMIN_ROUTES = ["/admin"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Vérifier si c'est une route admin
  const isAdminRoute = ADMIN_ROUTES.some(route => 
    pathname.startsWith(route)
  )

  // Les routes admin utilisent leur propre système d'authentification côté client
  if (isAdminRoute) {
    return NextResponse.next()
  }
  
  // Vérifier si la route est protégée par NextAuth
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  )

  // Si c'est une route protégée, vérifier la session NextAuth
  if (isProtectedRoute) {
    try {
      const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET 
      })

      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url))
      }

      // Session valide, continuer
      return NextResponse.next()
    } catch {
      // En cas d'erreur, rediriger par sécurité
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Redirection automatique pour utilisateurs connectés sur /login
  if (pathname === "/login") {
    try {
      const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET 
      })

      if (token) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch {
      // Erreur silencieuse, permettre l'accès à /login
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}