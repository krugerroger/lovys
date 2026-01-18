"use client"

import { Plus, Menu, X, Settings, CreditCard, MessageSquare, LogOut, Bell, Eye, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useUser } from '@/app/[locale]/context/userContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import { useScopedI18n } from '../../locales/client';
import { LocaleSelect } from './LocaleSelect';

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const { user, pendingAds, logout } = useUser();
  const router = useRouter();
  const t = useScopedI18n('Sidebar' as never) as (key: string, vars?: Record<string, any>) => string;
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      toast.success(t('messages.signOutSuccess'));
      router.push('/Login');
    } catch (error) {
      console.error(t('messages.signOutError'), error);
      toast.error(t('messages.signOutError'));
    } finally {
      setIsLoggingOut(false);
    }
  }

  const menuItems = [
    { icon: <Settings className="w-5 h-5" />, label: t('navigation.settings'), href: '/manage/user/settings' },
    { icon: <CreditCard className="w-5 h-5" />, label: t('navigation.paymentsHistory'), href: '/manage/payments/history' },
    { icon: <MessageSquare className="w-5 h-5" />, label: t('navigation.chat'), href: '/manage/chat/threads' },
  ];

  const topMenuItems = [
    { icon: <Plus className="w-4 h-4" />, label: t('topMenu.postAd'), href: '/manage/ads/form' },
    { icon: '💳', label: `${user?.balance} $`, href: '/manage/payments' },
    { icon: '🚫', label: t('navigation.blacklist'), href: '/manage/blacklist' },
  ];

  // Regrouper les annonces par ville
  const groupedAdsByCity = useMemo(() => {
    if (!pendingAds || pendingAds.length === 0) return {};

    const grouped: Record<string, { count: number; ads: typeof pendingAds }> = {};

    pendingAds.forEach(ad => {
      const city = ad.location?.city;
      if (!city) return;

      const normalizedCity = String(city).toLowerCase().trim();
      
      if (!grouped[normalizedCity]) {
        grouped[normalizedCity] = { count: 0, ads: [] };
      }
      
      grouped[normalizedCity].count += 1;
      grouped[normalizedCity].ads.push(ad);
    });

    return grouped;
  }, [pendingAds]);

  const formatCityName = (city: string): string => {
    if (!city) return t('ads.unknownCity');
    return city
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleCityClick = (city: string) => {
    const cityData = groupedAdsByCity[city.toLowerCase()];
    if (cityData && cityData.ads.length === 1) {
      const ad = cityData.ads[0];
      router.push(`/manage/ads/${city}/${ad.pending_ad_id}`);
    } else {
      router.push(`/manage/ads/${city}`);
    }
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const getCitySlug = (city: string): string => {
    return city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop & Mobile */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-40
          w-60 bg-gradient-to-b from-blue-900 to-purple-600 text-white 
          flex flex-col transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-4 text-xl font-semibold border-b border-pink-400 flex items-center justify-between">
          <Link href="/">
            <Image 
              loading="lazy" 
              src="/lovira1.png" 
              alt={t('logoAlt')} 
              width={120} 
              height={60} 
            />
          </Link>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 hover:bg-pink-400 rounded"
            title={t('buttons.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* User Info */}
        {user && (
          <div className="px-4 py-3 border-b border-pink-400/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-300 flex items-center justify-center">
                <span className="text-lg font-bold text-pink-700">
                  {(user.username || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.username}</p>
                <p className="text-sm text-pink-100 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
        <LocaleSelect/>
        
        {/* New Advert Button */}       
        <div className="px-3 py-4">
          <Link 
            href="/manage/ads/form" 
            className="w-full bg-white text-gray-700 rounded-lg px-4 py-5 flex flex-col items-center justify-center gap-3 hover:bg-gray-50 transition border-2 border-dashed border-gray-300"
            onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
          >
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <span className="font-medium text-sm">{t('navigation.newAdvert')}</span>
          </Link>
        </div>
        
        {/* Liste des annonces par ville */}
        {Object.keys(groupedAdsByCity).length > 0 ? (
          <div className="flex-1 px-3 py-2 space-y-2 overflow-y-auto">
            <div className="text-xs font-semibold text-pink-200 uppercase tracking-wider px-1 mb-2">
              {t('navigation.myAdsByCity')}
            </div>
            {Object.entries(groupedAdsByCity).map(([city, data]) => {
              const formattedCity = formatCityName(city);
              const citySlug = getCitySlug(city);
              
              return (
                <div key={city} className="space-y-1">
                  {/* Bouton pour la ville */}
                  <button
                    onClick={() => handleCityClick(city)}
                    className="w-full bg-white text-black hover:bg-pink-300 rounded-lg px-4 py-2 flex items-center justify-between text-left font-medium transition"
                    title={`${t('buttons.viewDetails')} ${formattedCity}`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-pink-500" />
                      <span>{formattedCity}</span>
                    </div>
                    <span className="bg-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {data.count}
                    </span>
                  </button>
                  
                  {/* Liste des annonces dans cette ville */}
                  {data.ads.length > 1 && (
                    <div className="ml-4 pl-2 border-l border-pink-300/30 space-y-1">
                      {data.ads.slice(0, 3).map((ad) => (
                        <Link
                          key={ad.pending_ad_id}
                          href={`/manage/ads/${citySlug}/${ad.pending_ad_id}`}
                          className="block text-xs text-pink-100 hover:text-white hover:bg-pink-400/30 px-3 py-1 rounded truncate"
                          onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                          title={ad.title || t('ads.noTitle')}
                        >
                          {ad.title || `${t('ads.adNumber')}${ad.pending_ad_id.slice(0, 8)}`}
                        </Link>
                      ))}
                      {data.ads.length > 3 && (
                        <div className="text-xs text-pink-200/70 px-3 py-1">
                          +{data.ads.length - 3} {t('ads.more')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 px-3 py-2">
            <div className="text-center text-pink-200/70 text-sm py-4">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full border-2 border-dashed border-pink-300 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <p>{t('navigation.noAdsYet')}</p>
              <p className="text-xs mt-1">{t('navigation.getStarted')}</p>
            </div>
          </div>
        )}
        
        {/* Menu Items */}
        <div className="px-3 py-2 space-y-2 border-t border-pink-400/50">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item?.href || ""}
              className="w-full bg-pink-400 hover:bg-pink-300 rounded-lg px-4 py-2 flex items-center gap-3 text-left max-sm:text-sm font-medium transition"
              onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
              title={item?.label}
            >
              {item?.icon}
              <span>{item?.label}</span>
            </Link>
          ))}
        </div>
        
        {/* Logout Button */}
        <div className="p-3 border-t border-pink-400/50">
          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-400 rounded-lg px-4 py-3 flex items-center gap-3 text-left font-medium transition disabled:cursor-not-allowed"
            title={isLoggingOut ? t('buttons.signingOut') : t('buttons.signOut')}
          >
            <div className="relative">
              <LogOut className="w-5 h-5" />
              {isLoggingOut && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <span>{isLoggingOut ? t('buttons.signingOut') : t('buttons.signOut')}</span>
          </button>
        </div>
      </div>

      {/* Overlay pour mobile */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="lg:hidden fixed inset-0 z-30 bg-opacity-50 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 border-b border-pink-400/30 shadow-sm">
          <div className="px-4 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo et navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 -ml-1 text-white hover:bg-white/10 rounded-lg transition"
                title={t('buttons.toggleSidebar')}
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Actions rapides */}
            <div className="flex items-center gap-2 max-sm:text-xs">
              {topMenuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`
                    relative flex items-center gap-2 px-4 py-2.5
                    text-white font-medium rounded-lg transition-all duration-200 hover:bg-white/10 group`}
                  title={item.label}
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

          {/* BANNER PROMOTIONNEL - AJOUTÉ ICI */}
<div className="bg-gradient-to-r  border-t border-yellow-500/30">
  <div className="px-4 lg:px-8 py-2">
    <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-center">
      <div className="flex items-center gap-2">
        <span className="text-lg">🎉</span>
        <span className="font-bold text-gray-900 text-sm sm:text-base">
          {t('PromoBanner.title')}
        </span>
        <span className="text-lg">🎉</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-800 text-sm sm:text-base">
          <span className="font-semibold">{t('PromoBanner.message')}</span>
          {" "}
          <span className="font-bold text-red-600">{t('PromoBanner.date')}</span>
        </span>
        <span className="hidden sm:inline text-lg">✨</span>
      </div>
    </div>
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