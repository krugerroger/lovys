'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { SupabaseClient } from '@supabase/supabase-js'
import { ProfileData } from '@/types/profile'
import { createClient } from '@/lib/supabase/client'

type UserContextType = {
  user: ProfileData | null
  isLoading: boolean
  supabase: SupabaseClient
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  supabase: createClient(),
  refreshUser: async () => {},
  logout: async () => {}
})

// Routes publiques - mêmes que dans le middleware
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
  '/privacy'
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

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const fetchUserData = async () => {
    setIsLoading(true)
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser()
      
      if (error) {
        throw error
      }

      if (!authUser) {
        // Pas d'utilisateur connecté
        setUser(null)
        
        // Vérifier si la route actuelle est protégée
        if (isProtectedRoute(pathname || '')) {
          // Sauvegarder la route actuelle pour y revenir après login
          router.push(`/login?redirect=${encodeURIComponent(pathname || '/')}`)
        }
        
        return
      }

      // Utilisateur connecté - récupérer les données
      const [profileRes, walletRes] = await Promise.all([
        supabase.from('users').select('*').eq('user_id', authUser.id).single(),
        supabase.from('wallets').select('balance').eq('user_id', authUser.id).single(),
      ])

      const userData = profileRes.data || {}

      // Construction de l'objet utilisateur
      const combinedUser: ProfileData = {
        ...userData,
        balance: walletRes.data?.balance,
        user_id: authUser.id,
        email: authUser.email,
        // Assurer que les champs obligatoires existent
        username: userData.username || authUser.email?.split('@')[0] || 'user',
        display_name: userData.display_name || authUser.email?.split('@')[0] || 'User',
        user_type: userData.user_type || 'client'
      }

      setUser(combinedUser)

      // Vérifier si l'utilisateur a accès à la route actuelle
      if (pathname && !hasAccessToRoute(pathname, combinedUser.user_type)) {
        // Rediriger vers la page appropriée selon le type d'utilisateur
        if (combinedUser.user_type === 'escort') {
          router.push('/manage/chat/threads')
        } else {
          router.push('/profile')
        }
      }

      // Si on est sur une page d'authentification alors qu'on est connecté, rediriger
      const authRoutes = ['/login', '/register', '/forgot-password']
      if (pathname && authRoutes.includes(pathname)) {
        // Vérifier s'il y a une redirection dans l'URL
        const searchParams = new URLSearchParams(window.location.search)
        const redirect = searchParams.get('redirect')
        
        if (redirect) {
          router.push(redirect)
        } else {
          // Rediriger vers la page par défaut selon le type d'utilisateur
          if (combinedUser.user_type === 'escort') {
            router.push('/manage/chat/threads')
          } else {
            router.push('/profile')
          }
        }
      }

    } catch (error) {
      console.error('Failed to fetch user:', error)
      setUser(null)
      
      // Seulement rediriger si on est sur une route protégée
      if (pathname && isProtectedRoute(pathname)) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
      }
      
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  // Fonction pour vérifier si une route est protégée
  const isProtectedRoute = (path: string): boolean => {
    // La route "/" est toujours accessible
    if (path === '/') return false
    
    // Vérifier les routes publiques
    const isPublic = publicRoutes.some(route => {
      if (route === path) return true
      if (route.includes('[') && route.includes(']')) {
        const pattern = route.replace(/\[.*?\]/g, '([^/]+)')
        const regex = new RegExp(`^${pattern}$`)
        if (regex.test(path)) return true
      }
      return route !== '/' && path.startsWith(route + '/')
    })
    
    if (isPublic) return false
    
    // Si ce n'est pas public, c'est protégé
    return true
  }

  // Fonction pour vérifier si l'utilisateur a accès à une route
  const hasAccessToRoute = (path: string, userType: string): boolean => {
    // La route "/" est accessible à tous
    if (path === '/') return true
    
    // Vérifier les routes publiques
    const isPublic = publicRoutes.some(route => {
      if (route === path) return true
      if (route.includes('[') && route.includes(']')) {
        const pattern = route.replace(/\[.*?\]/g, '([^/]+)')
        const regex = new RegExp(`^${pattern}$`)
        if (regex.test(path)) return true
      }
      return route !== '/' && path.startsWith(route + '/')
    })
    
    if (isPublic) return true
    
    // Vérifier les routes protégées
    for (const [route, allowedTypes] of Object.entries(protectedRoutes)) {
      if (path === route || path.startsWith(route + '/')) {
        if (Array.isArray(allowedTypes)) {
          return allowedTypes.includes(userType)
        }
        return allowedTypes === userType
      }
    }
    
    // Si la route n'est ni publique ni protégée, elle est considérée comme publique
    return true
  }

  useEffect(() => {
    fetchUserData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event)
      
      if (event === 'SIGNED_OUT') {
        setUser(null)
        
        // Si on est sur une route protégée, rediriger vers login
        if (pathname && isProtectedRoute(pathname)) {
          router.push('/login')
        }
        
      } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        // Rafraîchir les données utilisateur
        await fetchUserData()
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [router, supabase, pathname])

  return (
    <UserContext.Provider value={{ 
      user, 
      isLoading, 
      supabase,
      refreshUser: fetchUserData,
      logout
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)