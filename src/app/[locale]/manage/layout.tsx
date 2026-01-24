// /manage/layout.tsx
'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { useUser } from '../context/userContext'

interface ManageLayoutProps {
  children: React.ReactNode
}

export default function ManageLayout({ children }: ManageLayoutProps) {
  const { user, isLoading } = useUser();
  const router = useRouter()
  const pathname = usePathname()
const [isChecking, setIsChecking] = useState<boolean | null>(null)


useEffect(() => {
  if (isChecking !== null) return

  if (!isLoading) {
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    if (user.user_type !== 'escort') {
      router.replace('/')
      return
    }

    setIsChecking(false)
  }
}, [user, isLoading])


  // Écran de chargement pendant la vérification
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Vérification en cours</h3>
          <p className="text-sm text-gray-600">
            {isLoading ? 'Chargement de votre profil...' : 'Vérification de vos autorisations...'}
          </p>
        </div>
      </div>
    )
  }

  // Si pas d'utilisateur après vérification (redirection en cours)
  if (!user) {
    return null
  }

  // Si utilisateur n'est pas escort (redirection en cours)
  if (user.user_type !== 'escort') {
    return null
  }

  // Tout est OK, afficher le layout
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Sidebar>
        <div className="h-full p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </Sidebar>
    </div>
  )
}