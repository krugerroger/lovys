// app/[locale]/escorts/[city]/page.tsx
import EscortCard from '@/components/EscortCard';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Crown, TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';
import { getScopedI18n } from '../../../../../locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import { Metadata } from 'next';

// Fonction pour formater le slug en nom de ville
const formatCityName = (slug: string) => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Liste des villes populaires
const popularCitySlugs = [
  "paris", "lyon", "marseille", "nice", "toulouse", "bordeaux", 
  "lille", "nantes", "strasbourg", "montpellier", "rennes", "grenoble",
  "aix-en-provence", "ajaccio", "amiens", "angers", "annecy",
  "avignon", "besancon", "brest", "caen", "clermont-ferrand", "cannes",
  "dijon", "le-havre", "le-mans", "limoges", "metz", "mulhouse",
  "nancy", "orleans", "perpignan", "reims", "rouen", "saint-denis",
  "toulon", "tours", "valence"
];

interface PageProps {
  params: Promise<{ locale: string; city: string }>;
}

// Fonction serveur pour récupérer les données
async function getCityAds(cityName: string) {
  try {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user?.id;
    
    const { data: ads, error } = await supabase
      .from('pending_ads')
      .select('*, city_boosted_at')
      .eq('status', 'approved')
      .ilike('location->>city', `%${cityName}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    let filteredAds = ads || [];
    
    if (currentUserId && filteredAds.length > 0) {
      const escortIds = filteredAds.map(ad => ad.escort_id).filter(id => id);
      
      if (escortIds.length > 0) {
        const { data: blacklistEntries } = await supabase
          .from('escort_blacklist')
          .select('escort_id')
          .eq('blocked_user_id', currentUserId)
          .in('escort_id', escortIds);
        
        if (blacklistEntries && blacklistEntries.length > 0) {
          const blockedEscortIds = new Set(blacklistEntries.map(entry => entry.escort_id));
          filteredAds = filteredAds.filter(ad => 
            !ad.escort_id || !blockedEscortIds.has(ad.escort_id)
          );
        }
      }
    }

    const normalizedCity = cityName.toLowerCase();
    
    const sortedAds = [...filteredAds].sort((a, b) => {
      const aBoostedAt = a.city_boosted_at?.[normalizedCity];
      const bBoostedAt = b.city_boosted_at?.[normalizedCity];
      
      if (aBoostedAt && bBoostedAt) {
        const aBoostTime = new Date(aBoostedAt).getTime();
        const bBoostTime = new Date(bBoostedAt).getTime();
        return bBoostTime - aBoostTime;
      }
      
      if (aBoostedAt && !bBoostedAt) return -1;
      if (!aBoostedAt && bBoostedAt) return 1;
      
      const aCreatedTime = new Date(a.created_at).getTime();
      const bCreatedTime = new Date(b.created_at).getTime();
      return bCreatedTime - aCreatedTime;
    });

    const adsWithRank = sortedAds.map((ad, index) => ({
      ...ad,
      rank: index + 1,
      totalAds: sortedAds.length
    }));

    return adsWithRank;
    
  } catch (error) {
    console.error('Error fetching city ads:', error);
    return [];
  }
}

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
    <div className={`absolute top-3 left-3 z-20 flex flex-col items-center gap-1`}>
      <div className={`bg-gradient-to-br ${getRankColor()} px-3 py-1.5 rounded-full font-bold text-sm flex items-center gap-1 shadow-lg shadow-black/30`}>
        {getRankIcon()}
        <span>{getRankText()}</span>
      </div>
      <div className="text-xs text-white bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-full">
        {rank}/{total}
      </div>
    </div>
  );
}

// Générer les chemins statiques
export async function generateStaticParams() {
  // Générer pour toutes les locales et villes
  const locales = ['fr', 'en'];
  const params = [];
  
  for (const locale of locales) {
    for (const city of popularCitySlugs) {
      params.push({ locale, city });
    }
  }
  
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}): Promise<Metadata> {
  const { locale, city } = await params;
  
  return {
    title: `Escorts à ${city} | VotreSite`,
    description: `Trouvez des escortes à ${city}. Profitez de nos services...`,
    openGraph: {
      title: `Escorts à ${city}`,
      description: `Escortes disponibles à ${city}`,
    },
  };
}

export default async function CityEscortsPage({ params }: PageProps) {
  const { locale, city } = await params;
  setStaticParamsLocale(locale); // ← CETTE LIGNE EST CRITIQUE
  const t = await getScopedI18n('Escorts');
  const cityName = formatCityName(city);
  
  // Récupérer les données côté serveur
  const ads = await getCityAds(city);

  const top3Ads = ads.slice(0, 3);
  const top10Ads = ads.slice(0, 10);
  const boostedAds = ads.filter(ad => ad.city_boosted_at?.[city.toLowerCase()]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900 py-12 shadow-lg shadow-black/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
              <span className="text-pink-300">Escorts</span> à {formatCityName(cityName)}
            </h1>
            <p className="text-gray-300">
              {ads.length > 0 
                ? `${ads.length} annonce${ads.length > 1 ? 's' : ''} vérifiée${ads.length > 1 ? 's' : ''} • Classées par pertinence`
                : t('CityPage.searching')
              }
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        {ads.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg shadow-black/20">
              <div className="text-2xl font-bold text-white mb-1">{ads.length}</div>
              <div className="text-sm text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t('CityPage.stats.totalAds')}
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg shadow-black/20">
              <div className="text-2xl font-bold text-amber-400 mb-1">{top3Ads.length}</div>
              <div className="text-sm text-gray-300 flex items-center gap-2">
                <Crown className="w-4 h-4" />
                {t('CityPage.stats.top3')}
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg shadow-black/20">
              <div className="text-2xl font-bold text-blue-400 mb-1">{top10Ads.length}</div>
              <div className="text-sm text-gray-300 flex items-center gap-2">
                <Star className="w-4 h-4" fill="#60a5fa" />
                {t('CityPage.stats.top10')}
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg shadow-black/20">
              <div className="text-2xl font-bold text-green-400 mb-1">{boostedAds.length}</div>
              <div className="text-sm text-gray-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {t('CityPage.stats.boosted')}
              </div>
            </div>
          </div>
        )}

        {/* Légende du classement */}
        {ads.length > 0 && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-lg shadow-black/20">
            <h3 className="font-semibold text-white mb-3">{t('CityPage.legend.title')}</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-6 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-gray-900" />
                </div>
                <span className="text-sm text-gray-300">{t('CityPage.legend.top1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  2
                </div>
                <span className="text-sm text-gray-300">{t('CityPage.legend.top2')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-6 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  3
                </div>
                <span className="text-sm text-gray-300">{t('CityPage.legend.top3')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  #
                </div>
                <span className="text-sm text-gray-300">{t('CityPage.legend.top10')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-6 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-gray-300 text-xs font-bold">
                  #
                </div>
                <span className="text-sm text-gray-300">{t('CityPage.legend.others')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Affichage des annonces */}
        {ads.length === 0 ? (
          <div className="text-center py-20 bg-gray-800 rounded-2xl shadow-lg shadow-black/20 border border-gray-700">
            <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">{t('CityPage.empty.title')}</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Aucune escort n'est encore enregistrée à {formatCityName(cityName)}.
              Soyez le premier à créer une annonce !
            </p>
          </div>
        ) : (
          <>
            {/* Grid des annonces avec rang */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {ads.map((ad) => (
                <div key={ad.pending_ad_id} className="relative">
                  <RankBadge rank={ad.rank} total={ads.length} />
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
                        ad.rank <= 3 ? 'bg-amber-900/30 text-amber-300 border border-amber-800/50' :
                        ad.rank <= 10 ? 'bg-blue-900/30 text-blue-300 border border-blue-800/50' :
                        'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}>
                        Position {ad.rank}/{ads.length}
                      </span>
                      {ad.city_boosted_at?.[city.toLowerCase()] && (
                        <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded-full text-xs border border-green-800/50">
                          {t('CityPage.card.boosted')}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {t('CityPage.card.addedOn')} {new Date(ad.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé du classement */}
            <div className="mt-12 p-6 bg-gray-800 rounded-2xl border border-gray-700 shadow-lg shadow-black/20">
              <h3 className="text-lg font-bold text-white mb-4">{t('CityPage.about.title')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-200 mb-2">{t('CityPage.about.howRanked.title')}</h4>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                      <span>{t('CityPage.about.howRanked.recentlyBoosted')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                      <span>{t('CityPage.about.howRanked.recentAds')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                      <span>{t('CityPage.about.howRanked.boostDecay')}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-200 mb-2">{t('CityPage.about.tips.title')}</h4>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-amber-900/50 rounded flex items-center justify-center text-amber-300 text-xs">1</div>
                      <span>{t('CityPage.about.tips.useBoost')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-amber-900/50 rounded flex items-center justify-center text-amber-300 text-xs">2</div>
                      <span>{t('CityPage.about.tips.updateRegularly')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-amber-900/50 rounded flex items-center justify-center text-amber-300 text-xs">3</div>
                      <span>{t('CityPage.about.tips.addPhotos')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Pagination */}
            {ads.length > 12 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button className="px-6 py-3 bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors shadow-lg shadow-black/20">
                  {t('CityPage.pagination.previous')}
                </button>
                <div className="flex items-center gap-2">
                  <span className="px-4 py-2 bg-purple-700 text-white rounded-lg font-medium">1</span>
                  <span className="px-4 py-2 text-gray-400 hover:text-purple-300 cursor-pointer">2</span>
                  <span className="px-4 py-2 text-gray-400 hover:text-purple-300 cursor-pointer">3</span>
                  <span className="text-gray-600">...</span>
                  <span className="px-4 py-2 text-gray-400 hover:text-purple-300 cursor-pointer">
                    {Math.ceil(ads.length / 12)}
                  </span>
                </div>
                <button className="px-6 py-3 bg-purple-700 text-white hover:bg-purple-600 rounded-lg transition-colors shadow-lg shadow-black/20">
                  {t('CityPage.pagination.next')}
                </button>
              </div>
            )}
          </>
        )}

        {/* Villes voisines */}
        <div className="mt-16">
          <h3 className="text-xl font-bold text-white mb-4">{t('CityPage.nearby.title')}</h3>
          <div className="flex flex-wrap gap-3">
            {popularCitySlugs
              .filter(slug => slug !== city)
              .slice(0, 8)
              .map((neighbor) => (
                <Link
                  key={neighbor}
                  href={`/${locale}/escorts/${neighbor}`}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors shadow-lg shadow-black/20 hover:shadow-purple-900/30 text-gray-300 hover:text-white"
                >
                  {formatCityName(neighbor)}
                </Link>
              ))}
            <Link
              href={`/${locale}/escorts`}
              className="px-4 py-2 bg-gradient-to-r from-purple-700 to-pink-700 text-white hover:opacity-90 rounded-lg transition-colors shadow-lg shadow-black/20"
            >
              {t('CityPage.nearby.viewAll')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}