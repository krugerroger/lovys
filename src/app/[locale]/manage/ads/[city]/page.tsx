"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Plus, 
  MapPin, 
  Edit, 
  Eye, 
  Calendar, 
  Euro, 
  Users, 
  Filter, 
  Search,
  ChevronRight,
  Image as ImageIcon,
  Star,
  Clock,
  Trash2,
  MoreVertical,
  Sparkles
} from 'lucide-react'
import { PreviewAdData } from '@/types/adsForm'
import Image from 'next/image'
import { toast } from 'sonner'
import { useUser } from '@/app/[locale]/context/userContext'
import { useScopedI18n } from '../../../../../../locales/client'

export default function CityAdsPage() {
  const params = useParams()
  const router = useRouter()
  const { pendingAds, getAdById, fetchPendingAds } = useUser()
  const t = useScopedI18n('Manage.CityAdsPage' as never) as (key: string, vars?: Record<string, any>) => string;
  
  const city = Array.isArray(params.city) ? params.city[0] : params.city
  const decodedCity = decodeURIComponent(city || '')
  
  const [cityAds, setCityAds] = useState<PreviewAdData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'price_asc' | 'price_desc'>('recent')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all')
  const [selectedAd, setSelectedAd] = useState<string | null>(null)

  // Filtrer les annonces par ville
  useEffect(() => {
    setIsLoading(true)
    
    if (!pendingAds || pendingAds.length === 0) {
      setCityAds([])
      setIsLoading(false)
      return
    }

    // Filtrer par ville (insensible à la casse)
    let filtered = pendingAds.filter(ad => {
      const adCity = ad.location?.city?.toLowerCase().trim()
      const searchCity = decodedCity.toLowerCase().trim()
      
      // Supporte les correspondances partielles et les noms normalisés
      return adCity && adCity.includes(searchCity)
    })

    // Appliquer le filtre de statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(ad => ad.status === filterStatus)
    }

    // Appliquer la recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(ad => 
        ad.title?.toLowerCase().includes(term) ||
        ad.description?.toLowerCase().includes(term) ||
        ad.username?.toLowerCase().includes(term)
      )
    }

    // Appliquer le tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        case 'price_asc':
          return (a.rates?.oneHour || 0) - (b.rates?.oneHour || 0)
        case 'price_desc':
          return (b.rates?.oneHour || 0) - (a.rates?.oneHour || 0)
        default:
          return 0
      }
    })

    setCityAds(filtered)
    setIsLoading(false)
  }, [pendingAds, decodedCity, searchTerm, sortBy, filterStatus])

  // Formatage du nom de ville
  const formatCityName = (cityName: string): string => {
    return cityName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Fonction pour supprimer une annonce
  const handleDeleteAd = async (adId: string) => {
    if (!confirm(t('messages.deleteConfirm'))) {
      return
    }

    try {
      const response = await fetch(`/api/ads/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adId })
      })

      if (!response.ok) {
        throw new Error('Failed to delete ad')
      }

      toast.success(t('messages.deleteSuccess'))
      // Rafraîchir la liste des annonces
      fetchPendingAds()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(t('messages.deleteError'))
    }
  }

  // Fonction pour dupliquer une annonce
  const handleDuplicateAd = async (adId: string) => {
    try {
      const adToDuplicate = getAdById(adId)
      if (!adToDuplicate) {
        toast.error(t('messages.notFound'))
        return
      }

      // Créer une copie de l'annonce avec un nouveau titre
      const duplicateData = {
        ...adToDuplicate,
        title: `${adToDuplicate.title} (Copy)`,
        status: 'pending' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const response = await fetch('/api/ads/createAds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(duplicateData)
      })

      if (!response.ok) {
        throw new Error('Failed to duplicate ad')
      }

      toast.success(t('messages.duplicateSuccess'))
      fetchPendingAds()
    } catch (error) {
      console.error('Duplicate error:', error)
      toast.error(t('messages.duplicateError'))
    }
  }

  // Formatage du prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  // Formatage de la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Calculer le statut de l'annonce
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          {t('badges.approved')}
        </span>
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
          {t('badges.pending')}
        </span>
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
          {t('badges.rejected')}
        </span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
          {t('badges.draft')}
        </span>
    }
  }

  // Afficher un indicateur de chargement
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  const formattedCityName = formatCityName(decodedCity)

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                <MapPin className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t('pageTitle')} {formattedCityName}
                </h1>
                <p className="text-gray-600 mt-1">
                  {t('pageSubtitle')}
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="px-4 py-2 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">{t('stats.totalAds')}</p>
                <p className="text-2xl font-bold text-gray-900">{cityAds.length}</p>
              </div>
              <div className="px-4 py-2 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">{t('stats.approved')}</p>
                <p className="text-2xl font-bold text-green-600">
                  {cityAds.filter(ad => ad.status === 'approved').length}
                </p>
              </div>
              <div className="px-4 py-2 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">{t('stats.pending')}</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {cityAds.filter(ad => ad.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/manage/ads/form?city=${decodedCity}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              {t('actions.newAdInCity')} {formattedCityName}
            </Link>
            <Link
              href="/manage/ads/form"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {t('actions.newAdOtherCity')}
            </Link>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('filters.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>

            {/* Filtre par statut */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white"
              >
                <option value="all">{t('filters.status.all')}</option>
                <option value="active">{t('filters.status.active')}</option>
                <option value="pending">{t('filters.status.pending')}</option>
              </select>
            </div>

            {/* Tri */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white"
              >
                <option value="recent">{t('filters.sort.recent')}</option>
                <option value="price_asc">{t('filters.sort.price_asc')}</option>
                <option value="price_desc">{t('filters.sort.price_desc')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des annonces */}
      {cityAds.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-pink-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {t('emptyState.title')} {formattedCityName}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {t('emptyState.subtitle')} {formattedCityName} {t('emptyState.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/manage/ads/form?city=${decodedCity}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              {t('actions.createFirstAd')}
            </Link>
            <Link
              href="/manage/ads/all"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('actions.viewAllAds')}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cityAds.map((ad) => (
            <div
              key={ad.pending_ad_id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image et badge */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                {ad.images && ad.images.length > 0 ? (
                  <Image
                    src={ad.images[0]}
                    alt={ad.title || t('adCard.untitled')}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                {/* Badge de statut */}
                <div className="absolute top-3 left-3">
                  {getStatusBadge(ad.status || 'pending')}
                </div>
                
                {/* Menu d'actions */}
                <div className="absolute top-3 right-3">
                  <div className="relative">
                    <button
                      onClick={() => setSelectedAd(selectedAd === ad.pending_ad_id ? null : ad.pending_ad_id)}
                      className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    {selectedAd === ad.pending_ad_id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => {
                            router.push(`/manage/ads/${decodedCity}/${ad.pending_ad_id}/update`)
                            setSelectedAd(null)
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          {t('adCard.menu.editAd')}
                        </button>
                        <button
                          onClick={() => {
                            router.push(`/manage/ads/${decodedCity}/${ad.pending_ad_id}`)
                            setSelectedAd(null)
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          {t('adCard.menu.preview')}
                        </button>
                        <button
                          onClick={() => {
                            handleDuplicateAd(ad.pending_ad_id)
                            setSelectedAd(null)
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          {t('adCard.menu.duplicate')}
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteAd(ad.pending_ad_id)
                            setSelectedAd(null)
                          }}
                          className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          {t('adCard.menu.delete')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                      {ad.title || t('adCard.untitled')}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{formatCityName(ad.location?.city || decodedCity)}</span>
                      <span className="mx-1">•</span>
                      <Calendar className="w-4 h-4" />
                      <span>{ad.created_at ? formatDate(ad.created_at) : 'Recent'}</span>
                    </div>
                  </div>
                </div>

                {/* Prix et durée */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Euro className="w-5 h-5 text-green-600" />
                      <span className="text-2xl font-bold text-gray-900">
                        {ad.rates?.oneHour ? formatPrice(ad.rates.oneHour) : 'N/A'}
                      </span>
                      <span className="text-gray-600">{t('adCard.perHour')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{t('adCard.thirtyMinutes')} {ad.rates?.thirtyMinutes ? formatPrice(ad.rates.thirtyMinutes) : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 line-clamp-2">
                  {ad.description || t('adCard.noDescription')}
                </p>

                {/* Stats et actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" />
                      <span>{ad.images?.length || 0} {t('adCard.photos')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>0 {t('adCard.views')}</span>
                    </div>
                  </div>
                  
                  <Link
                    href={`/manage/ads/${decodedCity}/${ad.pending_ad_id}`}
                    className="flex items-center gap-1 text-pink-600 hover:text-pink-700 font-medium"
                  >
                    {t('adCard.viewDetails')}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pied de page avec stats */}
      {cityAds.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('performance.title')}
                </h4>
                <p className="text-gray-600 text-sm">
                  {t('performance.description')} {formattedCityName}.
                </p>
              </div>
              <div className="md:col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">{t('stats.totalAds')}</p>
                    <p className="text-2xl font-bold text-gray-900">{cityAds.length}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">{t('stats.averagePrice')}</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatPrice(
                        cityAds.reduce((acc, ad) => acc + (ad.rates?.oneHour || 0), 0) / cityAds.length || 0
                      )}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">{t('stats.approvedRate')}</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round((cityAds.filter(ad => ad.status === 'approved').length / cityAds.length) * 100)}%
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">{t('stats.lastUpdated')}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {cityAds.length > 0 
                        ? formatDate(cityAds.sort((a, b) => 
                            new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
                          )[0].updated_at || new Date().toISOString())
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation rapide */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link
              href="/manage/ads/all"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {t('actions.viewAllCities')}
            </Link>
            <Link
              href="/manage/ads/form"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {t('actions.createAnotherAd')}
            </Link>
          </div>
        </div>
      )}

      {/* Overlay pour fermer le menu */}
      {selectedAd && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setSelectedAd(null)}
        />
      )}
    </div>
  )
}