'use client'

import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { SupabaseClient } from '@supabase/supabase-js'
import { Favorite, ProfileData } from '@/types/profile'
import { createClient } from '@/lib/supabase/client'
import { PreviewAdData } from '@/types/adsForm'

type UserContextType = {
  user: ProfileData | null
  isLoading: boolean
  supabase: SupabaseClient
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
  pendingAds: PreviewAdData[]
  favoriteEscorts: Favorite[]
  fetchPendingAds: () => Promise<void>
  fetchFavoriteEscorts: () => Promise<void>
  getAdById: (adId: string) => PreviewAdData | undefined
  getAdsByCity: (city: string) => PreviewAdData[]
  refreshAds: () => Promise<void>
  isFavorite: (adId: string) => boolean
  toggleFavorite: (adId: string, escortId?: string) => Promise<void>
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  supabase: createClient(),
  refreshUser: async () => {},
  logout: async () => {},
  pendingAds: [],
  favoriteEscorts: [],
  fetchPendingAds: async () => {},
  fetchFavoriteEscorts: async () => {},
  getAdById: () => undefined,
  getAdsByCity: () => [],
  refreshAds: async () => {},
  isFavorite: () => false,
  toggleFavorite: async () => {}
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingAds, setPendingAds] = useState<PreviewAdData[]>([])
  const [favoriteEscorts, setFavoriteEscorts] = useState<Favorite[]>([])
  const router = useRouter()
  const pathname = usePathname()

  const supabase = useMemo(() => createClient(), [])

  // Normalisation des données
  const normalizeToArray = <T,>(data: any): T[] => {
    if (!data) return []
    if (Array.isArray(data)) return data as T[]
    if (typeof data === 'object') return [data] as T[]
    return []
  }

  // Fonction pour vérifier si une annonce est en favoris
  const isFavorite = (adId: string): boolean => {
    if (!user || !adId) return false
    return favoriteEscorts.some(fav => 
      fav.ad_id === adId && fav.client_id === user.user_id
    )
  }

  // Fonction pour ajouter/retirer des favoris
  const toggleFavorite = async (adId: string, escortId?: string) => {
    if (!user) {
      console.warn('User not authenticated')
      return
    }

    try {
      const existingFavorite = favoriteEscorts.find(
        fav => fav.ad_id === adId && fav.client_id === user.user_id
      )

      if (existingFavorite) {
        // Supprimer des favoris
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existingFavorite.id)

        if (error) throw error

        // Mettre à jour localement
        setFavoriteEscorts(prev => 
          prev.filter(fav => fav.id !== existingFavorite.id)
        )
      } else {
        // Ajouter aux favoris
        const { data, error } = await supabase
          .from('favorites')
          .insert({
            client_id: user.user_id,
            ad_id: adId,
            escort_id: escortId || null
          })
          .select()
          .single()

        if (error) throw error

        // Mettre à jour localement
        if (data) {
          setFavoriteEscorts(prev => [...prev, data])
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      throw error
    }
  }

  // Fonction pour récupérer TOUTES les annonces en attente d'un escort
  const fetchPendingAds = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        console.warn('No user ID provided for fetching ads')
        setPendingAds([])
        return
      }

      const { data, error } = await supabase
        .from('pending_ads')
        .select('*')
        .eq('escort_id', authUser.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur lors de la récupération des annonces:', error)
        setPendingAds([])
        return
      }

      const normalizedData = normalizeToArray<PreviewAdData>(data)
      setPendingAds(normalizedData)
      
    } catch (err) {
      setPendingAds([])
    }
  }

  // Fonction pour récupérer les favoris
  const fetchFavoriteEscorts = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        setFavoriteEscorts([])
        return
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('client_id', authUser.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur lors de la récupération des escorts favoris:', error)
        setFavoriteEscorts([])
        return
      }

      const normalizedData = normalizeToArray<Favorite>(data)
      setFavoriteEscorts(normalizedData)
      
    } catch (err) {
      console.error('Failed to fetch favorite escorts:', err)
      setFavoriteEscorts([])
    }
  }

  // Fonction pour récupérer une annonce spécifique par ID
  const getAdById = (adId: string): PreviewAdData | undefined => {
    if (!adId || pendingAds.length === 0) return undefined
    
    return pendingAds.find(ad => 
      ad.pending_ad_id === adId || 
      String(ad.pending_ad_id) === String(adId)
    )
  }

  // Fonction pour récupérer les annonces par ville
  const getAdsByCity = (city: string): PreviewAdData[] => {
    if (!city || pendingAds.length === 0) return []
    
    const normalizedCity = city.toLowerCase()
    
    return pendingAds.filter(ad => {
      const adCity = ad.location?.city
      if (!adCity) return false
      
      if (Array.isArray(adCity)) {
        return adCity.some(c => 
          c?.toLowerCase().includes(normalizedCity)
        )
      }
      
      if (typeof adCity === 'string') {
        return adCity.toLowerCase().includes(normalizedCity)
      }
      
      return false
    })
  }

  // Rafraîchir les annonces après certaines actions
  const refreshAds = async () => {
    if (user?.user_type === 'escort') {
      await fetchPendingAds()
    }
  }

  // Récupération des données utilisateur
  const fetchUserData = async () => {
    setIsLoading(true)

    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser()

      if (error || !authUser) {
        setUser(null)
        setPendingAds([])
        setFavoriteEscorts([])
        setIsLoading(false)
        return
      }

      // Récupération du profil + solde
      const [profileRes, walletRes] = await Promise.all([
        supabase.from('users').select('*').eq('user_id', authUser.id).single(),
        supabase.from('wallets').select('balance').eq('user_id', authUser.id).single(),
      ])

      if (profileRes.error) {
        console.error('Profile fetch error:', profileRes.error)
        setUser(null)
        setPendingAds([])
        setFavoriteEscorts([])
        setIsLoading(false)
        return
      }

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

      // Récupérer les données selon le type d'utilisateur
      if (userData.user_type === 'escort') {
        await fetchPendingAds()
      } else if (userData.user_type === 'client') {
        await fetchFavoriteEscorts()
      }

    } catch (err) {
      console.error('Failed to fetch user:', err)
      setUser(null)
      setPendingAds([])
      setFavoriteEscorts([])
    } finally {
      setIsLoading(false)
    }
  }

  // Logout
const logout = async () => {
  await supabase.auth.signOut()
  setUser(null)
  setPendingAds([])
  setFavoriteEscorts([])
  router.replace('/login')
  // ❌ PAS DE router.refresh()
}


  // Auth listener
useEffect(() => {
  fetchUserData()

  const { data: { subscription } } =
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setPendingAds([])
        setFavoriteEscorts([])
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await fetchUserData()
      }
    })

  return () => subscription.unsubscribe()
}, []) // ✅ UNE SEULE FOIS


  return (
    <UserContext.Provider value={{
      user,
      isLoading,
      supabase,
      refreshUser: fetchUserData,
      logout,
      pendingAds,
      favoriteEscorts,
      fetchPendingAds,
      fetchFavoriteEscorts,
      getAdById,
      getAdsByCity,
      refreshAds,
      isFavorite,
      toggleFavorite
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)