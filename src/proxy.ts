// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createI18nMiddleware } from 'next-international/middleware'
import { createServerClient } from '@supabase/ssr'

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'fr', 'de', 'es', 'pt'],
  defaultLocale: 'fr',
  urlMappingStrategy: 'rewriteDefault',
})

const PUBLIC_ROUTES = [
  '/',
  '/en',
  '/fr',
  '/de',
  '/es',
  '/pt',
  '/login',
  '/en/login',
  '/fr/login',
  '/de/login',
  '/es/login',
  '/pt/login',
  '/escorts',
  '/en/escorts',
  '/fr/escorts',
  '/de/escorts',
  '/es/escorts',
  '/pt/escorts',
  '/register',
  '/en/register',
  '/fr/register',
  '/de/register',
  '/es/register',
  '/pt/register',
  '/adminLogin',
  '/en/adminLogin',
  '/fr/adminLogin',
  '/de/adminLogin',
  '/es/adminLogin',
  '/pt/adminLogin',
  '/unauthorized',
  '/api/auth',
  '/favicon.ico',
  '/robots.txt'
]

// Routes admin
const adminRoutes = [
  '/admin',
  '/admin/dashboard',
  '/admin/ads',
  '/admin/users',
  '/admin/settings'
]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. D'abord vérifier les routes publiques
  if (PUBLIC_ROUTES.some(route => {
    const normalizedPath = pathname.replace(/\/$/, '')
    const normalizedRoute = route.replace(/\/$/, '')
    return normalizedPath === normalizedRoute || pathname.startsWith(`${route}/`)
  })) {
    return I18nMiddleware(request)
  }

  // 2. Ensuite le traitement i18n
  let response = I18nMiddleware(request)
  
  // Vérifier si I18nMiddleware retourne une redirection
  if (response.status === 307 || response.status === 308) {
    return response
  }

  // 3. Créer le client Supabase pour le middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      }
    }
  )

  // 4. Récupérer la session
  const { data: { user } } = await supabase.auth.getUser()

  // Extraire la locale et le chemin sans locale
  const locale = pathname.match(/^\/(fr|en|de|es|pt)/)?.[1] || 'fr'
  const pathWithoutLocale = pathname.replace(/^\/(fr|en|de|es|pt)/, '') || '/'

  // ========== LOGIQUE POUR LES ROUTES ADMIN ==========
  const isAdminRoute = adminRoutes.some(route =>
    pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')
  )

  if (isAdminRoute) {
    if (!user) {
      // Pas connecté, rediriger vers login admin
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = `/${locale}/adminLogin`
      redirectUrl.searchParams.set('redirect', encodeURIComponent(pathWithoutLocale))
      return NextResponse.redirect(redirectUrl)
    }

    // Vérifier les permissions admin
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('user_type')
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      const isAdmin = userData?.user_type === 'admin'

      if (!isAdmin) {
        // Pas admin, rediriger selon le type d'utilisateur
        const redirectUrl = request.nextUrl.clone()

        if (userData?.user_type === 'escort') {
          redirectUrl.pathname = `/${locale}/manage/chat/threads`
        } else if (userData?.user_type === 'client') {
          redirectUrl.pathname = `/${locale}/profile`
        } else {
          redirectUrl.pathname = `/${locale}`
        }

        redirectUrl.searchParams.set('error', 'unauthorized')
        return NextResponse.redirect(redirectUrl)
      }

      // Admin autorisé, continuer
      return response
    } catch (error) {
      console.error('Admin check error:', error)
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = `/${locale}/adminLogin`
      redirectUrl.searchParams.set('error', 'admin_check_failed')
      return NextResponse.redirect(redirectUrl)
    }
  }

  // ========== LOGIQUE POUR LES ROUTES NORMALES ==========

  // 1. Si l'utilisateur n'est pas connecté
  if (!user) {
    // Fonction pour vérifier si un chemin est public
    const isPublicRoute = (path: string): boolean => {
      // Vérifier les routes dynamiques (comme /ads/[id])
      const isDynamicAdsRoute = /^\/ads\/[^/]+$/.test(path)
      if (isDynamicAdsRoute) {
        return true
      }

      // Les autres routes non-publiques nécessitent une authentification
      return false
    }

    // Si la route n'est pas publique, rediriger vers login
    if (!isPublicRoute(pathWithoutLocale)) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = `/${locale}/login`
      redirectUrl.searchParams.set('redirect', encodeURIComponent(pathWithoutLocale))
      return NextResponse.redirect(redirectUrl)
    }

    // Si la route est publique, continuer
    return response
  }

  // 2. L'utilisateur est connecté - récupérer le type d'utilisateur
  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('user_type')
      .eq('user_id',user.id)
      .single()

    if (error) throw error

    const userType = userData?.user_type

    // Routes protégées avec leurs types d'utilisateurs requis
    const protectedRoutes: Record<string, string | string[]> = {
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
      '/profile/favorites': 'client',
      '/reviews': 'client',
      '/profile/chat/threads': 'client',
      '/settings': 'client',

      // Routes accessibles aux deux types
      '/dashboard': ['client', 'escort'],
      '/account': ['client', 'escort'],
      '/notifications': ['client', 'escort'],
    }

    // 3. Vérifier les routes protégées
    for (const [route, allowedTypes] of Object.entries(protectedRoutes)) {
      // Vérifier si le chemin correspond à cette route
      if (pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')) {
        // Si allowedTypes est un tableau, vérifier l'appartenance
        if (Array.isArray(allowedTypes)) {
          if (!allowedTypes.includes(userType)) {
            return handleUnauthorizedAccess(request, userType, locale)
          }
        }
        // Si allowedTypes est une chaîne, vérifier l'égalité
        else if (allowedTypes !== userType) {
          return handleUnauthorizedAccess(request, userType, locale)
        }
      }
    }

    // 4. Rediriger les utilisateurs connectés qui essaient d'accéder aux routes d'authentification
    const authRoutes = ['/login', '/register', '/forgot-password']
    if (authRoutes.includes(pathWithoutLocale) && userType !== 'admin') {
      return redirectAuthenticatedUser(request, userType, locale)
    }

    // 5. La route racine reste accessible à tous
    return response

  } catch (error) {
    console.error('User type check error:', error)
    // En cas d'erreur, déconnecter l'utilisateur
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = `/${locale}/login`
    redirectUrl.searchParams.set('error', 'session_invalid')
    return NextResponse.redirect(redirectUrl)
  }
}

// Fonction pour gérer l'accès non autorisé
function handleUnauthorizedAccess(request: NextRequest, userType: string, locale: string) {
  const redirectUrl = request.nextUrl.clone()

  if (userType === 'admin') {
    redirectUrl.pathname = `/${locale}/admin/dashboard`
  } else if (userType === 'escort') {
    redirectUrl.pathname = `/${locale}/manage/chat/threads`
  } else if (userType === 'client') {
    redirectUrl.pathname = `/${locale}/profile`
  } else {
    // Type inconnu, rediriger vers la page d'accueil
    redirectUrl.pathname = `/${locale}`
  }

  redirectUrl.searchParams.set('error', 'unauthorized')
  return NextResponse.redirect(redirectUrl)
}

// Fonction pour rediriger les utilisateurs authentifiés
function redirectAuthenticatedUser(request: NextRequest, userType: string, locale: string) {
  const redirectUrl = request.nextUrl.clone()

  if (userType === 'admin') {
    redirectUrl.pathname = `/${locale}/admin/dashboard`
  } else if (userType === 'escort') {
    redirectUrl.pathname = `/${locale}/manage/chat/threads`
  } else if (userType === 'client') {
    redirectUrl.pathname = `/${locale}/profile`
  } else {
    redirectUrl.pathname = `/${locale}`
  }

  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|public).*)',
  ],
}