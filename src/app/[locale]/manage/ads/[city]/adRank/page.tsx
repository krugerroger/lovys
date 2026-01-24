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
  Search,
  ChevronUp,
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle,
  Edit,
  Plus,
  RefreshCw,
  Calendar,
  Image as ImageIcon,
  Heart
} from 'lucide-react'
import { useUser } from '@/app/[locale]/context/userContext'
import { createClient } from '@/lib/supabase/client'
import { PreviewAdData } from '@/types/adsForm'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { useScopedI18n } from '../../../../../../../locales/client'

interface RankedAd {
  ad: PreviewAdData;
  position: number;
  total: number;
  isBoosted: boolean;
  lastBoosted?: string;
  boostTime?: number;
  createdTime: number;
  score?: number;
}

type SortField = 'position' | 'created_at' | 'boost_time'
type SortDirection = 'asc' | 'desc'

export default function CityRankingPage() {
  const { user } = useUser()
  const router = useRouter()
  const params = useParams()
  const t = useScopedI18n('CityRankingPage' as never) as (key: string, vars?: Record<string, any>) => string;
  
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const city = params.city as string
      setCityParam(city)
      setCityName(formatCityName(city))
    }
  }, [params])

  const formatCityName = (city: string): string => {
    if (!city) return t('loadingCity')
    return city
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const normalizeCityName = (city: string): string => {
    return city.toLowerCase().trim()
  }

  const fetchApprovedAdsForCity = async (city: string): Promise<PreviewAdData[]> => {
    try {
      const supabase = createClient()
      const normalizedCity = normalizeCityName(city)
      
      const { data, error } = await supabase
        .from('pending_ads')
        .select('*')
        .eq('status', 'approved')

      if (error) throw error

      const filtered = (data || []).filter((ad: PreviewAdData) => {
        if (!ad || !ad.location?.city) return false
        const adCity = ad.location.city
        
        if (Array.isArray(adCity)) {
          return adCity.some((c: string) => 
            String(c).toLowerCase().includes(normalizedCity)
          )
        }
        
        if (typeof adCity === 'string') {
          return adCity.toLowerCase().includes(normalizedCity)
        }
        
        return false
      })

      return filtered
    } catch (error) {
      console.error('Error fetching ads:', error)
      return []
    }
  }

  const calculateSortedAds = (ads: PreviewAdData[]): PreviewAdData[] => {
    if (ads.length === 0) return []
    
    const normalizedCity = cityParam.toLowerCase()
    
    return [...ads].sort((a, b) => {
      // Pour l'annonce A : prendre la date la plus récente
      const aBoostedAt = a.city_boosted_at?.[normalizedCity];
      const aCreatedAt = new Date(a.created_at).getTime();
      const aBoostedAtTime = aBoostedAt ? new Date(aBoostedAt).getTime() : 0;
      const aLatestDate = Math.max(aCreatedAt, aBoostedAtTime);
      
      // Pour l'annonce B : prendre la date la plus récente
      const bBoostedAt = b.city_boosted_at?.[normalizedCity];
      const bCreatedAt = new Date(b.created_at).getTime();
      const bBoostedAtTime = bBoostedAt ? new Date(bBoostedAt).getTime() : 0;
      const bLatestDate = Math.max(bCreatedAt, bBoostedAtTime);
      
      // Trier par date la plus récente d'abord
      return bLatestDate - aLatestDate;
    })
  }

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
      
      const sortedAds = calculateSortedAds(ads)
      const normalizedCity = normalizeCityName(cityParam)
      
      const rankings: RankedAd[] = []
      let boostedCount = 0
      let userAdPosition = 0
      let userBoostCount = 0
      
      sortedAds.forEach((ad, index) => {
        const position = index + 1
        const isBoosted = !!ad.city_boosted_at?.[normalizedCity]
        const lastBoosted = ad.city_boosted_at?.[normalizedCity]
        const boostTime = lastBoosted ? new Date(lastBoosted).getTime() : undefined
        const createdTime = new Date(ad.created_at).getTime()
        
        if (isBoosted) boostedCount++
        
        if (user && ad.escort_id === user.user_id) {
          userAdPosition = position
          if (isBoosted) userBoostCount++
        }
        
        rankings.push({
          ad,
          position,
          total: sortedAds.length,
          isBoosted,
          lastBoosted,
          boostTime,
          createdTime
        })
      })
      
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

  useEffect(() => {
    if (rankedAds.length === 0) return
    
    let result = [...rankedAds]
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(rankedAd => 
        rankedAd.ad.title?.toLowerCase().includes(query) ||
        rankedAd.ad.description?.toLowerCase().includes(query)
      )
    }
    
    result.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortField) {
        case 'position':
          aValue = a.position
          bValue = b.position
          break
        case 'created_at':
          aValue = a.createdTime
          bValue = b.createdTime
          break
        case 'boost_time':
          aValue = a.boostTime || 0
          bValue = b.boostTime || 0
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

  useEffect(() => {
    if (cityParam) {
      calculateRankings()
    }
  }, [cityParam])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch {
      return t('adCard.createdOn', { date: 'date invalide' })
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      
      if (diffHours < 1) return 'À l\'instant'
      if (diffHours === 1) return 'Il y a 1 heure'
      if (diffHours < 24) return `Il y a ${diffHours}h`
      return `Il y a ${Math.floor(diffHours / 24)}j`
    } catch {
      return 'Date invalide'
    }
  }

  const getPositionColor = (position: number) => {
    if (position === 1) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    if (position === 2) return 'text-gray-600 bg-gray-50 border-gray-200'
    if (position === 3) return 'text-amber-800 bg-amber-50 border-amber-200'
    if (position <= 10) return 'text-blue-600 bg-blue-50 border-blue-200'
    return 'text-gray-500 bg-gray-50 border-gray-200'
  }

  const getPositionIcon = (position: number) => {
    if (position === 1) return <Crown className="w-5 h-5" />
    if (position <= 3) return <Trophy className="w-5 h-5" />
    if (position <= 10) return <Star className="w-5 h-5" />
    return <BarChart className="w-5 h-5" />
  }

  const isUserAd = (ad: PreviewAdData) => {
    return user && ad.escort_id === user.user_id
  }

  const getFirstImage = (ad: PreviewAdData) => {
    if (ad.images && ad.images.length > 0 && ad.images[0]) {
      return ad.images[0]
    }
    return null
  }

  if (!cityParam && typeof window !== 'undefined') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">{t('loadingCity')}</p>
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
                  {cityName ? <>{t('header.title')} {cityName}</> : t('loadingCity')}
                </h1>
              </div>
              <p className="text-white/90 text-lg">
                {t('header.description')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {user && cityParam && (
                <Link
                  href={`/manage/ads/${cityParam}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition font-medium backdrop-blur-sm"
                >
                  <Eye className="w-5 h-5" />
                  {t('header.myAdsButton')}
                </Link>
              )}
              {cityParam && (
                <Link
                  href={`/manage/ads/form?city=${cityParam}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  <Plus className="w-5 h-5" />
                  {t('header.newAdButton')}
                </Link>
              )}
            </div>
          </div>
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
                  placeholder={t('filters.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Trier par */}
            <div className="w-full md:w-64">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{t('filters.sortBy')}</span>
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as SortField)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="position">{t('filters.sortOptions.position')}</option>
                  <option value="created_at">{t('filters.sortOptions.created_at')}</option>
                  <option value="boost_time">{t('filters.sortOptions.boost_time')}</option>
                </select>
                <button
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
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
              {t('filters.refreshButton')}
            </button>
          </div>
          
          {/* Info ville */}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{t('filters.cityInfo')} {cityName || t('loadingCity')}</span>
            <span className="mx-2">•</span>
            <span>{t('filters.displayingAds')} {filteredAds.length }</span>
          </div>
        </div>

        {/* Légende de l'algorithme */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-3">{t('algorithmLegend.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
                <span className="text-blue-700 font-bold">1</span>
              </div>
              <span>{t('algorithmLegend.boostedAds')}</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
                <span className="text-blue-700 font-bold">2</span>
              </div>
              <span>{t('algorithmLegend.recentBoost')}</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
                <span className="text-blue-700 font-bold">3</span>
              </div>
              <span>{t('algorithmLegend.noBoost')}</span>
            </div>
          </div>
        </div>

        {/* Annonces en format miniature */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl shadow-sm border border-gray-200">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">{t('loadingRankings')}</p>
          </div>
        ) : filteredAds.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl shadow-sm border border-gray-200">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('emptyState.title')}</h3>
            <p className="text-gray-600 mb-6">
              {cityName ? 
                <>{t('emptyState.description')} {cityName}</>
                : t('loadingCity')}
            </p>
            {cityParam && (
              <Link
                href={`/manage/ads/form?city=${cityParam}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition"
              >
                <Plus className="w-5 h-5" />
                {t('emptyState.createFirstAdButton')}
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAds.map((rankedAd) => {
              const image = getFirstImage(rankedAd.ad)
              const isUser = isUserAd(rankedAd.ad)
              
              return (
                <div 
                  key={`${rankedAd.ad.pending_ad_id}`}
                  className={`bg-white rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md ${
                    isUser ? 'border-blue-300 ring-1 ring-blue-100' : 'border-gray-200'
                  } ${selectedAd === rankedAd.ad.pending_ad_id ? 'ring-2 ring-blue-300' : ''}`}
                  onMouseEnter={() => setSelectedAd(rankedAd.ad.pending_ad_id)}
                  onMouseLeave={() => setSelectedAd(null)}
                >
                  {/* En-tête avec position et badge boost */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getPositionColor(rankedAd.position)}`}>
                        {getPositionIcon(rankedAd.position)}
                        <span className="font-bold text-sm">
                          #{rankedAd.position}/{rankedAd.total}
                        </span>
                      </div>
                      
                      {rankedAd.isBoosted && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded-full">
                          <TrendingUp className="w-3 h-3" />
                          <span>{t('adCard.boostedBadge')}</span>
                        </div>
                      )}
                    </div>
                    
                    {isUser && (
                      <div className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-2">
                        {t('adCard.userAdBadge')}
                      </div>
                    )}
                    
                    <h3 className="font-medium text-gray-900 truncate">
                      {rankedAd.ad.title || t('adCard.untitledAd')}
                    </h3>
                  </div>
                  
                  {/* Image miniature */}
                  <div className="p-4">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                      {image ? (
                        <Image
                          src={image}
                          alt={rankedAd.ad.title || t('adCard.noImageAlt')}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Badge favoris */}
                      <div className="absolute top-2 right-2">
                        <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition">
                          <Heart className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Infos rapides */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{t('adCard.createdOn')} {formatDate(rankedAd.ad.created_at)}</span>
                      </div>
                      
                      {rankedAd.lastBoosted && (
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                          <TrendingUp className="w-4 h-4" />
                          <span>{t('adCard.boostedAgo')} {formatTimeAgo(rankedAd.lastBoosted) }</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/escorts/${cityParam}/${rankedAd.ad.pending_ad_id}`}
                        className="flex-1 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium text-center transition flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-4 h-4" />
                        {t('adCard.viewDetails')}
                      </Link>
                      
                      {rankedAd.isBoosted ? (
                        <div className="p-2.5 text-amber-600 bg-amber-50 rounded-lg" title={t('adCard.alreadyBoosted')}>
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      ) : (
                        <Link
                          href={`/manage/ads/${cityParam}/${rankedAd.ad.pending_ad_id}`}
                          className="p-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                          title={t('adCard.boostAd')}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Link>
                      )}
                      
                      {isUser && (
                        <Link
                          href={`/manage/ads/${cityParam}/${rankedAd.ad.pending_ad_id}/update`}
                          className="p-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                          title={t('adCard.editAd')}
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredAds.length > 0 && (
          <div className="mt-8 flex items-center justify-center">
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                {t('pagination.previous')}
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 text-sm">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                2
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                3
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                {t('pagination.next')}
              </button>
            </div>
          </div>
        )}

        {/* Explication détaillée */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{t('algorithmDetails.title')}</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">{t('algorithmDetails.priority1.title')}</h4>
              <p className="text-blue-800 text-sm">
                {t('algorithmDetails.priority1.description')}
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">{t('algorithmDetails.priority2.title')}</h4>
              <p className="text-green-800 text-sm">
                {t('algorithmDetails.priority2.description')}
              </p>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="font-medium text-amber-900 mb-2">{t('algorithmDetails.boostInfo.title')}</h4>
              <p className="text-amber-800 text-sm">
                {t('algorithmDetails.boostInfo.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}