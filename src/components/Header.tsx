"use client";
import { Heart, LogOut, Star, User, Menu, X, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/app/[locale]/context/userContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useScopedI18n } from "../../locales/client";
import { LocaleSelect } from "./LocaleSelect";

export default function Header() {
  const router = useRouter();
  const {user, logout} = useUser();
  const t = useScopedI18n('Header' as never) as (key: string, vars?: Record<string, any>) => string;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-gray-800 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-gray-700">
        {/* Logo section */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:cursor-pointer">
          <div className="text-2xl sm:text-3xl"></div>
          <div>
            <Image 
              src="/lovira1.png" 
              alt={t('logoAlt')} 
              width={120} 
              height={60} 
            />
          </div>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <LocaleSelect />
          <Link 
            href="/profile/favorites" 
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition text-white hover:cursor-pointer"
            title={t('buttons.favorites')}
          >
            <Star className="w-4 h-4" />
            <span className="text-sm hidden lg:inline">{t('buttons.favorites')}</span>
          </Link>
          <Link
            href={user && user.user_type === 'escort' ? '/manage/chat/threads' : user && user.user_type !== 'client' ? '/manage/profile' : '/login'}
            className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-pink-300 text-gray-900 rounded hover:bg-pink-400 transition font-medium hover:cursor-pointer"
          >
            <User className="w-4 h-4" />
            {
              user && user.user_type === 'escort' ? 
                <>
                  <span className="text-sm">{t('buttons.advertise')}</span>
                  <span className="hidden lg:inline"> {t('buttons.advertiseFor')} $5</span>
                </> : 
              user && user.user_type === 'client' ? 
              <span className="text-sm hidden md:inline">{t('buttons.profile')}</span> :
              <span className="text-sm hidden md:inline">{t('buttons.login')}</span>
             }
          </Link>
          {user && (
            <button 
              onClick={() => logout()} 
              className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition text-white hover:cursor-pointer"
              title={t('buttons.logout')}
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => {
              if (user && user.user_type === 'escort') {
                router.push('/manage/ads/form');
              } else if (user && user.user_type !== 'escort') {
                router.push('/manage/profile');
              } else {
                router.push('/login');
              }
            }}
            className="flex items-center gap-1 px-3 py-2 bg-pink-300 text-gray-900 rounded hover:bg-pink-400 transition font-medium text-sm"
          >
            <User className="w-4 h-4" />
            <span>
              {user && user.user_type === 'escort' 
                ? t('buttons.advertise') 
                : user && user.user_type === 'client' 
                ? t('buttons.profile') 
                : t('buttons.login')
              }
            </span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition text-white"
            title={mobileMenuOpen ? t('menu.close') : t('menu.open')}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-b border-gray-700 px-4 py-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
              <LocaleSelect />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Link 
                href="/profile/favorites" 
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition text-white justify-center"
              >
                <Star className="w-4 h-4" />
                <span>{t('buttons.favorites')}</span>
              </Link>
              {user && 
              <Link 
                href={user.user_type === 'escort' ? '/manage/chat/threads' : user.user_type === 'client' ? '/profile/chat/threads' : '/login'} 
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition text-white justify-center"
              >
                <Heart className="w-4 h-4" />
                <span>{t('buttons.chat')}</span>
              </Link>
              }
            </div>
            
            {user && 
            <>
              <Link 
                href="/profile/chat/threads" 
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition text-white justify-center mt-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span>{t('buttons.messages')}</span>
              </Link>
              <button 
                onClick={() => logout()} 
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition text-white justify-center mt-2"
              >
                <LogOut className="w-5 h-5" />
                <span>{t('buttons.logout')}</span>
              </button>
            </>}
          </div>
        </div>
      )}
    </>
  );
}