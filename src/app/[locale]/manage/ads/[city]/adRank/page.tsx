"use client"

import React, { useState, useEffect } from 'react'
import { 
  Crown, 
  TrendingUp, 
  Star, 
  BarChart, 
  Trophy,
  MapPin,
  Clock,
  ArrowUp,
  Eye,
  Filter,
  Search,
  ChevronUp,
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle,
  Edit,
  Plus,
  RefreshCw
} from 'lucide-react'
import { useUser } from '@/app/[locale]/context/userContext'
import { createClient } from '@/lib/supabase/client'
import { PreviewAdData } from '@/types/adsForm'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

interface RankedAd {
  ad: PreviewAdData;
  position: number;
  total: number;
  isBoosted: boolean;
  lastBoosted?: string;
  views?: number;
  score: number;
}

type SortField = 'position' | 'created_at' | 'boost_time' | 'views' | 'score'
type SortDirection = 'asc' | 'desc'

export default function CityRankingPage() {
  const { user } = useUser()
  const router = useRouter()
  const params = useParams()
  
  // États initiaux vides pour le rendu serveur
  const [loading, setLoading] = useState(true)
  const [rankedAds, setRankedAds] = useState<RankedAd[]>([])
  const [filteredAds, setFilteredAds] = useState<RankedAd[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('position')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [cityName, setCityName] = useState<string>('')
  const [cityParam, setCityParam] = useState<string>('')
  const [stats, setStats] = useState({
    totalAds: 0,
    boostedAds: 0,
    averagePosition: 0,
    myPosition: 0,
    myTotalBoosts: 0
  })
  const [selectedAd, setSelectedAd] = useState<string | null>(null)

  // Extraire le paramètre city côté client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const city = params.city as string
      setCityParam(city)
      
      // Formater le nom de la ville pour l'affichage
      const formattedCity = formatCityName(city)
      setCityName(formattedCity)
    }
  }, [params])

  // Formater le nom de la ville pour l'affichage
  const formatCityName = (city: string): string => {
    if (!city) return 'Ville inconnue'
    return city
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Normaliser le nom de la ville pour les comparaisons
  const normalizeCityName = (city: string): string => {
    return city.toLowerCase().trim()
  }

  // Récupérer toutes les annonces approuvées pour une ville
  const fetchApprovedAdsForCity = async (city: string): Promise<PreviewAdData[]> => {
    try {
      const supabase = createClient()
      const normalizedCity = normalizeCityName(city)
      
      // Récupérer toutes les annonces approuvées
      const { data, error } = await supabase
        .from('pending_ads')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      // Filtrer pour la ville spécifique
      const filtered = (data || []).filter((ad: PreviewAdData) => {
        if (!ad || !ad.location?.city) return false
        
        const adCity = ad.location.city
        
        // Si c'est un tableau de villes
        if (Array.isArray(adCity)) {
          return adCity.some((c: string) => 
            normalizeCityName(c) === normalizedCity
          )
        }
        
        // Si c'est une string unique
        return normalizeCityName(adCity) === normalizedCity
      })

      console.log(`Annonces trouvées pour ${city}:`, filtered.length)
      return filtered
    } catch (error) {
      console.error('Error fetching ads:', error)
      return []
    }
  }

  // Calculer le score d'une annonce
  const calculateAdScore = (ad: PreviewAdData): number => {
    let score = 0
    const normalizedCity = normalizeCityName(cityParam)
    
    // Points pour le boost récent
    const boostTime = ad.city_boosted_at?.[normalizedCity]
    if (boostTime) {
      const boostDate = new Date(boostTime)
      const now = new Date()
      const hoursSinceBoost = (now.getTime() - boostDate.getTime()) / (1000 * 60 * 60)
      
      if (hoursSinceBoost < 1) score += 100
      else if (hoursSinceBoost < 24) score += 80
      else if (hoursSinceBoost < 72) score += 50
      else if (hoursSinceBoost < 168) score += 20
    }
    
    // Points pour l'ancienneté (les plus récentes ont un avantage)
    const createdDate = new Date(ad.created_at)
    const now = new Date()
    const daysSinceCreation = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    
    if (daysSinceCreation < 1) score += 50
    else if (daysSinceCreation < 7) score += 30
    else if (daysSinceCreation < 30) score += 15
    
    // Points bonus si l'annonce a une image
    if (ad.images && ad.images.length > 0) score += 10
    
    // Points bonus si l'annonce a une description complète
    if (ad.description && ad.description.length > 100) score += 5
    
    return Math.round(score)
  }

  // Calculer le classement pour la ville
  const calculateRankings = async () => {
    if (!cityParam) return
    
    setLoading(true)
    
    try {
      const ads = await fetchApprovedAdsForCity(cityParam)
      
      if (ads.length === 0) {
        setRankedAds([])
        setFilteredAds([])
        setStats({
          totalAds: 0,
          boostedAds: 0,
          averagePosition: 0,
          myPosition: 0,
          myTotalBoosts: 0
        })
        return
      }
      
      // Calculer le score pour chaque annonce
      const adsWithScores = ads.map(ad => ({
        ad,
        score: calculateAdScore(ad)
      }))
      
      // Trier par score (décroissant)
      const sortedAds = [...adsWithScores].sort((a, b) => b.score - a.score)
      
      // Ajouter les positions et autres infos
      const rankings: RankedAd[] = []
      let boostedCount = 0
      let userAdPosition = 0
      let userBoostCount = 0
      const normalizedCity = normalizeCityName(cityParam)
      
      sortedAds.forEach((item, index) => {
        const position = index + 1
        const isBoosted = !!item.ad.city_boosted_at?.[normalizedCity]
        
        if (isBoosted) boostedCount++
        
        // Vérifier si c'est une annonce de l'utilisateur connecté
        if (user && item.ad.escort_id === user.user_id) {
          userAdPosition = position
          if (isBoosted) userBoostCount++
        }
        
        rankings.push({
          ad: item.ad,
          position,
          total: sortedAds.length,
          isBoosted,
          lastBoosted: item.ad.city_boosted_at?.[normalizedCity],
          score: item.score,
          views: Math.floor(Math.random() * 1000) + 100 // Données simulées
        })
      })
      
      // Calculer la position moyenne
      const averagePosition = rankings.length > 0 ? 
        Math.round(rankings.reduce((sum, r) => sum + r.position, 0) / rankings.length) : 0
      
      setRankedAds(rankings)
      setFilteredAds(rankings)
      setStats({
        totalAds: rankings.length,
        boostedAds: boostedCount,
        averagePosition,
        myPosition: userAdPosition,
        myTotalBoosts: userBoostCount
      })
      
    } catch (error) {
      console.error('Error calculating rankings:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrer et trier les annonces
  useEffect(() => {
    if (rankedAds.length === 0) return
    
    let result = [...rankedAds]
    
    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(rankedAd => 
        rankedAd.ad.title?.toLowerCase().includes(query) ||
        rankedAd.ad.description?.toLowerCase().includes(query)
      )
    }
    
    // Trier
    result.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortField) {
        case 'position':
          aValue = a.position
          bValue = b.position
          break
        case 'created_at':
          aValue = new Date(a.ad.created_at).getTime()
          bValue = new Date(b.ad.created_at).getTime()
          break
        case 'boost_time':
          aValue = a.lastBoosted ? new Date(a.lastBoosted).getTime() : 0
          bValue = b.lastBoosted ? new Date(b.lastBoosted).getTime() : 0
          break
        case 'views':
          aValue = a.views || 0
          bValue = b.views || 0
          break
        case 'score':
          aValue = a.score
          bValue = b.score
          break
        default:
          return 0
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
    setFilteredAds(result)
  }, [rankedAds, searchQuery, sortField, sortDirection])

  // Initialisation - charger les données côté client uniquement
  useEffect(() => {
    if (cityParam) {
      calculateRankings()
    }
  }, [cityParam])

  // Gérer le tri
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Formater la date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Date invalide'
    }
  }

  // Obtenir la couleur en fonction de la position
  const getPositionColor = (position: number) => {
    if (position === 1) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    if (position === 2) return 'text-gray-600 bg-gray-50 border-gray-200'
    if (position === 3) return 'text-amber-800 bg-amber-50 border-amber-200'
    if (position <= 10) return 'text-blue-600 bg-blue-50 border-blue-200'
    return 'text-gray-500 bg-gray-50 border-gray-200'
  }

  // Obtenir l'icône en fonction de la position
  const getPositionIcon = (position: number) => {
    if (position === 1) return <Crown className="w-5 h-5" />
    if (position <= 3) return <Trophy className="w-5 h-5" />
    if (position <= 10) return <Star className="w-5 h-5" />
    return <BarChart className="w-5 h-5" />
  }

  // Vérifier si une annonce appartient à l'utilisateur connecté
  const isUserAd = (ad: PreviewAdData) => {
    return user && ad.escort_id === user.user_id
  }

  // Rendu conditionnel pour le chargement initial
  if (!cityParam && typeof window !== 'undefined') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Chargement de la ville...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-8 h-8 text-white" />
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {cityName ? `Classement à ${cityName}` : 'Chargement...'}
                </h1>
              </div>
              <p className="text-white/90 text-lg">
                Toutes les annonces classées par performance dans cette ville
              </p>
            </div>
            <div className="flex items-center gap-4">
              {user && cityParam && (
                <Link
                  href={`/manage/ads/${cityParam}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition font-medium backdrop-blur-sm"
                >
                  <Eye className="w-5 h-5" />
                  Mes annonces
                </Link>
              )}
              {cityParam && (
                <Link
                  href={`/manage/ads/form?city=${cityParam}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Nouvelle Annonce
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalAds}</div>
                <div className="text-sm text-gray-500">Annonces totales</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.boostedAds}</div>
                <div className="text-sm text-gray-500">Annonces boostées</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.averagePosition}</div>
                <div className="text-sm text-gray-500">Position moyenne</div>
              </div>
            </div>
          </div>
          
          {user && stats.myPosition > 0 && (
            <>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Crown className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">#{stats.myPosition}</div>
                    <div className="text-sm text-gray-500">Votre position</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <ArrowUp className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.myTotalBoosts}</div>
                    <div className="text-sm text-gray-500">Vos boosts</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une annonce..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Bouton actualiser */}
            <button
              onClick={calculateRankings}
              disabled={loading || !cityParam}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              Actualiser
            </button>
          </div>
          
          {/* Info ville */}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Ville : <span className="font-medium">{cityName || 'Chargement...'}</span></span>
            <span className="mx-2">•</span>
            <span>Affichage de {filteredAds.length} annonces</span>
          </div>
        </div>

        {/* Tableau des classements */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* En-têtes du tableau */}
          <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-200 bg-gray-50">
            <div className="col-span-1 font-medium text-gray-700 text-sm">
              <button
                onClick={() => handleSort('position')}
                className="flex items-center gap-1 hover:text-blue-600"
                disabled={filteredAds.length === 0}
              >
                Position
                {sortField === 'position' && (
                  sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="col-span-4 font-medium text-gray-700 text-sm">
              Annonce
            </div>
            <div className="col-span-2 font-medium text-gray-700 text-sm">
              <button
                onClick={() => handleSort('score')}
                className="flex items-center gap-1 hover:text-blue-600"
                disabled={filteredAds.length === 0}
              >
                Score
                {sortField === 'score' && (
                  sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="col-span-2 font-medium text-gray-700 text-sm">
              <button
                onClick={() => handleSort('boost_time')}
                className="flex items-center gap-1 hover:text-blue-600"
                disabled={filteredAds.length === 0}
              >
                Dernier boost
                {sortField === 'boost_time' && (
                  sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="col-span-3 font-medium text-gray-700 text-sm text-right">
              Actions
            </div>
          </div>

          {/* Contenu du tableau */}
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Chargement du classement...</p>
            </div>
          ) : filteredAds.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune annonce trouvée</h3>
              <p className="text-gray-600 mb-6">
                {cityName ? 
                  `Il n'y a pas encore d'annonces dans ${cityName}.` 
                  : 'Ville non spécifiée.'}
              </p>
              {cityParam && (
                <Link
                  href={`/manage/ads/form?city=${cityParam}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition"
                >
                  <Plus className="w-5 h-5" />
                  Créer la première annonce
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAds.map((rankedAd) => (
                <div 
                  key={`${rankedAd.ad.pending_ad_id}`}
                  className={`grid grid-cols-12 gap-4 p-6 transition-colors ${
                    isUserAd(rankedAd.ad) 
                      ? 'bg-blue-50 hover:bg-blue-100' 
                      : 'hover:bg-gray-50'
                  }`}
                  onMouseEnter={() => setSelectedAd(rankedAd.ad.pending_ad_id)}
                  onMouseLeave={() => setSelectedAd(null)}
                >
                  {/* Position */}
                  <div className="col-span-1 flex items-center">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getPositionColor(rankedAd.position)}`}>
                      {getPositionIcon(rankedAd.position)}
                      <span className="font-bold">#{rankedAd.position}</span>
                    </div>
                  </div>
                  
                  {/* Annonce */}
                  <div className="col-span-4">
                    <div className="flex items-start gap-3">
                      {isUserAd(rankedAd.ad) && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          Votre annonce
                        </span>
                      )}
                      <div>
                        <div className="font-medium text-gray-900 mb-1">
                          {rankedAd.ad.title || 'Sans titre'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {formatDate(rankedAd.ad.created_at)}
                          {rankedAd.views && (
                            <>
                              <span className="mx-1">•</span>
                              <span>{rankedAd.views} vues</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Score */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (rankedAd.score / 150) * 100)}%` }}
                        />
                      </div>
                      <span className="font-medium text-gray-900 min-w-[40px]">{rankedAd.score}</span>
                    </div>
                  </div>
                  
                  {/* Dernier boost */}
                  <div className="col-span-2">
                    {rankedAd.lastBoosted ? (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="font-medium text-green-700">Boostée</div>
                          <div className="text-sm text-gray-500">{formatDate(rankedAd.lastBoosted)}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400">Non boostée</div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="col-span-3 flex items-center justify-end gap-2">
                    <Link
                      href={`/manage/ads/${cityParam}/${rankedAd.ad.pending_ad_id}`}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Voir les détails"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    
                    {rankedAd.isBoosted ? (
                      <div className="p-2 text-amber-600 bg-amber-50 rounded-lg" title="Déjà boostée">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    ) : (
                      <Link
                        href={`/manage/ads/${cityParam}/${rankedAd.ad.pending_ad_id}`}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                        title="Booster cette annonce"
                      >
                        <ArrowUp className="w-5 h-5" />
                      </Link>
                    )}
                    
                    {isUserAd(rankedAd.ad) && (
                      <Link
                        href={`/manage/ads/${cityParam}/${rankedAd.ad.pending_ad_id}/update`}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Modifier"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Légende */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Comment fonctionne le classement ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Système de score</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span><strong>Boost récent</strong> : Jusqu'à 100 points</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span><strong>Annonce récente</strong> : Jusqu'à 50 points</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span><strong>Avec photos</strong> : +10 points</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span><strong>Description complète</strong> : +5 points</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Positionnement</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-center">
                    <Crown className="w-4 h-4 text-yellow-600" />
                  </div>
                  <span><strong>1ère place</strong> : Meilleure visibilité</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-gray-600" />
                  </div>
                  <span><strong>Top 3</strong> : Très bonne position</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-blue-600" />
                  </div>
                  <span><strong>Top 10</strong> : Bonne visibilité</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <span><strong>Boostée</strong> : Priorité temporaire</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <ArrowUp className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Comment améliorer votre position ?</h4>
                <p className="text-blue-800 text-sm">
                  Utilisez le système de boost pour remonter temporairement en tête du classement.
                  Les annonces boostées récemment sont prioritaires dans l'algorithme de classement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}