'use client';

// components/EscortsHomeClient.tsx
import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Search, TrendingUp } from 'lucide-react';

interface CityStats {
  name: string;
  slug: string;
  count: number;
  averagePrice: number;
  status: 'high' | 'medium' | 'low';
}

interface EscortsHomeClientProps {
  cityStats: CityStats[];
  highDemandCities: CityStats[];
}

export default function EscortsHomeClient({ 
  cityStats, 
  highDemandCities 
}: EscortsHomeClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les villes par recherche
  const filteredCities = cityStats.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Section Toutes les villes */}
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

      {/* Barre de recherche */}
      <div className="max-w-2xl mb-8 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher une ville..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 backdrop-blur-sm"
        />
      </div>

      {filteredCities.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Aucune ville trouvée</h3>
          <p className="text-gray-400">
            Aucune ville ne correspond à &quot;{searchQuery}&quot;
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
  );
}