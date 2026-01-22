// app/admin/ads/pending/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, Search } from 'lucide-react'
import { Eye } from 'lucide-react'
import { Calendar } from 'lucide-react'
import { MapPin } from 'lucide-react'
import { User } from 'lucide-react'
import { Mail } from 'lucide-react'
import { AlertTriangle } from 'lucide-react'
import { ChevronLeft } from 'lucide-react'

import { Download } from 'lucide-react'
import { Image as ImageIcon } from 'lucide-react'
import { ExternalLink } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import { XCircle } from 'lucide-react'
import { CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { Ad } from '@/types/adsForm'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ManagePendingAdsPage() {
  const router = useRouter()
  const [ads, setAds] = useState<Ad[]>([])
  const [totalAds, setTotalAds] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchId, setSearchId] = useState('')
  const [filter, setFilter] = useState('all')
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isSearchingById, setIsSearchingById] = useState(false)
  const [foundAd, setFoundAd] = useState<Ad | null>(null)

  const fetchAllAds = async () => {
    try {
      const supabase = createClient()
      const { data: ads, error } = await supabase
        .from('pending_ads')
        .select('pending_ad_id')

      if (error) {
        throw new Error(error.message)
      }
      const totalAdsFound = ads.length
      console.log(`Fetched ${totalAdsFound} pending ads`)
      setTotalAds(totalAdsFound)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

const searchAdById = async () => {
  if (!searchId.trim()) {
    toast.error('Please enter an Ad ID')
    return
  }
  console.log('Searching for Ad ID:', searchId)
  setIsSearchingById(true)
  try {
 const supabase = createClient()
 
     const { data : ad, error } = await supabase
       .from('pending_ads')
       .select('pending_ad_id, title, location, escort_id, email, created_at, images')
       .eq('pending_ad_id', searchId.trim())
       .single()
 
     if (error) {
       console.error('Error fetching ad:', error)
        throw new Error(error.message)
     }

     if (ad) {
      const formattedAd = {
        pending_ad_id: ad.pending_ad_id,
        title: ad.title,
        city: ad.location.city,
        country: ad.location.country,
        escort_id: ad.escort_id,
        email: ad.email,
        created_at: ad.created_at,
        images: ad.images || []
      } as Ad
      setFoundAd(formattedAd)
      toast.success('Ad found successfully!')
    } else {
      setFoundAd(null)
      toast.info('No ad found with this ID')
    }
  } catch (error: any) {
    toast.error(error.message)
    setFoundAd(null)
  } finally {
    setIsSearchingById(false)
  }
}


  const clearIdSearch = () => {
    setSearchId('')
    setFoundAd(null)
  }


  const deleteFoundAd = async () => {
    if (!foundAd) return
    
    if (!confirm(`Are you sure you want to delete ad "${foundAd.title}"? This action cannot be undone.`)) {
      return
    }

    setProcessingId(foundAd.pending_ad_id)
    try {
      const supabase = createClient()
      const { error: deleteError } = await supabase
      .from('pending_ads')
      .delete()
      .eq('pending_ad_id', foundAd.pending_ad_id)

      if (deleteError) {
        throw new Error(deleteError.message || 'Failed to delete ad')
        toast.error('Failed to delete ad')
      }
      toast.success('Ad deleted successfully!')
      // Remove from main list
      setAds(prev => prev.filter(ad => ad.pending_ad_id !== foundAd.pending_ad_id))
      if (selectedAd?.pending_ad_id === foundAd.pending_ad_id) {
        setSelectedAd(null)
      }
      // Clear search
      setFoundAd(null)
      setSearchId('')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setProcessingId(null)
    }
  }

  const getAdUrl = (ad: Ad) => {
    const city = ad.city
    const adId = ad.pending_ad_id || ad.pending_ad_id
    return `/escorts/${city}/${adId}`
  }

  const filteredAds = foundAd ? [foundAd] : ads.filter(ad => {
    const matchesSearch = 
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.pending_ad_id.toLowerCase().includes(searchTerm.toLowerCase())
    if (filter === 'today') {
      const today = new Date().toDateString()
      const adDate = new Date(ad.created_at).toDateString()
      return matchesSearch && today === adDate
    }

    if (filter === 'week') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return matchesSearch && new Date(ad.created_at) >= weekAgo
    }

    if (filter === 'month') {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return matchesSearch && new Date(ad.created_at) >= monthAgo
    }

    return matchesSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const exportToCSV = () => {
    const adsToExport = foundAd ? [foundAd] : ads
    const csvContent = [
      ['ID', 'Title', 'Username', 'Email', 'Location', 'Images', 'Created At', 'Status'],
      ...adsToExport.map(ad => [
        ad.pending_ad_id,
        ad.title,
        ad.username,
        ad.email,
        `${ad.city}, ${ad.country}`,
        ad.images?.length || 0,
        formatDate(ad.created_at),
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ads_${foundAd ? 'single' : 'all'}_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading ads...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-black">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Manage Ads</h1>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <p className="text-sm text-gray-400">
                      {foundAd 
                        ? `Viewing specific ad: ${foundAd.title}`
                        : `${ads.length} total ads`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg flex items-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* ID Search & Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 lg:col-span-1">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className='flex gap-4 items-center'>
                  <p className="text-sm text-gray-400 mb-1">Total Ads</p>
                  <button onClick={() => fetchAllAds()}>
                    <RefreshCw className="w-4 h-4 text-gray-500 hover:text-white" />
                  </button>
                </div>
                <p className="text-3xl font-bold text-white">{totalAds}</p>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 lg:col-span-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Search Ad by ID
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && searchAdById()}
                      placeholder="Enter Ad ID..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <button
                    onClick={searchAdById}
                    disabled={isSearchingById || !searchId.trim()}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSearchingById ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Search'
                    )}
                  </button>
                  {foundAd && (
                    <button
                      onClick={clearIdSearch}
                      className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {foundAd && (
                  <div className="mt-2 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-cyan-400 font-medium">
                          Ad Found: {foundAd.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          ID: {foundAd.pending_ad_id}
                        </p>
                      </div>
                      <button
                        onClick={deleteFoundAd}
                        disabled={processingId === foundAd.pending_ad_id}
                        className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded-lg flex items-center gap-2 disabled:opacity-50"
                      >
                        {processingId === foundAd.pending_ad_id ? (
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* <div>
                <label className="block text-sm text-gray-400 mb-2">Filter Ads</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title, location, username, ID..."
                    className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Ads Table */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Ad</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">ID</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Images</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">User</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Location</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Created</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredAds.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                          <AlertTriangle className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-gray-400 text-lg mb-2">No ads found</p>
                        <p className="text-gray-500 text-sm">
                          {foundAd 
                            ? `No ad found with ID "${searchId}"`
                            : searchTerm ? 'Try a different search term' : 'No ads available'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAds.map((ad, index) => (
                    <tr 
                      key={index} 
                      className={`hover:bg-gray-700/30 transition ${foundAd?.pending_ad_id === ad.pending_ad_id ? 'bg-cyan-500/5' : ''}`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {ad.images && ad.images.length > 0 ? (
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                              <Image
                                src={ad.images[0]}
                                alt={ad.title}
                                fill
                                className="object-cover"
                                sizes="40px"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-white line-clamp-1 max-w-xs">
                              {ad.title}
                            </p>
                            <a
                              href={getAdUrl(ad)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Voir ad <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <code className="text-xs text-gray-300 font-mono bg-gray-800/50 px-2 py-1 rounded">
                            {ad.pending_ad_id}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(ad.pending_ad_id)
                              toast.success('ID copied to clipboard!')
                            }}
                            className="text-xs text-gray-500 hover:text-gray-400 mt-1"
                          >
                            Copy ID
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {ad.images && ad.images.slice(0, 3).map((image, imgIndex) => (
                              <div 
                                key={imgIndex} 
                                className="relative w-8 h-8 rounded-full border-2 border-gray-800 overflow-hidden"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedImage(image)
                                }}
                              >
                                <Image
                                  src={image}
                                  alt={`Image ${imgIndex + 1}`}
                                  fill
                                  className="object-cover cursor-pointer hover:scale-110 transition-transform"
                                  sizes="32px"
                                  unoptimized
                                />
                              </div>
                            ))}
                            {ad.images && ad.images.length > 3 && (
                              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-300">
                                +{ad.images.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            {ad.images?.length || 0} images
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">
                              {ad.username?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {ad.username}
                            </p>
                            <p className="text-xs text-gray-400 truncate max-w-xs">
                              {ad.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-white">
                            {ad.city || 'Unknown'}, {ad.country}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-300">
                            {formatDate(ad.created_at)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedAd(ad)
                            }}
                            className="p-2 hover:bg-gray-700/50 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteFoundAd()
                            }}
                            disabled={processingId === ad.pending_ad_id}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition disabled:opacity-50"
                            title="Delete Ad"
                          >
                            {processingId === ad.pending_ad_id ? (
                              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-4 h-4 text-red-400" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar for ad details */}
        {selectedAd && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end">
            <div className="w-full max-w-3xl bg-gray-900 h-full overflow-y-auto">
              <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Ad Details</h2>
                  <button
                    onClick={() => setSelectedAd(null)}
                    className="p-2 hover:bg-gray-800 rounded-lg"
                  >
                    <XCircle className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{selectedAd.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-400">ID:</span>
                      <code className="text-sm text-gray-300 font-mono bg-gray-800/50 px-2 py-1 rounded">
                        {selectedAd.pending_ad_id}
                      </code>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Created</p>
                    <p className="text-white">{formatDate(selectedAd.created_at)}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Galerie d'images */}
                {selectedAd.images && selectedAd.images.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Images ({selectedAd.images.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedAd.images.map((image, index) => (
                        <div 
                          key={index} 
                          className="relative aspect-square rounded-xl overflow-hidden border border-gray-700 group cursor-pointer"
                          onClick={() => window.open(image, '_blank')}
                        >
                          <Image
                            src={image}
                            alt={`Image ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            sizes="(max-width: 768px) 50vw, 33vw"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <ExternalLink className="w-8 h-8 text-white" />
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-sm text-gray-400">
                      <p>Click on an image to open it in a new tab.</p>
                    </div>
                  </div>
                )}

                {/* User Info */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    User Information
                  </h4>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-2xl text-white">
                          {selectedAd?.username?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-xl font-bold text-white">
                          {selectedAd?.username || 'Unknown'}
                        </h5>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{selectedAd?.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Location
                    </h4>
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <p className="text-white text-xl">
                        {selectedAd.city || 'Unknown'}, {selectedAd.country}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Ad Information</h4>
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Images:</span>
                          <span className="text-white font-bold">{selectedAd.images?.length || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">User ID:</span>
                          <code className="text-xs text-gray-400 font-mono">
                            {selectedAd.escort_id.substring(0, 8)}...
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="sticky bottom-0 bg-gray-900 pt-6 border-t border-gray-700">
                  <div className="flex gap-4">
                    <Link
                      href={getAdUrl(selectedAd)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-5 h-5" />
                      View ad
                    </Link>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedAd.pending_ad_id)
                        toast.success('Ad ID copied to clipboard!')
                      }}
                      className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold rounded-xl flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Copy ID
                    </button>
                    <button
                      onClick={() => deleteFoundAd()}
                      disabled={processingId === selectedAd.pending_ad_id}
                      className="flex-1 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {processingId === selectedAd.pending_ad_id ? (
                        <>
                          <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-5 h-5" />
                          Delete Ad
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-60 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <XCircle className="w-8 h-8 text-white" />
            </button>
            <div className="relative max-w-4xl max-h-[90vh]">
              <Image
                src={selectedImage}
                alt="Full size image"
                width={1200}
                height={800}
                className="rounded-xl object-contain max-h-[90vh]"
                unoptimized
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}