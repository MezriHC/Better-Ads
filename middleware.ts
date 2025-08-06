import { NextRequest, NextResponse } from "next/server"

// Routes protégées par Better Auth
const PROTECTED_ROUTES = ["/dashboard"]

// Routes publiques
const PUBLIC_ROUTES = ["/", "/login"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Vérifier si la route est protégée
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  )

  // Si c'est une route protégée, vérifier la session Better Auth
  if (isProtectedRoute) {
    try {
      // Utiliser l'endpoint Better Auth pour vérifier la session
      const sessionResponse = await fetch(
        new URL("/api/auth/get-session", request.url),
        {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        }
      )

      if (!sessionResponse.ok) {
        return NextResponse.redirect(new URL("/login", request.url))
      }

      const session = await sessionResponse.json()
      
      if (!session?.user) {
        return NextResponse.redirect(new URL("/login", request.url))
      }

      // Session valide, continuer
      return NextResponse.next()
    } catch (error) {
      // En cas d'erreur, rediriger par sécurité
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Redirection automatique pour utilisateurs connectés sur /login
  if (pathname === "/login") {
    try {
      const sessionResponse = await fetch(
        new URL("/api/auth/get-session", request.url),
        {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        }
      )

      if (sessionResponse.ok) {
        const session = await sessionResponse.json()
        if (session?.user) {
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }
      }
    } catch (error) {
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