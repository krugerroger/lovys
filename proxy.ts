// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Récupérer l'utilisateur authentifié
  const { data: { session } } = await supabase.auth.getSession()
  const path = request.nextUrl.pathname

  // Routes admin - nécessitent des permissions spéciales
  const adminRoutes = ['/admin', '/admin/dashboard', '/admin/ads', '/admin/users', '/admin/settings']

  // Routes publiques - pas besoin d'authentification
  const publicRoutes = [
    '/',
    '/login', 
    '/register', 
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/ads',
    '/ads/[id]',
    '/search',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/adminLogin' // Route de login admin est publique
  ]

  // Routes protégées avec leurs types d'utilisateurs requis
  const protectedRoutes = {
    // Routes pour les escorts seulement
    '/manage': 'escort',
    '/manage/ads': 'escort',
    '/manage/ads/form': 'escort',
    '/manage/dashboard': 'escort',
    '/manage/chat/threads': 'escort',
    '/manage/payments/history': 'escort',
    '/manage/settings': 'escort',
    '/manage/payments': 'escort',
    
    // Routes pour les clients seulement
    '/profile': 'client',
    '/bookings': 'client',
    '/favorites': 'client',
    '/reviews': 'client',
    '/messages': 'client',
    '/settings': 'client',
    
    // Routes accessibles aux deux types
    '/dashboard': ['client', 'escort'],
    '/account': ['client', 'escort'],
    '/notifications': ['client', 'escort'],
  }

  // Fonction pour vérifier si un chemin est public
  const isPublicRoute = (path: string): boolean => {
    // Vérifier les routes exactes
    if (publicRoutes.includes(path)) {
      return true
    }

    // Vérifier les routes dynamiques (comme /ads/[id])
    for (const route of publicRoutes) {
      if (route.includes('[') && route.includes(']')) {
        const pattern = route.replace(/\[.*?\]/g, '([^/]+)')
        const regex = new RegExp(`^${pattern}$`)
        if (regex.test(path)) {
          return true
        }
      }
    }

    // Vérifier les sous-routes
    return publicRoutes.some(route => 
      route !== '/' && path.startsWith(route + '/')
    )
  }

  // ========== LOGIQUE POUR LES ROUTES ADMIN ==========
  // Vérifier si la route actuelle est une route admin
  const isAdminRoute = adminRoutes.some(route => 
    path === route || path.startsWith(route + '/')
  )

  if (isAdminRoute) {
    // Si c'est une route admin, on ignore la logique normale et on applique les règles admin
    
    if (!session || !session.user) {
      // Pas connecté, rediriger vers login admin
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/adminLogin'
      redirectUrl.searchParams.set('redirect', encodeURIComponent(path))
      return NextResponse.redirect(redirectUrl)
    }

    // Vérifier les permissions admin
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('user_type')
        .eq('user_id', session.user.id)
        .single()

      const isAdmin = userData?.user_type === 'admin'

      if (!isAdmin) {
        // Pas admin, rediriger selon le type d'utilisateur
        return handleUnauthorizedAccess(request, userData?.user_type)
      }

      // Admin autorisé, continuer
      return response
    } catch (error) {
      console.error('Admin check error:', error)
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/adminLogin'
      redirectUrl.searchParams.set('error', 'admin_check_failed')
      return NextResponse.redirect(redirectUrl)
    }
  }

  // ========== LOGIQUE POUR LES ROUTES NORMALES ==========
  
  // 1. Si l'utilisateur n'est pas connecté
  if (!session || !session.user) {
    // Si la route n'est pas publique, rediriger vers login
    if (!isPublicRoute(path)) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('redirect', encodeURIComponent(path))
      return NextResponse.redirect(redirectUrl)
    }
    
    // Si la route est publique, continuer
    return response
  }

  // 2. L'utilisateur est connecté
  // Récupérer le type d'utilisateur depuis la base de données
  const { data: userData } = await supabase
    .from('users')
    .select('user_type')
    .eq('user_id', session.user.id)
    .single()

  const userType = userData?.user_type

  // 3. Vérifier les routes protégées
  for (const [route, allowedTypes] of Object.entries(protectedRoutes)) {
    // Vérifier si le chemin commence par cette route
    if (path === route || path.startsWith(route + '/')) {
      // Si allowedTypes est un tableau, vérifier l'appartenance
      if (Array.isArray(allowedTypes)) {
        if (!allowedTypes.includes(userType)) {
          return handleUnauthorizedAccess(request, userType)
        }
      } 
      // Si allowedTypes est une chaîne, vérifier l'égalité
      else if (allowedTypes !== userType) {
        return handleUnauthorizedAccess(request, userType)
      }
    }
  }

  // 4. Rediriger les utilisateurs connectés qui essaient d'accéder à des routes d'authentification
  const authRoutes = ['/login', '/register', '/forgot-password']
  if (authRoutes.includes(path) && userType !== 'admin') {
    return redirectAuthenticatedUser(request, userType)
  }

  // 5. Gérer la route racine pour les utilisateurs connectés
  if (path === '/') {
    // La route "/" reste accessible à tous, même connectés
    return response
  }

  return response
}

// Fonction pour gérer l'accès non autorisé
function handleUnauthorizedAccess(request: NextRequest, userType: string) {
  const redirectUrl = request.nextUrl.clone()
  
  if (userType === 'admin') {
    // Si admin essaye d'accéder à une route non-admin, rediriger vers dashboard admin
    redirectUrl.pathname = '/admin/dashboard'
  } else if (userType === 'escort') {
    redirectUrl.pathname = '/manage/chat/threads'
  } else if (userType === 'client') {
    redirectUrl.pathname = '/profile'
  }
  
  redirectUrl.searchParams.set('error', 'unauthorized')
  return NextResponse.redirect(redirectUrl)
}

// Fonction pour rediriger les utilisateurs authentifiés
function redirectAuthenticatedUser(request: NextRequest, userType: string) {
  const redirectUrl = request.nextUrl.clone()
  
  if (userType === 'admin') {
    redirectUrl.pathname = '/admin/dashboard'
  } else if (userType === 'escort') {
    redirectUrl.pathname = '/manage/chat/threads'
  } else if (userType === 'client') {
    redirectUrl.pathname = '/profile'
  }
  
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth/callback (Supabase auth callback)
     * - api/admin (API routes admin)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth/callback|api/admin|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}