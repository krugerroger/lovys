'use client';

// components/CategoryAdsGrid.tsx
import { useState } from 'react';
import EscortCard from '@/components/EscortCard';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import { PreviewAdData } from '@/types/adsForm';

const PAGE_SIZE = 10;

interface CategoryAdsGridProps {
  ads: PreviewAdData[];
  categoryName: string;
  locale: string;
}

export default function CategoryAdsGrid({ ads, categoryName, locale }: CategoryAdsGridProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);

  const visibleAds = ads.slice(0, visibleCount);
  const hasMore = visibleCount < ads.length;

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + PAGE_SIZE, ads.length));
      setIsLoading(false);
    }, 300);
  };

  return (
    <>
      {/* Compteur */}
      <p className="text-sm text-gray-400 mb-4">
        Affichage de{' '}
        <span className="text-white font-semibold">{visibleAds.length}</span>{' '}
        sur{' '}
        <span className="text-white font-semibold">{ads.length}</span>{' '}
        annonces
      </p>

      {/* Grid des annonces */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visibleAds.map((ad) => (
          <div key={ad.pending_ad_id} className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200" />
            <div className="relative">
              <EscortCard
                ad={ad}
                adId={ad.pending_ad_id}
                city={ad.location.city}
                showActions={true}
              />
              {/* Badge de catégorie */}
              <div className="absolute top-3 left-3 z-10">
                <div className="px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm rounded-full text-xs font-medium text-white flex items-center gap-1.5 border border-pink-500/30 shadow-lg">
                  <Check className="w-3 h-3 text-green-400" />
                  {categoryName}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bouton "Voir plus" */}
      {hasMore && (
        <div className="flex flex-col items-center gap-3 pt-10">
          {/* Barre de progression */}
          <div className="w-full max-w-xs bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-linear-to-r from-pink-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(visibleCount / ads.length) * 100}%` }}
            />
          </div>

          <p className="text-xs text-gray-500">
            {visibleCount} / {ads.length}
          </p>

          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-3 bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-pink-900/40 hover:shadow-pink-900/60 hover:-translate-y-0.5 active:translate-y-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Chargement...</span>
              </>
            ) : (
              <>
                <span>Voir plus</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Message fin de liste */}
      {!hasMore && ads.length > PAGE_SIZE && (
        <div className="flex flex-col items-center gap-2 mt-10">
          <div className="w-full max-w-xs bg-gray-700 rounded-full h-1.5">
            <div className="bg-linear-to-r from-pink-500 to-purple-500 h-1.5 rounded-full w-full" />
          </div>
          <p className="text-sm text-gray-400 mt-1">
            ✓ Toutes les {ads.length} annonces affichées
          </p>
        </div>
      )}
    </>
  );
}