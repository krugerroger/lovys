// app/admin/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  AlertTriangle, 
  Shield,
  LogOut,
  Settings,
  Bell,
  Search,
  Filter
} from 'lucide-react'
import { toast } from 'sonner'
import { useUser } from '@/app/[locale]/context/userContext'

export default function AdminDashboard() {
  const {user, logout} = useUser()
  const router = useRouter()
  const [adminData, setAdminData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEscorts: 0,
    pendingAds: 0,
    totalRevenue: 0,
  })

  // useEffect(() => {
  //   fetchAdminData()
  //   fetchStats()
  // }, [])

  // const fetchAdminData = async () => {
  //   try {
  //     const response = await fetch('/api/admin/check')
  //     const data = await response.json()

  //     if (!response.ok || !data.isAdmin) {
  //       router.push('/adminLogin')
  //       return
  //     }

  //     setAdminData(data.user)
  //   } catch (error) {
  //     router.push('/adminLogin')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // const fetchStats = async () => {
  //   try {
  //     const response = await fetch('/api/admin/stats')
  //     const data = await response.json()
  //     if (response.ok) {
  //       setStats(data)
  //     }
  //   } catch (error) {
  //     console.error('Error fetching stats:', error)
  //   }
  // }

  const handleLogout = async () => {
    try {
      logout()
      router.push('/adminLogin')
      toast.success('Logged out successfully')
      console.log(user)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-900">
  //       <div className="text-center">
  //         <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
  //         <p className="text-gray-400">Loading admin panel...</p>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Top Navigation */}
      <nav className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                  <p className="text-xs text-gray-400">Dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-white transition">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user?.email}</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg flex items-center gap-2 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-sm text-gray-400">Total</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.totalUsers.toLocaleString()}</h3>
            <p className="text-gray-400">Registered Users</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-sm text-gray-400">Active</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.totalEscorts.toLocaleString()}</h3>
            <p className="text-gray-400">Escorts</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-sm text-gray-400">Pending</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.pendingAds}</h3>
            <p className="text-gray-400">Ads for Review</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-sm text-gray-400">Revenue</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">${stats.totalRevenue.toLocaleString()}</h3>
            <p className="text-gray-400">Total Revenue</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push('/admin/ads/pending')}
            className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-2xl p-6 text-left transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="w-8 h-8 text-white" />
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">New</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Review Ads</h3>
            <p className="text-blue-100">Approve or reject pending advertisements</p>
          </button>

          <button
            onClick={() => router.push('/admin/users')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl p-6 text-left transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-white" />
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{stats.totalUsers}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Manage Users</h3>
            <p className="text-purple-100">View and manage all user accounts</p>
          </button>

          <button
            onClick={() => router.push('/admin/analytics')}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl p-6 text-left transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Live</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Analytics</h3>
            <p className="text-emerald-100">View platform statistics and metrics</p>
          </button>
        </div>
      </div>
    </div>
  )
}