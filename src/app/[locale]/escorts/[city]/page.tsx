// app/[locale]/escorts/[city]/page.tsx
import EscortCard from '@/components/EscortCard';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Crown, TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';
import { getScopedI18n } from '../../../../../locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import { Metadata } from 'next';
import AdsGrid from '@/components/Adsgrid';

export const revalidate = 3600; // Revalider les données toutes les heures

export async function generateStaticParams() {
  return popularCitySlugs.map((city) => ({
    city,
    locale: 'fr',
  }));
}

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
    const normalizedCity = cityName.toLowerCase();
    
    const { data: ads, error } = await supabase
      .from('pending_ads')
      .select('*')
      .eq('status', 'approved')
      .ilike('location->>city', `%${cityName}%`);

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
    
    const sortedAds = [...filteredAds].sort((a, b) => {
      const aBoostedAt = a.city_boosted_at?.[normalizedCity];
      const aCreatedAt = new Date(a.created_at).getTime();
      const aBoostedAtTime = aBoostedAt ? new Date(aBoostedAt).getTime() : 0;
      const aLatestDate = Math.max(aCreatedAt, aBoostedAtTime);
      
      const bBoostedAt = b.city_boosted_at?.[normalizedCity];
      const bCreatedAt = new Date(b.created_at).getTime();
      const bBoostedAtTime = bBoostedAt ? new Date(bBoostedAt).getTime() : 0;
      const bLatestDate = Math.max(bCreatedAt, bBoostedAtTime);
      
      return bLatestDate - aLatestDate;
    });

    // console.log('=== TRI DES ANNONCES ===');
    sortedAds.forEach((ad, index) => {
      const boostedAt = ad.city_boosted_at?.[normalizedCity];
      const createdTime = new Date(ad.created_at).getTime();
      const boostTime = boostedAt ? new Date(boostedAt).getTime() : 0;
      const latestTime = Math.max(createdTime, boostTime);
      // console.log(`${index + 1}. ${ad.title}`);
      // console.log(`   Créée: ${ad.created_at} (${new Date(createdTime).toLocaleString()})`);
      // console.log(`   Boost: ${boostedAt || 'Non'} (${boostTime ? new Date(boostTime).toLocaleString() : 'N/A'})`);
      // console.log(`   Date utilisée: ${new Date(latestTime).toLocaleString()}`);
      // console.log('---');
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


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}): Promise<Metadata> {
  const { locale, city } = await params;
  const cityName = city.replace(/-/g, " ");
  const title = `Escortes Indépendantes à ${cityName} | Profils Locaux Vérifiés`;
  const description =
    `Découvrez des escortes indépendantes et vérifiées à ${cityName}. Parcourez les profils locaux, consultez les disponibilités et connectez-vous discrètement avec des accompagnatrices de confiance près de chez vous.`;

  return {
    title,
    description,
    keywords: [
      `escorte ${cityName}`,
      `escortes à ${cityName}`,
      `escortes indépendantes ${cityName}`,
      `services d'escorte locaux ${cityName}`,
      "annuaire d'escortes",
      "escortes vérifiées",
      "accompagnatrices locales",
    ],
    alternates: {
      canonical: `https://lovira.one/${locale}/escorts/${city}`,
      languages: {
        en: `/en/escorts/${city}`,
        fr: `/fr/escorts/${city}`,
        de: `/de/escorts/${city}`,
        es: `/es/escorts/${city}`,
        pt: `/pt/escorts/${city}`,
      },
    },
    openGraph: {
      title: `Escortes Indépendantes à ${cityName}`,
      description:
        `Parcourez des escortes indépendantes et vérifiées à ${cityName}. Profils géolocalisés et mises en relation discrètes.`,
      url: `https://lovira.one/${locale}/escorts/${city}`,
      siteName: "Lovira",
      images: [
        {
          url: "/favicon.png",
          width: 1200,
          height: 630,
          alt: `Escortes indépendantes à ${cityName}`,
        },
      ],
      locale:
        locale === "fr"
          ? "fr_FR"
          : locale === "de"
          ? "de_DE"
          : locale === "es"
          ? "es_ES"
          : locale === "pt"
          ? "pt_PT"
          : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Escortes à ${cityName} | Lovira`,
      description:
        `Trouvez des escortes indépendantes et vérifiées à ${cityName}. Parcourez les profils locaux en toute sécurité et discrétion.`,
      images: ["/favicon.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}


export default async function CityEscortsPage({ params }: PageProps) {
  const { locale, city } = await params;
  setStaticParamsLocale(locale);
  const t = await getScopedI18n('Escorts');
  const cityName = formatCityName(city);
  
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
          // ← Délègue tout l'affichage + "Voir plus" au composant client
          <AdsGrid
            ads={ads}
            city={city}
            loadMoreLabel={t('CityPage.load.loadMore') ?? 'Voir plus'}
            showingLabel={t('CityPage.load.showing') ?? 'Affichage de'}
            ofLabel={t('CityPage.load.of') ?? 'sur'}
            adsLabel={t('CityPage.load.ads') ?? 'annonces'}
            boostedLabel={t('CityPage.card.boosted') ?? 'Boosté'}
            addedOnLabel={t('CityPage.card.addedOn') ?? 'Ajouté le'}
          />
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