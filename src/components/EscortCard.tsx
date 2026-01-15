"use client";
import React, { useEffect, useState } from 'react';
import { 
  Heart, 
  Star, 
  Phone, 
  MessageCircle,  
  Clock, 
  User, 
  Shield,
  CheckCircle,
  Image as ImageIcon,
  Instagram,
  MessageSquare,
  MapPin,
  User as UserIcon,
  Weight,
  Ruler,
  Heart as HeartIcon,
  MessageCircle as MessageCircleIcon
} from 'lucide-react';
import Image from 'next/image';
import { PreviewAdData, ServiceKey } from '@/types/adsForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import FavoriteButton from './FavoriteButton';
import { categoryLabels } from '@/app/[locale]/constants';
import { serviceLabels } from '@/app/[locale]/constants/services';
import { useScopedI18n } from '../../locales/client';

interface EscortCardProps {
  ad: PreviewAdData
  showActions?: boolean;
  city?: string | string[];
  adId: string
}

export default function EscortCard({ ad, showActions = true, adId, city }: EscortCardProps) {
  const router = useRouter();
  const t = useScopedI18n('EscortCard' as never) as (key: string, vars?: Record<string, any>) => string;

  const [clientId, setClientId] = useState<string | null>(null);

  // Récupérer l'ID du client connecté
  useEffect(() => {
    const getCurrentUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setClientId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  const handleContactEscort = async () => {
     if (!clientId) {
        // Rediriger vers la page de connexion si non connecté
        router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
        return;
      }
    router.push(`/profile/chat/threads?escort=${ad.escort_id}`);
  };
  
  const [selectedImage, setSelectedImage] = useState(0);
  
  const activeServices = Object.entries(ad.services)
    .filter(([_, value]) => value)
    .map(([key]) => key as ServiceKey);
  const activeCategories = Object.entries(ad.categories)
    .filter(([_, value]) => value)
    .map(([key]) => categoryLabels[key]);

  const formatPrice = (price: number | undefined) => {
    if (!price) return t('priceOnRequest');
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: ad.currency || 'EUR'
    }).format(price);
  };

  const getStatusColor = () => {
    if (ad.online) return 'bg-green-500';
    return 'bg-gray-500';
  };

  const getStatusText = () => {
    if (ad.online) return t('online');
    return t('offline');
  };

  const getMinimumRate = () => {
    const rates = [
      ad.rates.thirtyMinutes,
      ad.rates.oneHour,
      ad.rates.twoHours,
      ad.rates.fullNight
    ].filter(rate => rate !== undefined && rate > 0);
    
    return rates.length > 0 ? Math.min(...rates as number[]) : 0;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('recently');
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const whatsappNumber = ad.contacts.whatsapp || ad.contacts.phoneNumber;

  const getCitiesArray = (): string[] => {
    if (!city) return [];
    
    if (Array.isArray(city)) {
      return city;
    } else if (typeof city === 'string') {
      if (city.includes(',') || city.includes(';') || city.includes('|')) {
        return city.split(/[;,|]/).map(c => c.trim()).filter(c => c);
      } else {
        return [city];
      }
    }
    
    return [];
  };

  const formatCityName = (cityName: string): string => {
    return cityName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const cities = getCitiesArray();
  const hasCities = cities.length > 0;

  // Fonction pour convertir la taille cm -> ft
  const convertCmToFeet = (cm: number): string => {
    const feet = Math.floor(cm / 30.48);
    const inches = Math.round((cm % 30.48) / 2.54);
    return `${feet}'${inches}"`;
  };

  // Fonction pour convertir le poids kg -> lbs
  const convertKgToLbs = (kg: number): number => {
    return Math.round(kg * 2.20462);
  };

  return (
    <div className=" bg-gradient-to-br from-gray-900 to-black rounded-xl border border-pink-400/30 overflow-hidden hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 group">
      <div className="flex flex-row">
        {/* Image à gauche (~40%) */}
        <div className="w-1/2 relative h-auto bg-gradient-to-br from-gray-800 to-gray-900">
          {ad.images && ad.images.length > 0 ? (
            <>
              <div className="relative h-full w-full">
                <Link href={`/escorts/${cities[0] || 'france'}/${adId}`}>
                  <Image
                    src={ad.images[selectedImage]}
                    alt={ad.title || ad.username}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </Link>
                
                {/* Badges sur l'image */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {ad.verified && (
                    <div className="bg-green-600/90 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {t('verified')}
                    </div>
                  )}
                  {ad.online && (
                    <div className="bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {t('online')}
                    </div>
                  )}
                </div>

                {/* Navigation images */}
                {ad.images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {ad.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${selectedImage === index ? 'bg-white' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                )}

                {/* Compte images */}
                <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  {ad.images.length}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-pink-500/10 to-purple-600/10 flex items-center justify-center">
              <div className="text-center">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-xs">{t('noPhotos')}</p>
              </div>
            </div>
          )}

        </div>

        {/* Contenu à droite (~60%) */}
        <div className="h-100 w-1/2 p-6 flex flex-col">
          {/* En-tête avec nom et badge vérifié */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-pink-300">
                  {ad.title || ad.username}
                </h3>
                {ad.verified && (
                  <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                    {t('verifiedBadge')}
                  </div>
                )}
              </div>
              
              {/* Localisation avec icône */}
              {hasCities && (
                <div className="flex items-center gap-2 text-gray-300 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs">{t('escortIn')} {cities.map(c => formatCityName(c)).join(', ')}</span>
                </div>
              )}
            </div>
            
            {/* Rating */}
            {ad.rating && (
              <div className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-medium">{ad.rating.toFixed(1)}</span>
                {ad.reviews && (
                  <span className="text-xs text-gray-400">({ad.reviews})</span>
                )}
              </div>
            )}
          </div>

          {/* Liste des informations avec séparateurs */}
          <div className=" mb-6 max-sm:text-sm">
            {/* Âge */}
            <div className="flex items-center justify-between border-b border-gray-700/50">
              <div className="flex items-center gap-2">
                <span className="text-gray-300">{t('age')}</span>
              </div>
              <span className="text-white font-medium  max-sm:text-xs">{ad.physicalDetails.age} {t('years')}</span>
            </div>
            
            {/* Bonnet */}
            {ad.physicalDetails.bust && (
              <div className="flex items-center justify-between border-b border-gray-700/50 pt-3">
                <span className="text-gray-300">{t('bust')}</span>
                <span className="text-white font-medium max-sm:text-xs">{ad.physicalDetails.bust}</span>
              </div>
            )}
            
            {/* Taille */}
            {ad.physicalDetails.height && (
              <div className="flex items-center justify-between border-b border-gray-700/50 pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">{t('height')}</span>
                </div>
                <div className="text-white font-medium text-right max-sm:text-xs">
                  <div>{ad.physicalDetails.height} {t('cm')} / {convertCmToFeet(Number(ad.physicalDetails.height))}</div>
                </div>
              </div>
            )}
            
            {/* Poids */}
            {ad.physicalDetails.weight && (
              <div className="flex items-center justify-between border-b border-gray-700/50 pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">{t('weight')}</span>
                </div>
                <div className="text-white font-medium text-right max-sm:text-xs">
                  <div>{ad.physicalDetails.weight} {t('kg')} / {convertKgToLbs(Number(ad.physicalDetails.weight))} {t('lbs')}</div>
                </div>
              </div>
            )}
            
            {/* Services */}
            {activeServices.length > 0 && (
              <div>
                {activeServices.slice(0, 2).map(key => (
                  <div
                    key={key}
                    className="flex items-center justify-between border-b border-gray-700/50 pt-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">{serviceLabels[key]}</span>
                    </div>
                    <div className="text-white font-medium text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                          ad.services[key]
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-red-900/30 text-red-400'
                        }`}
                      >
                        {ad.services[key] ? t('yes') : t('no')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Boutons en bas à droite */}
          <div className="mt-auto flex justify-end gap-3">
            {/* Bouton Favorite */}
            <FavoriteButton 
              adId={ad.pending_ad_id}
            />
            
            {/* Bouton Live Chat */}
            <button
              onClick={handleContactEscort}
              className="text-xs flex flex-col items-center gap-2 p-1 border border-pink-400 text-pink-300 rounded-lg hover:bg-pink-400/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageSquare className="w-3 h-3" />
              {t('contact')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}