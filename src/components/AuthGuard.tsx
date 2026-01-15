// components/AuthGuard.tsx
'use client'

import { useEffect } from 'react'
import { useUser } from '@/app/[locale]/context/userContext'
import { useRouter, usePathname } from 'next/navigation'

// Routes publiques
const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/ads', '/search', '/about', '/contact']

export default function AuthGuard({ 
  children, 
  allowedUserTypes = ['client', 'escort'] 
}: { 
  children: React.ReactNode
  allowedUserTypes?: string[] 
}) {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && user) {
      // Vérifier si l'utilisateur a le bon type pour cette route
      if (!allowedUserTypes.includes(user.user_type || 'client')) {
        // Rediriger vers la page appropriée
        if (user.user_type === 'escort') {
          router.push('/manage/chat/threads')
        } else if (user.user_type === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/profile')
        }
      }
    }
    
    if (!isLoading && !user) {
      // Vérifier si la route est publique
      const isPublicRoute = publicRoutes.some(route => 
        route === pathname || 
        (pathname?.startsWith('/ads/') && route === '/ads') ||
        (pathname?.startsWith('/search') && route === '/search')
      )
      
      if (!isPublicRoute) {
        // Sauvegarder la route actuelle
        const currentPath = window.location.pathname + window.location.search
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
      }
    }
  }, [user, isLoading, pathname, router, allowedUserTypes])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!user) {
    // Vérifier si la route est publique
    const isPublicRoute = publicRoutes.some(route => 
      route === pathname || 
      (pathname?.startsWith('/ads/') && route === '/ads') ||
      (pathname?.startsWith('/search') && route === '/search')
    )
    
    if (!isPublicRoute) {
      return null // Redirection en cours
    }
  }

  if (user && !allowedUserTypes.includes(user.user_type || 'client')) {
    return null // Redirection en cours
  }

  return <>{children}</>
}