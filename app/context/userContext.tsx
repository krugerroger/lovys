'use client'

import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { SupabaseClient } from '@supabase/supabase-js'
import { ProfileData } from '@/types/profile'
import { createClient } from '@/lib/supabase/client'
import { AdFormData } from '@/types/adsForm'

type UserContextType = {
  user: ProfileData | null
  isLoading: boolean
  supabase: SupabaseClient
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
  pendingAd: AdFormData | null // Ajout pour stocker l'annonce en attente
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  supabase: createClient(),
  refreshUser: async () => {},
  logout: async () => {},
  pendingAd: null // Valeur par défaut
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingAd, setPendingAd] = useState<AdFormData | null>(null) // État pour l'annonce
  const router = useRouter()
  const pathname = usePathname()

  // ⚠️ IMPORTANT : ne pas recréer supabase à chaque render
  const supabase = useMemo(() => createClient(), [])

  // Fonction pour récupérer l'annonce en attente d'un escort
  const fetchPendingAd = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('pending_ads')
        .select('*')
        .eq('escort_id', userId)
        .maybeSingle() // Utiliser maybeSingle() car il peut ne pas y avoir d'annonce

      if (error) {
        console.error('Erreur lors de la récupération de l\'annonce:', error)
        setPendingAd(null)
        return
      }

      setPendingAd(data)
    } catch (err) {
      console.error('Failed to fetch pending ad:', err)
      setPendingAd(null)
    }
  }

  // ----------- RÉCUPÉRATION DES DONNÉES UTILISATEUR ----------
  const fetchUserData = async () => {
    setIsLoading(true)

    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser()

      if (error || !authUser) {
        setUser(null)
        setPendingAd(null) // Réinitialiser l'annonce si pas d'utilisateur
        return
      }

      // Récupération du profil + solde
      const [profileRes, walletRes] = await Promise.all([
        supabase.from('users').select('*').eq('user_id', authUser.id).single(),
        supabase.from('wallets').select('balance').eq('user_id', authUser.id).single(),
      ])

      const userData = profileRes.data || {}

      const finalUser: ProfileData = {
        ...userData,
        user_id: authUser.id,
        email: authUser.email,
        balance: walletRes.data?.balance ?? 0,
        username: userData.username || authUser.email?.split('@')[0] || 'user',
        display_name: userData.display_name || userData.username || 'User',
        user_type: userData.user_type || 'client'
      }

      setUser(finalUser)

      // Si l'utilisateur est un escort, récupérer son annonce en attente
      if (userData.user_type === 'escort') {
        await fetchPendingAd(authUser.id)
      } else {
        setPendingAd(null) // Réinitialiser si pas un escort
      }

    } catch (err) {
      console.error('Failed to fetch user:', err)
      setUser(null)
      setPendingAd(null)
    } finally {
      setIsLoading(false)
    }
  }

  // --------------------- LOGOUT -----------------------
  const logout = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' })
      setUser(null)
      setPendingAd(null) // Réinitialiser l'annonce
      router.push('/login') // redirection propre
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // --------------------- AUTH LISTENER ---------------------
  useEffect(() => {
    fetchUserData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        console.log("Auth changed:", event)

        if (event === 'SIGNED_OUT') {
          setUser(null)
          setPendingAd(null)
        } else {
          await fetchUserData()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [pathname]) // recharger après navigation à une nouvelle page

  return (
    <UserContext.Provider value={{
      user,
      isLoading,
      supabase,
      refreshUser: fetchUserData,
      logout,
      pendingAd // Ajout de l'annonce dans le contexte
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)