// app/admin/users/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  User,
  Mail,
  Shield,
  Calendar,
  AlertTriangle,
  ChevronLeft,
  RefreshCw,
  Download,
  Eye,
  XCircle,
  CheckCircle,
  X,
  Filter,
  Ban,
  Check,
  UserCheck,
  UserX,
  Key,
  Globe,
  Phone,
  MapPin,
  CreditCard,
  MessageSquare,
  Star,
  Clock,
  Edit,
  MoreVertical,
  Trash2,
  ShieldOff,
  ShieldAlert,
  Lock,
  Unlock,
} from 'lucide-react'
import { toast } from 'sonner'

interface UserData {
  id: string
  user_id: string
  email: string
  username: string
  user_type: 'client' | 'escort' | 'admin'
  is_active: boolean
  is_verified: boolean
  created_at: string
  last_login: string | null
  phone?: string
  country?: string
  city?: string
  profile_image?: string
  subscription_status?: string
  total_ads?: number
  total_reviews?: number
  total_bookings?: number
  average_rating?: number
}

interface SearchResult {
  user: UserData
  stats?: {
    ads_count: number
    reviews_count: number
    bookings_count: number
  }
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [searchType, setSearchType] = useState<'user_id' | 'email'>('email')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [isReactivating, setIsReactivating] = useState(false)
  const [allUsers, setAllUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [showAllUsers, setShowAllUsers] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [filterType, setFilterType] = useState<'all' | 'client' | 'escort' | 'admin'>('all')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Charger tous les utilisateurs au départ
  useEffect(() => {
    fetchAllUsers()
  }, [])

  const fetchAllUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/users/all')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users')
      }
      setAllUsers(data.users || [])
    } catch (error: any) {
      toast.error(error.message || 'Failed to load users')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchUser = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query')
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `/api/admin/users/search?type=${searchType}&query=${encodeURIComponent(searchQuery.trim())}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search user')
      }

      if (data.user) {
        setSearchResult(data)
        toast.success('User found successfully!')
      } else {
        setSearchResult(null)
        toast.info('No user found')
      }
    } catch (error: any) {
      toast.error(error.message)
      setSearchResult(null)
    } finally {
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResult(null)
  }

  const toggleUserStatus = async (activate: boolean) => {
    if (!searchResult?.user) return

    const action = activate ? 'activate' : 'deactivate'
    const confirmMessage = activate
      ? `Are you sure you want to activate ${searchResult.user.username}'s account?`
      : `Are you sure you want to deactivate ${searchResult.user.username}'s account? This will prevent them from logging in.`

    if (!confirm(confirmMessage)) {
      return
    }

    if (activate) {
      setIsReactivating(true)
    } else {
      setIsDeactivating(true)
    }

    try {
      const response = await fetch('/api/admin/users/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: searchResult.user.user_id,
          action: action
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} user`)
      }

      // Mettre à jour le résultat de recherche
      setSearchResult(prev => prev ? {
        ...prev,
        user: {
          ...prev.user,
          is_active: activate
        }
      } : null)

      // Mettre à jour la liste complète
      setAllUsers(prev => prev.map(user =>
        user.user_id === searchResult.user.user_id
          ? { ...user, is_active: activate }
          : user
      ))

      toast.success(`User ${action}d successfully!`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsDeactivating(false)
      setIsReactivating(false)
    }
  }

  const exportToCSV = () => {
    const usersToExport = showAllUsers ? filteredUsers : (searchResult ? [searchResult.user] : [])
    
    if (usersToExport.length === 0) {
      toast.error('No users to export')
      return
    }

    const csvContent = [
      ['User ID', 'Username', 'Email', 'Type', 'Status', 'Verified', 'Created At', 'Last Login', 'Phone', 'Country'],
      ...usersToExport.map(user => [
        user.user_id,
        user.username,
        user.email,
        user.user_type,
        user.is_active ? 'Active' : 'Inactive',
        user.is_verified ? 'Yes' : 'No',
        new Date(user.created_at).toLocaleDateString(),
        user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never',
        user.phone || 'N/A',
        user.country || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users_${showAllUsers ? 'all' : 'single'}_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filtrer les utilisateurs
  const filteredUsers = allUsers.filter(user => {
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && user.is_active) ||
      (filterStatus === 'inactive' && !user.is_active)
    
    const matchesType = filterType === 'all' || user.user_type === filterType
    
    return matchesStatus && matchesType
  })

  // Statistiques
  const stats = {
    total: allUsers.length,
    active: allUsers.filter(u => u.is_active).length,
    inactive: allUsers.filter(u => !u.is_active).length,
    clients: allUsers.filter(u => u.user_type === 'client').length,
    escorts: allUsers.filter(u => u.user_type === 'escort').length,
    admins: allUsers.filter(u => u.user_type === 'admin').length,
    verified: allUsers.filter(u => u.is_verified).length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading users...</p>
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
                <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">User Management</h1>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <p className="text-sm text-gray-400">
                      {searchResult
                        ? `Viewing user: ${searchResult.user.username}`
                        : `${stats.total} total users`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchAllUsers}
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
        {/* Search Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-900/30 p-4 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-green-500/10 p-4 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Active</p>
                <p className="text-3xl font-bold text-green-500">{stats.active}</p>
              </div>
              <div className="bg-red-500/10 p-4 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Inactive</p>
                <p className="text-3xl font-bold text-red-500">{stats.inactive}</p>
              </div>
              <div className="bg-purple-500/10 p-4 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Verified</p>
                <p className="text-3xl font-bold text-purple-500">{stats.verified}</p>
              </div>
              <div className="bg-blue-500/10 p-4 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Clients</p>
                <p className="text-3xl font-bold text-blue-500">{stats.clients}</p>
              </div>
              <div className="bg-pink-500/10 p-4 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Escorts</p>
                <p className="text-3xl font-bold text-pink-500">{stats.escorts}</p>
              </div>
              <div className="bg-yellow-500/10 p-4 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Admins</p>
                <p className="text-3xl font-bold text-yellow-500">{stats.admins}</p>
              </div>
              <div className="bg-cyan-500/10 p-4 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Today</p>
                <p className="text-3xl font-bold text-cyan-500">
                  {allUsers.filter(user => {
                    const today = new Date().toDateString()
                    const userDate = new Date(user.created_at).toDateString()
                    return today === userDate
                  }).length}
                </p>
              </div>
            </div>
          </div>

          {/* Search Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Search User
                </label>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setSearchType('email')}
                    className={`flex-1 py-2 rounded-lg transition ${searchType === 'email'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                      }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>By Email</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setSearchType('user_id')}
                    className={`flex-1 py-2 rounded-lg transition ${searchType === 'user_id'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                      }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Key className="w-4 h-4" />
                      <span>By User ID</span>
                    </div>
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchUser()}
                    placeholder={searchType === 'email' ? 'user@example.com' : 'Enter user ID...'}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-700 rounded"
                    >
                      <XCircle className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={searchUser}
                disabled={isSearching || !searchQuery.trim()}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search User
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-gray-700/50">
                <button
                  onClick={() => setShowAllUsers(!showAllUsers)}
                  className="w-full py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg flex items-center justify-center gap-2"
                >
                  {showAllUsers ? (
                    <>
                      <Eye className="w-4 h-4" />
                      Hide All Users
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      Show All Users ({allUsers.length})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Details / All Users */}
        {searchResult ? (
          /* User Details Card */
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">User Details</h2>
                <p className="text-sm text-gray-400">Found by {searchType === 'email' ? 'email' : 'user ID'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearSearch}
                  className="p-2 hover:bg-gray-700/50 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - User Info */}
              <div className="lg:col-span-2">
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                      {searchResult.user.profile_image ? (
                        <img
                          src={searchResult.user.profile_image}
                          alt={searchResult.user.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl text-white font-bold">
                          {searchResult.user.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">{searchResult.user.username}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${searchResult.user.user_type === 'admin'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : searchResult.user.user_type === 'escort'
                                ? 'bg-pink-500/20 text-pink-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}>
                            {searchResult.user.user_type.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${searchResult.user.is_active
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                            }`}>
                            {searchResult.user.is_active ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                          {searchResult.user.is_verified && (
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                              VERIFIED
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{searchResult.user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-gray-400" />
                          <code className="text-sm text-gray-400 font-mono bg-gray-900/50 px-2 py-1 rounded">
                            {searchResult.user.user_id}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(searchResult.user.user_id)
                              toast.success('User ID copied to clipboard!')
                            }}
                            className="text-xs text-gray-500 hover:text-gray-400"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-900/30 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-gray-400">Ads</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {searchResult.stats?.ads_count || searchResult.user.total_ads || 0}
                      </p>
                    </div>
                    <div className="bg-gray-900/30 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">Reviews</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {searchResult.stats?.reviews_count || searchResult.user.total_reviews || 0}
                      </p>
                    </div>
                    <div className="bg-gray-900/30 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-400">Bookings</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {searchResult.stats?.bookings_count || searchResult.user.total_bookings || 0}
                      </p>
                    </div>
                    <div className="bg-gray-900/30 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-gray-400">Rating</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {searchResult.user.average_rating?.toFixed(1) || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Contact Information</h4>
                      <div className="space-y-2">
                        {searchResult.user.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{searchResult.user.phone}</span>
                          </div>
                        )}
                        {searchResult.user.country && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{searchResult.user.country}</span>
                          </div>
                        )}
                        {searchResult.user.city && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{searchResult.user.city}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Account Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Created</span>
                          <span className="text-gray-300">{formatDate(searchResult.user.created_at)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Last Login</span>
                          <span className="text-gray-300">{formatDate(searchResult.user.last_login)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Subscription</span>
                          <span className={`px-2 py-1 rounded text-xs ${searchResult.user.subscription_status === 'active'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-500/20 text-gray-400'
                            }`}>
                            {searchResult.user.subscription_status?.toUpperCase() || 'NONE'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Actions */}
              <div>
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Account Actions</h4>
                  
                  <div className="space-y-4">
                    {/* Toggle Status Button */}
                    {searchResult.user.is_active ? (
                      <button
                        onClick={() => toggleUserStatus(false)}
                        disabled={isDeactivating}
                        className="w-full py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isDeactivating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                            Deactivating...
                          </>
                        ) : (
                          <>
                            <Ban className="w-5 h-5" />
                            Deactivate Account
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleUserStatus(true)}
                        disabled={isReactivating}
                        className="w-full py-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isReactivating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                            Activating...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Activate Account
                          </>
                        )}
                      </button>
                    )}

                    {/* Other Actions */}
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          // Action: View user ads
                          router.push(`/admin/ads?user_id=${searchResult.user.user_id}`)
                        }}
                        className="w-full py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View User Ads
                      </button>
                      <button
                        onClick={() => {
                          // Action: View user reviews
                          toast.info('View reviews feature coming soon')
                        }}
                        className="w-full py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg flex items-center justify-center gap-2"
                      >
                        <Star className="w-4 h-4" />
                        View Reviews
                      </button>
                      <button
                        onClick={() => {
                          // Action: Reset password
                          if (confirm(`Send password reset email to ${searchResult.user.email}?`)) {
                            toast.success('Password reset email sent!')
                          }
                        }}
                        className="w-full py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg flex items-center justify-center gap-2"
                      >
                        <Key className="w-4 h-4" />
                        Reset Password
                      </button>
                      <button
                        onClick={() => {
                          // Action: Delete account (dangerous)
                          if (confirm(`Permanently delete ${searchResult.user.username}'s account? This cannot be undone!`)) {
                            toast.error('Account deletion requires additional confirmation')
                          }
                        }}
                        className="w-full py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-lg flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </button>
                    </div>
                  </div>

                  {/* Status Info */}
                  <div className="mt-6 pt-6 border-t border-gray-700/50">
                    <h5 className="text-sm font-medium text-gray-400 mb-2">Account Status</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Status</span>
                        <div className="flex items-center gap-2">
                          {searchResult.user.is_active ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-green-400">Active</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-red-400">Inactive</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Verification</span>
                        <div className="flex items-center gap-2">
                          {searchResult.user.is_verified ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-green-400">Verified</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-400" />
                              <span className="text-red-400">Not Verified</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Type</span>
                        <span className="text-gray-300 capitalize">{searchResult.user.user_type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : showAllUsers ? (
          /* All Users Table */
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">All Users ({filteredUsers.length})</h2>
                  <p className="text-sm text-gray-400">Manage all registered users</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                </div>
              </div>

              {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Status</label>
                    <div className="flex gap-2">
                      {(['all', 'active', 'inactive'] as const).map(status => (
                        <button
                          key={status}
                          onClick={() => setFilterStatus(status)}
                          className={`px-4 py-2 rounded-lg transition capitalize ${filterStatus === status
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">User Type</label>
                    <div className="flex gap-2 flex-wrap">
                      {(['all', 'client', 'escort', 'admin'] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => setFilterType(type)}
                          className={`px-4 py-2 rounded-lg transition capitalize ${filterType === type
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">User</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Type</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Status</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Verified</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Created</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Last Login</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                            <UserX className="w-8 h-8 text-gray-500" />
                          </div>
                          <p className="text-gray-400 text-lg mb-2">No users found</p>
                          <p className="text-gray-500 text-sm">Try adjusting your filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.user_id} className="hover:bg-gray-700/30 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{user.username}</p>
                              <p className="text-xs text-gray-400 truncate max-w-xs">{user.email}</p>
                              <p className="text-xs text-gray-500 font-mono">{user.user_id.substring(0, 8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.user_type === 'admin'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : user.user_type === 'escort'
                                ? 'bg-pink-500/20 text-pink-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}>
                            {user.user_type.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className={user.is_active ? 'text-green-400' : 'text-red-400'}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {user.is_verified ? (
                            <div className="flex items-center gap-2 text-green-400">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm">Yes</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-red-400">
                              <XCircle className="w-4 h-4" />
                              <span className="text-sm">No</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-300">
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-300">
                            {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSearchQuery(user.email)
                                setSearchType('email')
                                setTimeout(searchUser, 100)
                              }}
                              className="p-2 hover:bg-gray-700/50 rounded-lg transition"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Send password reset to ${user.email}?`)) {
                                  toast.success('Password reset email sent!')
                                }
                              }}
                              className="p-2 hover:bg-gray-700/50 rounded-lg transition"
                              title="Reset Password"
                            >
                              <Key className="w-4 h-4 text-gray-400" />
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
        ) : (
          /* Empty State */
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-12 text-center">
            <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Search for a User</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Enter a user's email or user ID to view their details and manage their account.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowAllUsers(true)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg flex items-center justify-center gap-2"
              >
                <User className="w-5 h-5" />
                View All Users
              </button>
              <button
                onClick={() => {
                  setSearchType('email')
                  document.querySelector('input')?.focus()
                }}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Start Searching
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}