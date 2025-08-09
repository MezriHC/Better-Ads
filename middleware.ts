import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes protégées par Supabase Auth
const PROTECTED_ROUTES = ["/dashboard"]

// Routes publiques
const PUBLIC_ROUTES = ["/", "/login"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  let supabaseResponse = NextResponse.next({
    request,
  })

  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  )

  const createSupabaseMiddlewareClient = () => {
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )
  }

  if (isProtectedRoute) {
    const supabase = createSupabaseMiddlewareClient()

    // Vérifier l'authentification Supabase
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Redirection automatique pour utilisateurs connectés sur /login
  if (pathname === "/login") {
    const supabase = createSupabaseMiddlewareClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}