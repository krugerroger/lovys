'use client';

// components/AdsGrid.tsx
import { useState } from 'react';
import EscortCard from '@/components/EscortCard';
import { Crown, TrendingUp, Star, ChevronDown, Loader2 } from 'lucide-react';
import { PreviewAdData } from '@/types/adsForm';

const PAGE_SIZE = 10;

// Composant pour afficher le badge de rang
function RankBadge({ rank, total }: { rank: number; total: number }) {
  const getRankColor = () => {
    if (rank === 1) return 'from-yellow-500 to-amber-500 text-gray-900';
    if (rank === 2) return 'from-gray-400 to-gray-600 text-white';
    if (rank === 3) return 'from-amber-700 to-amber-900 text-white';
    if (rank <= 10) return 'from-blue-500 to-indigo-600 text-white';
    if (rank <= 20) return 'from-purple-500 to-purple-700 text-white';
    return 'from-gray-700 to-gray-900 text-gray-300';
  };

  const getRankIcon = () => {
    if (rank === 1) return <Crown className="w-3 h-3" />;
    if (rank <= 3) return <TrendingUp className="w-3 h-3" />;
    if (rank <= 10) return <Star className="w-3 h-3" fill="currentColor" />;
    return null;
  };

  const getRankText = () => {
    if (rank === 1) return 'TOP 1';
    if (rank === 2) return 'TOP 2';
    if (rank === 3) return 'TOP 3';
    return `#${rank}`;
  };

  return (
    <div className="absolute top-3 left-3 z-20 flex flex-col items-center gap-1">
      <div className={`bg-linear-to-br ${getRankColor()} px-3 py-1.5 rounded-full font-bold text-sm flex items-center gap-1 shadow-lg shadow-black/30`}>
        {getRankIcon()}
        <span>{getRankText()}</span>
      </div>
      <div className="text-xs text-white bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-full">
        {rank}/{total}
      </div>
    </div>
  );
}

// PreviewAdData enrichi avec les champs de rang ajoutés côté serveur
type RankedAd = PreviewAdData & {
  rank: number;
  totalAds: number;
};

interface AdsGridProps {
  ads: RankedAd[];
  city: string;
  loadMoreLabel: string;
  showingLabel: string;
  ofLabel: string;
  adsLabel: string;
  boostedLabel: string;
  addedOnLabel: string;
}

export default function AdsGrid({
  ads,
  city,
  loadMoreLabel,
  showingLabel,
  ofLabel,
  adsLabel,
  boostedLabel,
  addedOnLabel,
}: AdsGridProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);

  const visibleAds = ads.slice(0, visibleCount);
  const hasMore = visibleCount < ads.length;

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simule un léger délai pour un meilleur ressenti UX
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + PAGE_SIZE, ads.length));
      setIsLoading(false);
    }, 300);
  };

  return (
    <>
      {/* Compteur d'annonces affichées */}
      <p className="text-sm text-gray-400 mb-4">
        {showingLabel}{' '}
        <span className="text-white font-semibold">{visibleAds.length}</span>{' '}
        {ofLabel}{' '}
        <span className="text-white font-semibold">{ads.length}</span>{' '}
        {adsLabel}
      </p>

      {/* Grid des annonces avec rang */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visibleAds.map((ad) => (
          <div key={ad.pending_ad_id} className="relative">
            <RankBadge rank={ad.rank} total={ad.totalAds} />
            <EscortCard
              city={city}
              adId={ad.pending_ad_id}
              ad={ad}
              showActions={true}
            />

            {/* Informations supplémentaires */}
            <div className="mt-2 flex justify-between items-center text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  ad.rank <= 3
                    ? 'bg-amber-900/30 text-amber-300 border border-amber-800/50'
                    : ad.rank <= 10
                    ? 'bg-blue-900/30 text-blue-300 border border-blue-800/50'
                    : 'bg-gray-800 text-gray-400 border border-gray-700'
                }`}>
                  Position {ad.rank}/{ads.length}
                </span>
                {ad.city_boosted_at?.[city.toLowerCase()] && (
                  <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded-full text-xs border border-green-800/50">
                    {boostedLabel}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {addedOnLabel} {new Date(ad.created_at).toLocaleDateString()}
              </span>
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
              className="bg-linear-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(visibleCount / ads.length) * 100}%` }}
            />
          </div>

          <p className="text-xs text-gray-500">
            {visibleCount} / {ads.length}
          </p>

          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-3 bg-linear-to-r from-purple-700 to-pink-700 hover:from-purple-600 hover:to-pink-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 hover:-translate-y-0.5 active:translate-y-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Chargement...</span>
              </>
            ) : (
              <>
                <span>{loadMoreLabel}</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Message quand toutes les annonces sont affichées */}
      {!hasMore && ads.length > PAGE_SIZE && (
        <div className="flex flex-col items-center gap-2 mt-10">
          <div className="w-full max-w-xs bg-gray-700 rounded-full h-1.5">
            <div className="bg-linear-to-r from-purple-500 to-pink-500 h-1.5 rounded-full w-full" />
          </div>
          <p className="text-sm text-gray-400 mt-1">
            ✓ Toutes les {ads.length} annonces affichées
          </p>
        </div>
      )}
    </>
  );
}