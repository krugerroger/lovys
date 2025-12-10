// app/admin/ads/pending/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Calendar,
  MapPin,
  User,
  Mail,
  AlertTriangle,
  ChevronLeft,
  RefreshCw,
  Download,
} from 'lucide-react'
import { toast } from 'sonner'

interface PendingAd {
  id: string
  user_id: string
  title: string
  country: string
  city: string
  images: string[]
  status: string
  created_at: string
  escort: {
    id: string
    email: string
    username: string
  } | null
}

export default function ManagePendingAdsPage() {
  const router = useRouter()
  const [ads, setAds] = useState<PendingAd[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAd, setSelectedAd] = useState<PendingAd | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all') // all, today, week, month
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [adToReject, setAdToReject] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingAds()
  }, [])

  const fetchPendingAds = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/ads/pending')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch ads')
      }
      console.log('Fetched pending ads:', data.ads)
      setAds(data.ads || [])
    } catch (error: any) {
      toast.error(error.message || 'Failed to load ads')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (adId: string) => {
    setProcessingId(adId)
    try {
      const response = await fetch('/api/admin/ads/pending', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', adId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve ad')
      }

      toast.success('Ad approved successfully!')
      // Supprimer de la liste
      setAds(prev => prev.filter(ad => ad.id !== adId))
      if (selectedAd?.id === adId) {
        setSelectedAd(null)
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async () => {
    if (!adToReject) return

    setProcessingId(adToReject)
    try {
      const response = await fetch('/api/admin/ads/pending', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'reject', 
          adId: adToReject,
          reason: rejectReason 
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject ad')
      }

      toast.success('Ad rejected successfully!')
      // Supprimer de la liste
      setAds(prev => prev.filter(ad => ad.id !== adToReject))
      if (selectedAd?.id === adToReject) {
        setSelectedAd(null)
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setProcessingId(null)
      setShowRejectModal(false)
      setRejectReason('')
      setAdToReject(null)
    }
  }

  const openRejectModal = (adId: string) => {
    setAdToReject(adId)
    setShowRejectModal(true)
  }

  const filteredAds = ads.filter(ad => {
    const matchesSearch = 
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.escort?.username.toLowerCase().includes(searchTerm.toLowerCase())

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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'Title', 'Escort', 'Location', 'Age', 'Price', 'Created At', 'Status'],
      ...ads.map(ad => [
        ad.id,
        ad.title,
        ad.escort?.username || 'Unknown',
        `${ad.city}, ${ad.country}`,
        formatDate(ad.created_at),
        ad.status
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pending_ads_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading pending ads...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
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
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Pending Ads</h1>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    <p className="text-sm text-gray-400">
                      {ads.length} ads waiting for review
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchPendingAds}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg flex items-center gap-2 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
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
        {/* Stats & Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Pending</p>
                <p className="text-3xl font-bold text-white">{ads.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Today</p>
                <p className="text-3xl font-bold text-amber-500">
                  {ads.filter(ad => {
                    const today = new Date().toDateString()
                    const adDate = new Date(ad.created_at).toDateString()
                    return today === adDate
                  }).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">This Week</p>
                <p className="text-3xl font-bold text-cyan-500">
                  {ads.filter(ad => {
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return new Date(ad.created_at) >= weekAgo
                  }).length}
                </p>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title, location, or escort..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Filter by Date</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
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
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Escort</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Location</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Created</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredAds.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                          <AlertTriangle className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-gray-400 text-lg mb-2">No pending ads found</p>
                        <p className="text-gray-500 text-sm">
                          {searchTerm ? 'Try a different search term' : 'All ads have been reviewed'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAds.map((ad, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-gray-700/30 cursor-pointer transition"
                      onClick={() => setSelectedAd(ad)}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">
                              {ad.title.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {ad.escort ? (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">
                                  {ad.escort.username?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {ad.escort.username}
                              </p>
                              <p className="text-xs text-gray-400 truncate max-w-xs">
                                {ad.escort.email}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Unknown</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-white">
                            {ad.city}, {ad.country}
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
                              handleApprove(ad.id)
                            }}
                            disabled={processingId === ad.id}
                            className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {processingId === ad.id ? (
                              <div className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <CheckCircle className="w-3.5 h-3.5" />
                            )}
                            <span className="text-sm">Approve</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              openRejectModal(ad.id)
                            }}
                            disabled={processingId === ad.id}
                            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span className="text-sm">Reject</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedAd(ad)
                            }}
                            className="p-1.5 hover:bg-gray-700/50 rounded-lg"
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
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
            <div className="w-full max-w-2xl bg-gray-900 h-full overflow-y-auto">
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
                      <span className="text-sm text-gray-400">Status:</span>
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">
                        Pending Review
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Created</p>
                    <p className="text-white">{formatDate(selectedAd.created_at)}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Escort Info */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Escort Information
                  </h4>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-2xl text-white">
                            {selectedAd.escort?.username?.charAt(0).toUpperCase() || '?'}
                          </span>
                      </div>
                      <div>
                        <h5 className="text-xl font-bold text-white">
                          {selectedAd.escort?.username || 'Unknown'}
                        </h5>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{selectedAd.escort?.email}</span>
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
                        {selectedAd.city}, {selectedAd.country}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="sticky bottom-0 bg-gray-900 pt-6 border-t border-gray-700">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleApprove(selectedAd.id)}
                      disabled={processingId === selectedAd.id}
                      className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {processingId === selectedAd.id ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Approve Ad
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => openRejectModal(selectedAd.id)}
                      disabled={processingId === selectedAd.id}
                      className="flex-1 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Ad
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Reject Ad</h3>
                    <p className="text-gray-400">Provide a reason for rejection</p>
                  </div>
                </div>

                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter rejection reason (optional)"
                  className="w-full h-32 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleReject}
                    disabled={processingId === adToReject}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl disabled:opacity-50"
                  >
                    {processingId === adToReject ? 'Processing...' : 'Confirm Reject'}
                  </button>
                  <button
                    onClick={() => {
                      setShowRejectModal(false)
                      setRejectReason('')
                      setAdToReject(null)
                    }}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}