// app/escorts/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Search, Users, TrendingUp } from 'lucide-react';
import { frenchCities } from '../constants';

// ✅ CORRECTION 1: Type fixé
interface CityStats {
  name: string;
  slug: string;
  count: number;
  averagePrice: number;
  status: 'high' | 'medium' | 'low';
}

export default function EscortsHomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityStats, setCityStats] = useState<CityStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    totalEscorts: 0,
    totalCities: 0,
  });

  // ✅ CORRECTION 2: Normaliser les noms de villes
  const normalizeCityName = (city: string): string => {
    return city
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        
        // 1. Total des annonces
        const { count: totalAds } = await supabase
          .from('pending_ads')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved');
        
        // 2. Récupérer toutes les annonces avec location
        const { data: allAds } = await supabase
          .from('pending_ads')
          .select('location, rates')
          .eq('status', 'approved');
        
        console.log('📊 Total ads fetched:', allAds?.length);
        
        // ✅ CORRECTION 3: Map avec slug normalisé comme clé
        const cityMap = new Map<string, CityStats>();
        
        // Initialiser toutes les villes françaises
        frenchCities.forEach(cityName => {
          const slug = normalizeCityName(cityName);
          cityMap.set(slug, {
            name: cityName,
            slug,
            count: 0,
            averagePrice: 0,
            status: 'low'
          });
        });
        
        // ✅ CORRECTION 4: Compter correctement les annonces par ville
        allAds?.forEach(ad => {
          const cities = ad.location?.city;
          
          // Gérer le cas où city est un tableau
          let cityArray: string[] = [];
          
          if (Array.isArray(cities)) {
            cityArray = cities;
          } else if (typeof cities === 'string') {
            cityArray = [cities];
          }
          
          cityArray.forEach(cityValue => {
            if (!cityValue || cityValue.trim() === '') return;
            
            const slug = normalizeCityName(cityValue);
            const existingCity = cityMap.get(slug);
            
            if (existingCity) {
              existingCity.count++;
              console.log(`✅ Incremented ${existingCity.name}: ${existingCity.count}`);
            } else {
              // Ville non dans la liste mais présente dans les annonces
              const displayName = cityValue.charAt(0).toUpperCase() + cityValue.slice(1);
              cityMap.set(slug, {
                name: displayName,
                slug,
                count: 1,
                averagePrice: 0,
                status: 'low'
              });
              console.log(`➕ Added new city: ${displayName}`);
            }
          });
        });
        
        // ✅ CORRECTION 5: Convertir en tableau avec statut correct
        const statsArray: CityStats[] = Array.from(cityMap.values())
          .map(city => ({
            ...city,
            status: (city.count >= 10 ? 'high' : 
                    city.count >= 3 ? 'medium' : 'low') as 'high' | 'medium' | 'low'
          }))
          .sort((a, b) => b.count - a.count);
        
        // Villes avec au moins une annonce
        const citiesWithAds = statsArray.filter(city => city.count > 0).length;
        
        console.log('📍 Cities with ads:', citiesWithAds);
        console.log('🏙️ Top cities:', statsArray.slice(0, 5));
        
        setCityStats(statsArray);
        setTotalStats({
          totalEscorts: totalAds || 0,
          totalCities: citiesWithAds
        });

      } catch (error) {
        console.error('❌ Error:', error);
        // Fallback
        const fallbackStats: CityStats[] = frenchCities.slice(0, 50).map(city => ({
          name: city,
          slug: normalizeCityName(city),
          count: 0,
          averagePrice: 0,
          status: 'low' as const
        }));
        setCityStats(fallbackStats);
        setTotalStats({
          totalEscorts: 0,
          totalCities: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Filtrer les villes par recherche
  const filteredCities = cityStats.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Villes avec le plus d'annonces (top 12)
  const popularCities = [...cityStats]
    .filter(city => city.count > 0) // ✅ Seulement les villes avec annonces
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  // Groupes de villes par quantité
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
              {totalStats.totalCities} villes • {totalStats.totalEscorts} annonces vérifiées
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-2">{totalStats.totalEscorts}</div>
                <div className="text-gray-400 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Annonces actives
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="text-3xl font-bold text-white mb-2">{totalStats.totalCities}</div>
            <div className="text-gray-400 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Villes couvertes
            </div>
          </div>
        </div>

        {/* Villes les plus populaires */}
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

        {/* Toutes les villes */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">
              Toutes les villes {searchQuery && `: "${searchQuery}"`}
            </h2>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSearchQuery('')}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  !searchQuery 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-gray-800/50 text-gray-400 hover:text-white'
                }`}
              >
                Toutes
              </button>
              <button
                onClick={() => setSearchQuery('paris')}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  searchQuery === 'paris' 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-gray-800/50 text-gray-400 hover:text-white'
                }`}
              >
                Paris
              </button>
              <button
                onClick={() => setSearchQuery('lyon')}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  searchQuery === 'lyon' 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-gray-800/50 text-gray-400 hover:text-white'
                }`}
              >
                Lyon
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="bg-gray-800/30 rounded-xl p-4 animate-pulse">
                  <div className="h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredCities.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Aucune ville trouvée</h3>
              <p className="text-gray-400">
                Aucune ville ne correspond à "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-6 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition"
              >
                Voir toutes les villes
              </button>
            </div>
          ) : (
            <>
              {/* Villes forte demande */}
              {highDemandCities.length > 0 && searchQuery === '' && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Forte demande ({highDemandCities.length} villes)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {highDemandCities.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/escorts/${city.slug}`}
                        className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20 rounded-lg p-3 hover:border-green-500/40 transition group"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-white group-hover:text-green-300 transition">
                              {city.name}
                            </div>
                            <div className="text-sm text-green-400">{city.count} annonces</div>
                          </div>
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Toutes les villes filtrées */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/escorts/${city.slug}`}
                    className={`bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 border transition group ${
                      city.count > 0
                        ? 'border-gray-700/50 hover:border-pink-500/30 hover:bg-gray-800/50'
                        : 'border-gray-800/30 hover:border-gray-700/50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className={`font-medium transition ${
                          city.count > 0 
                            ? 'text-white group-hover:text-pink-300' 
                            : 'text-gray-500'
                        }`}>
                          {city.name}
                        </div>
                        <div className={`text-sm ${
                          city.count > 0 ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {city.count > 0 
                            ? `${city.count} annonce${city.count > 1 ? 's' : ''}`
                            : 'Aucune annonce'
                          }
                        </div>
                      </div>
                      <MapPin className={`w-4 h-4 ${
                        city.count > 0 ? 'text-gray-500' : 'text-gray-700'
                      }`} />
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

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