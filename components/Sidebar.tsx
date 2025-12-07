"use client"

import { Plus, Menu, X, Settings, CreditCard, MessageSquare, LogOut, Bell } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useUser } from '@/app/context/userContext';
import { useRouter } from 'next/navigation';

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const { user, logout } = useUser();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

const handleSignOut = async () => {
  try {
    setIsLoggingOut(true)
    await logout() // Utilise la fonction du contexte
    // La redirection est déjà gérée dans le contexte
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    alert('Une erreur est survenue lors de la déconnexion')
  } finally {
    setIsLoggingOut(false)
  }
}

  const menuItems = [
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', href: '/manage/user/settings' },
    { icon: <CreditCard className="w-5 h-5" />, label: 'Payments history', href: '/manage/payments/history' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'Chat', href: '/manage/chat/threads' },
  ];

  const topMenuItems = [
    { icon: <Plus className="w-4 h-4" />, label: 'Post add', href: '/manage/ads/form' },
    { icon: '💳', label: `${user?.balance} $`, href: '/manage/payments' },
    { icon: '🚫', label: 'Black list', href: '/manage/blacklist' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop & Mobile */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-40
          w-60 bg-linear-to-b from-cyan-500 to-cyan-600 text-white 
          flex flex-col transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-4 text-xl font-semibold border-b border-cyan-400 flex items-center justify-between">
          <Link href="/">Lovys</Link>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 hover:bg-cyan-400 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* User Info */}
        {user && (
          <div className="px-4 py-3 border-b border-cyan-400/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-300 flex items-center justify-center">
                  <span className="text-lg font-bold text-cyan-700">
                    {(user.username || 'U').charAt(0).toUpperCase()}
                  </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.username}</p>
                <p className="text-sm text-cyan-100 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Language Selector */}
        <div className="px-3 py-2">
          <button className="w-full bg-cyan-400 hover:bg-cyan-300 rounded-lg px-4 py-3 flex items-center gap-2 transition">
            <span className="text-lg">🇺🇸</span>
            <span className="font-medium">English (US)</span>
          </button>
        </div>
        
        {/* New Advert Button */}
        <div className="px-3 py-4">
          <Link 
            href="/manage/ads/form" 
            className="w-full bg-white text-gray-700 rounded-lg px-4 py-8 flex flex-col items-center justify-center gap-3 hover:bg-gray-50 transition border-2 border-dashed border-gray-300"
            onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
          >
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <span className="font-medium text-sm">New Advert</span>
          </Link>
        </div>
        
        {/* Menu Items */}
        <div className="flex-1 px-3 py-2 space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="w-full bg-cyan-400 hover:bg-cyan-300 rounded-lg px-4 py-3 flex items-center gap-3 text-left font-medium transition"
              onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        
        {/* Logout Button */}
        <div className="p-3 border-t border-cyan-400/50">
          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-400 rounded-lg px-4 py-3 flex items-center gap-3 text-left font-medium transition disabled:cursor-not-allowed"
          >
            <div className="relative">
              <LogOut className="w-5 h-5" />
              {isLoggingOut && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <span>{isLoggingOut ? 'Déconnexion...' : 'Sign out'}</span>
          </button>
        </div>
      </div>

      {/* Overlay pour mobile */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-linear-to-r from-cyan-600 to-cyan-700 border-b border-cyan-400/30 shadow-sm">
          <div className="px-4 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo et navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 -ml-1 text-white hover:bg-white/10 rounded-lg transition"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Actions rapides */}
            <div className="flex items-center gap-2">
              
              {topMenuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`
                    relative flex items-center gap-2 px-4 py-2.5
                    text-white font-medium rounded-lg transition-all duration-200 hover:bg-white/10 group`}
                >
                  {typeof item.icon === 'string' ? (
                    <span className="text-lg">{item.icon}</span>
                  ) : (
                    <div className="scale-90 group-hover:scale-100 transition-transform">
                      {item.icon}
                    </div>
                  )}
                  <span className="sm:inline">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}