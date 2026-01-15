"use client"

import React, { useState, useEffect } from 'react'
import { Edit, ArrowUp, MapPin, Clock, Crown, TrendingUp, Star, BarChart, AlertCircle, Loader2 } from 'lucide-react'
import { useUser } from '@/app/[locale]/context/userContext'
import { toast } from 'sonner'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PreviewAdData } from '@/types/adsForm'
import { useScopedI18n } from '../../../../../../../locales/client'

interface PositionInfo {
  position: number;
  total: number;
  isInTop3: boolean;
  isInTop10: boolean;
}

export default function ModelManagementPage() {
  const { user, pendingAds, getAdById } = useUser()
  const params = useParams()
  const city = params.city as string
  const adId = params.adId as string
  const t = useScopedI18n('Manage.CityAdIDPage' as never) as (key: string, vars?: Record<string, any>) => string;
  
  const [loading, setLoading] = useState(false)
  const [positionInfo, setPositionInfo] = useState<PositionInfo | null>(null)
  const [loadingAds, setLoadingAds] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [pendingAd, setPendingAd] = useState<PreviewAdData | null>(null)
  
  const router = useRouter()

  // 1. Chercher l'annonce depuis le contexte
  useEffect(() => {
    if (!adId || pendingAds.length === 0) return

    const adFromContext = getAdById(adId)

    console.log('adFromContext datas:', adFromContext)

    if (adFromContext) {
      setPendingAd(adFromContext)
      console.log('Annonce trouvée dans le contexte:', adFromContext)
    }
  }, [adId, pendingAds, getAdById])

  // Récupérer l'ID correct de l'annonce
  const getAdId = () => {
    return pendingAd?.pending_ad_id
  }

  // Récupérer TOUTES les annonces de la ville
  const fetchAdsDirectly = async (): Promise<any[]> => {
    try {
      const supabase = createClient()
      const normalizedCity = city.toLowerCase()
      
      const { data, error } = await supabase
        .from('pending_ads')
        .select('*')
        .eq('status', 'approved')

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      // Filtrer pour la ville spécifique
      const filteredAds = (data || []).filter((ad: any) => {
        if (!ad || !ad.location) return false

        const adCity = ad.location.city
        
        // Si c'est un tableau
        if (Array.isArray(adCity)) {
          return adCity.some((c: string) => 
            String(c).toLowerCase().includes(normalizedCity)
          )
        }
        
        // Si c'est une string
        if (typeof adCity === 'string') {
          return adCity.toLowerCase().includes(normalizedCity)
        }
        
        return false
      })

      console.log('Filtered ads in city', city, ':', filteredAds.length)
      return filteredAds
    } catch (error) {
      console.error('Direct Supabase fetch failed:', error)
      throw error
    }
  }

  // Nouvelle logique de tri SIMPLE
  const calculateSortedAds = (ads: any[]): any[] => {
    if (ads.length === 0) return []
    
    const normalizedCity = city.toLowerCase()
    
    // Trier selon la logique simple
    return [...ads].sort((a, b) => {
      const aBoostedAt = a.city_boosted_at?.[normalizedCity];
      const bBoostedAt = b.city_boosted_at?.[normalizedCity];
      
      // Cas 1: Les deux annonces sont boostées => trier par date de boost (la plus récente d'abord)
      if (aBoostedAt && bBoostedAt) {
        const aBoostTime = new Date(aBoostedAt).getTime();
        const bBoostTime = new Date(bBoostedAt).getTime();
        return bBoostTime - aBoostTime; // DESC: les plus récentes d'abord
      }
      
      // Cas 2: Une seule est boostée => celle boostée passe avant
      if (aBoostedAt && !bBoostedAt) return -1;
      if (!aBoostedAt && bBoostedAt) return 1;
      
      // Cas 3: Aucune n'est boostée => trier par date de création (la plus récente d'abord)
      const aCreatedTime = new Date(a.created_at).getTime();
      const bCreatedTime = new Date(b.created_at).getTime();
      return bCreatedTime - aCreatedTime; // DESC: les plus récentes d'abord
    })
  }

  // Calculer la position
  const calculatePosition = async () => {
    if (!pendingAd || !city) return

    setLoadingAds(true)
    setApiError(null)
    
    try {
      const ads = await fetchAdsDirectly()
      console.log('Ads for position calculation:', ads.length)
      
      // Vérifier si notre annonce est dans la liste
      const currentAdId = getAdId()
      console.log('Current ad ID to find:', currentAdId)
      
      const isOurAdInList = ads.some((ad: any) => ad.pending_ad_id === currentAdId)
      console.log('Is our ad in the list?', isOurAdInList)
      
      if (ads.length === 0 || !isOurAdInList) {
        console.log('Our ad is not in the list.')
        setPositionInfo({
          position: 0,
          total: ads.length,
          isInTop3: false,
          isInTop10: false
        })
        return
      }
      
      // Trier les annonces selon la nouvelle logique
      const sortedAds = calculateSortedAds(ads)
      
      console.log('Sorted ads (first 5):', sortedAds.slice(0, 5).map((ad, idx) => ({
        position: idx + 1,
        id: ad.pending_ad_id,
        boost: ad.city_boosted_at?.[city.toLowerCase()],
        created: ad.created_at
      })))
      
      // Trouver la position de notre annonce
      const positionIndex = sortedAds.findIndex((ad: any) => 
        ad.pending_ad_id === currentAdId
      )

      console.log('Found at position index:', positionIndex)
      
      if (positionIndex === -1) {
        setPositionInfo({
          position: 0,
          total: sortedAds.length,
          isInTop3: false,
          isInTop10: false
        })
        return
      }

      const position = positionIndex + 1
      const total = sortedAds.length
      
      console.log(`Final position: ${position} / ${total}`)
      
      setPositionInfo({
        position,
        total,
        isInTop3: position <= 3,
        isInTop10: position <= 10
      })
    } catch (error) {
      console.error('Error calculating position:', error)
      setApiError(
        error instanceof Error 
          ? error.message 
          : t('error.message')
      )
      
      setPositionInfo({
        position: 0,
        total: 0,
        isInTop3: false,
        isInTop10: false
      })
    } finally {
      setLoadingAds(false)
    }
  }

  useEffect(() => {
    if (pendingAd && city) {
      calculatePosition()
    }
  }, [pendingAd, city])

  const handleBoost = async () => {
    if (!pendingAd || !city || loading) return
    
    const currentAdId = getAdId()
    if (!currentAdId) {
      toast.error(t('messages.boostError'))
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch(`/api/ads/boost/${currentAdId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          city: city,
          action: "remonter" 
        }),
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || `Erreur ${res.status}`)
      }
      
      if (data.success) {
        toast.success(`${t('messages.boostSuccess')} ${city} !`)
        
        // Mettre à jour l'annonce localement
        setPendingAd((prev: any) => ({
          ...prev,
          city_boosted_at: {
            ...prev.city_boosted_at,
            [city.toLowerCase()]: new Date().toISOString()
          }
        }))
        
        // Rafraîchir la position
        await calculatePosition()
      } else {
        throw new Error(data.error || t('messages.boostGenericError'))
      }
    } catch (error) {
      console.error('Boost error:', error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : t('messages.boostConnectionError')
      )
    } finally {
      setLoading(false)
    }
  }

  // Formatage du temps écoulé
  const formatTimeAgo = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      
      if (diffHours < 1) return t('lastBoost.justNow')
      if (diffHours === 1) return t('lastBoost.hourAgo')
      if (diffHours < 24) return `${t('lastBoost.hoursAgo')} ${diffHours}h`
      return `${t('lastBoost.daysAgo')} ${Math.floor(diffHours / 24)}j`
    } catch {
      return t('messages.dateInvalid')
    }
  }

  // Composant pour afficher le badge de rang
  const RankDisplay = ({ position, total }: { position: number; total: number }) => {
    const getRankColor = () => {
      if (position === 1) return 'from-yellow-500 to-amber-500'
      if (position === 2) return 'from-gray-400 to-gray-600'
      if (position === 3) return 'from-amber-700 to-amber-900'
      if (position <= 10) return 'from-blue-500 to-indigo-600'
      return 'from-gray-600 to-gray-800'
    }

    const getRankIcon = () => {
      if (position === 1) return <Crown className="w-5 h-5" />
      if (position <= 3) return <TrendingUp className="w-5 h-5" />
      if (position <= 10) return <Star className="w-5 h-5" fill="currentColor" />
      return <BarChart className="w-5 h-5" />
    }

    const getRankText = () => {
      if (position === 1) return t('rank.topOne')
      if (position === 2) return t('rank.topTwo')
      if (position === 3) return t('rank.topThree')
      if (position <= 10) return `${t('rank.topNumber')} ${position}`
      return `#${position}`
    }

    const getStatusText = () => {
      if (position <= 3) return t('rank.excellent')
      if (position <= 10) return t('rank.good')
      return t('rank.toImprove')
    }

    return (
      <div className="flex items-center gap-4">
        <div className={`bg-gradient-to-br ${getRankColor()} text-white p-4 rounded-2xl shadow-lg`}>
          <div className="flex items-center gap-3">
            {getRankIcon()}
            <div className="text-center">
              <div className="text-3xl font-bold">#{position}</div>
              <div className="text-sm opacity-90">{t('header.total')} {total}</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="text-sm text-gray-600 mb-1">
            {t('rank.currentRank')} {city}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.max(2, ((total - position + 1) / total) * 100)}%` 
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>#1</span>
            <span>Top 10</span>
            <span>#{total}</span>
          </div>
        </div>
      </div>
    )
  }

  // Si l'annonce n'existe pas
  if (!pendingAd) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t('notFound.title')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('notFound.description')} {adId}.
            </p>
            <button
              onClick={() => router.push('/manage/ads')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
            >
              {t('notFound.backToAds')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Mettez à jour la section "Comment ça marche" pour refléter la nouvelle logique
  const updateHowItWorks = () => {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {t('howItWorks.title')}
        </h3>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              1
            </div>
            <span><strong>{t('howItWorks.step1')}</strong> : {t('howItWorks.step1Desc')}</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              2
            </div>
            <span><strong>{t('howItWorks.step2')}</strong> : {t('howItWorks.step2Desc')}</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              3
            </div>
            <span><strong>{t('howItWorks.step3')}</strong> : {t('howItWorks.step3Desc')}</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              4
            </div>
            <span><strong>{t('howItWorks.step4')}</strong> : {t('howItWorks.step4Desc')}</span>
          </li>
        </ul>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100  min-md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {t('header.title')} {city}
              </h1>
              <div className="flex items-center gap-4 text-white/90">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {city}
                </span>
                {positionInfo && positionInfo.total > 0 && (
                  <>
                    <span className="text-white/70">|</span>
                    <span className="flex items-center gap-1">
                      <Crown className="w-4 h-4" />
                      {t('header.position')} #{positionInfo.position} {t('header.total')} {positionInfo.total}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{t('error.title')}</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{apiError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section gauche - Actions et stats */}
          <div className="space-y-6">
            {/* Stats position */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                {t('rank.title')}
              </h2>
              
              {loadingAds ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-20 bg-gray-200 rounded-xl"></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              ) : positionInfo && positionInfo.total > 0 ? (
                <>
                  <RankDisplay position={positionInfo.position} total={positionInfo.total} />
                  
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className={`text-lg font-bold ${
                        positionInfo.position === 1 ? 'text-amber-600' :
                        positionInfo.position === 2 ? 'text-gray-600' :
                        positionInfo.position === 3 ? 'text-amber-800' :
                        positionInfo.position <= 10 ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {positionInfo.position === 1 ? t('rank.topOne') :
                         positionInfo.position === 2 ? t('rank.topTwo') :
                         positionInfo.position === 3 ? t('rank.topThree') :
                         positionInfo.position <= 10 ? `${t('rank.topNumber')} ${positionInfo.position}` :
                         `#${positionInfo.position}`}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{t('rank.position')}</div>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{positionInfo.total}</div>
                      <div className="text-xs text-gray-500 mt-1">{t('rank.totalAds')}</div>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className={`text-lg font-bold ${
                        positionInfo.isInTop3 ? 'text-green-600' :
                        positionInfo.isInTop10 ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {positionInfo.isInTop3 ? t('rank.excellent') :
                         positionInfo.isInTop10 ? t('rank.good') : t('rank.toImprove')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{t('rank.status')}</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="mb-2">{t('boost.noAdsFound')} {city}</p>
                  <p className="text-sm">{t('boost.beFirst')}</p>
                </div>
              )}
            </div>

            {/* Dernier remontage */}
            {pendingAd?.city_boosted_at?.[city.toLowerCase()] && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {t('lastBoost.title')}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">{formatTimeAgo(pendingAd.city_boosted_at[city.toLowerCase()])}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(pendingAd.city_boosted_at[city.toLowerCase()]).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
                    {t('lastBoost.active')}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {t('actions.title')}
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => router.push(`/manage/ads/${city}/${pendingAd?.pending_ad_id}/update`)}
                  className="w-full p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-300 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Edit className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">
                        {t('actions.editProfile')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t('actions.editDescription')}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Section droite - Boost */}
          <div className="space-y-6">
            {/* Carte de boost */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <ArrowUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {t('boost.title')} {city}
                  </h3>
                  <p className="text-white/90">
                    {t('boost.subtitle')}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Crown className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {t('boost.feature1')}
                      </p>
                      <p className="text-sm text-white/70">
                        {t('boost.feature1Desc')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {t('boost.feature2')}
                      </p>
                      <p className="text-sm text-white/70">
                        {t('boost.feature2Desc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBoost}
                disabled={!pendingAd || loading || loadingAds}
                className="w-full py-4 bg-white hover:bg-gray-100 text-amber-700 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-amber-700 border-t-transparent rounded-full animate-spin"></div>
                    {t('boost.buttonLoading')}
                  </>
                ) : (
                  <>
                    <ArrowUp className="w-5 h-5" />
                    {pendingAd?.city_boosted_at?.[city.toLowerCase()] ? t('boost.buttonRe') : t('boost.button')}
                  </>
                )}
              </button>
              
              <div className="mt-4 text-center text-white/80 text-sm">
                {positionInfo && positionInfo.total > 0 && (
                  <div className="flex items-center justify-center gap-2">
                    <span>{t('boost.currentPosition')}</span>
                    <span className="font-bold bg-white/20 px-2 py-1 rounded">
                      #{positionInfo.position}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Comment ça marche (version mise à jour) */}
            {updateHowItWorks()}
          </div>
        </div>
      </div>
    </div>
  )
}