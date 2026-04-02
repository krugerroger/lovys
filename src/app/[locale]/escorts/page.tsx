import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Users, TrendingUp } from 'lucide-react';
import { frenchCities } from '../constants';
import EscortsHomeClient from '@/components/Escortshomeclient';

export const revalidate = 1;

interface CityStats {
  name: string;
  slug: string;
  count: number;
  averagePrice: number;
  status: 'high' | 'medium' | 'low';
}

const normalizeCityName = (city: string): string => {
  return city
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// ✅ FIX : Fonction qui reproduit EXACTEMENT la logique de getCityAds
async function getCityAdCount(citySlug: string): Promise<number> {
  try {
    const supabase = createClient();
    
    // Utiliser EXACTEMENT la même requête que dans [city]/page.tsx
    const { data: ads, error } = await supabase
      .from('pending_ads')
      .select('escort_id')
      .eq('status', 'approved')
      .ilike('location->>city', `%${citySlug}%`);

    if (error) {
      console.error(`Erreur pour ${citySlug}:`, error);
      return 0;
    }

    // Filtrage blacklist (comme dans getCityAds)
    const { data: { user } } = await supabase.auth.getUser();
    let filteredAds = ads || [];
    
    if (user?.id && filteredAds.length > 0) {
      const escortIds = filteredAds.map(ad => ad.escort_id).filter(Boolean);
      
      if (escortIds.length > 0) {
        const { data: blacklistEntries } = await supabase
          .from('escort_blacklist')
          .select('escort_id')
          .eq('blocked_user_id', user.id)
          .in('escort_id', escortIds);
        
        if (blacklistEntries && blacklistEntries.length > 0) {
          const blockedEscortIds = new Set(blacklistEntries.map(entry => entry.escort_id));
          filteredAds = filteredAds.filter(ad => 
            !ad.escort_id || !blockedEscortIds.has(ad.escort_id)
          );
        }
      }
    }

    return filteredAds.length;
  } catch (error) {
    console.error(`Erreur comptage ${citySlug}:`, error);
    return 0;
  }
}

// ✅ FIX : Nouvelle fonction qui compte correctement
async function fetchCityStats() {
  try {
    const supabase = createClient();

    // 1. Récupérer le total des annonces pour les stats globales
    const { data: allAds, error: totalError } = await supabase
      .from('pending_ads')
      .select('escort_id')
      .eq('status', 'approved');

    if (totalError) throw totalError;

    const totalEscorts = allAds?.length || 0;

    // // console.log(`📊 Total annonces approuvées: ${totalEscorts}`);

    // 2. Pour chaque ville, compter avec la MÊME logique que [city]/page.tsx
    const cityStatsPromises = frenchCities.map(async (cityName) => {
      const slug = normalizeCityName(cityName);
      const count = await getCityAdCount(cityName); // Utilise le nom original, pas le slug
      
      return {
        name: cityName,
        slug,
        count,
        averagePrice: 0,
        status: (count >= 10 ? 'high' : count >= 3 ? 'medium' : 'low') as 'high' | 'medium' | 'low'
      };
    });

    // Attendre que toutes les villes soient comptées
    const statsArray = await Promise.all(cityStatsPromises);

    // Trier par count décroissant
    statsArray.sort((a, b) => b.count - a.count);

    const citiesWithAds = statsArray.filter(c => c.count > 0).length;

    // Log des 10 premières villes
    // console.log('🏙️ Top 10 villes:');
    statsArray.slice(0, 10).forEach((city, i) => {
      // console.log(`  ${i + 1}. ${city.name}: ${city.count} annonces`);
    });

    return {
      cityStats: statsArray,
      totalEscorts,
      totalCities: citiesWithAds
    };
  } catch (error) {
    console.error('❌ Erreur fetchCityStats:', error);
    
    // Fallback
    const fallbackStats: CityStats[] = frenchCities.map(city => ({
      name: city,
      slug: normalizeCityName(city),
      count: 0,
      averagePrice: 0,
      status: 'low' as const
    }));
    
    return { 
      cityStats: fallbackStats, 
      totalEscorts: 0, 
      totalCities: 0 
    };
  }
}

export default async function EscortsHomePage() {
  const { cityStats, totalEscorts, totalCities } = await fetchCityStats();

  const popularCities = cityStats
    .filter(city => city.count > 0)
    .slice(0, 12);

  const highDemandCities = cityStats.filter(c => c.status === 'high' && c.count > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-pink-900/20 via-purple-900/20 to-blue-900/20 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Trouvez des escorts dans <span className="text-pink-400">toute la France</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {totalCities} villes • {totalEscorts} annonces vérifiées
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-2">{totalEscorts}</div>
                <div className="text-gray-400 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Annonces actives
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="text-3xl font-bold text-white mb-2">{totalCities}</div>
            <div className="text-gray-400 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Villes couvertes
            </div>
          </div>
        </div>

        {/* Villes populaires */}
        {popularCities.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-pink-400" />
              Villes les plus demandées
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {popularCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/escorts/${city.slug}`}
                  className="group relative bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-pink-500/30 hover:bg-gray-800/50 transition-all overflow-hidden"
                >
                  <div className="absolute top-2 right-2">
                    <div className={`w-2 h-2 rounded-full ${
                      city.status === 'high' ? 'bg-green-500' :
                      city.status === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white group-hover:text-pink-300 transition mb-1">
                      {city.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {city.count} annonce{city.count > 1 ? 's' : ''}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Toutes les villes - client component */}
        <EscortsHomeClient
          cityStats={cityStats}
          highDemandCities={highDemandCities}
        />

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-2xl p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold mb-4">Vous êtes escort ?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Rejoignez notre plateforme et augmentez votre visibilité dans votre ville
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg hover:opacity-90 transition font-semibold"
            >
              Créer mon annonce
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}