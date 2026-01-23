// app/profile/favorites/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Heart, MapPin, Star, User, X, Clock, Image as ImageIcon, Euro } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/[locale]/context/userContext';
import { PreviewAdData } from '@/types/adsForm';
import { FavoriteAd } from '@/types/profile';
import { useScopedI18n } from '../../../../../../locales/client';


export default function FavoritesPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filteredFavorites, setFilteredFavorites] = useState<FavoriteAd[]>([]);
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [adsData, setAdsData] = useState<PreviewAdData[]>([]);
  const router = useRouter();
  const supabase = createClient();

  const t = useScopedI18n('Profile.Favorites')
  
  const { user, favoriteEscorts, fetchFavoriteEscorts, toggleFavorite } = useUser();

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      router.push('/login?redirect=/profile/favorites');
    }
  }, [user]);

  // Charger les annonces correspondant aux favoris
  useEffect(() => {
    if (favoriteEscorts.length > 0) {
      loadAdsForFavorites();
    } else {
      setAdsData([]);
    }
  }, [favoriteEscorts]);

  // Associer les favoris avec les détails des annonces
  useEffect(() => {
    if (favoriteEscorts.length > 0 && adsData.length > 0) {
      const enrichedFavorites = favoriteEscorts.map(favorite => {
        const adDetails = adsData.find(ad => ad.pending_ad_id === favorite.ad_id);
        return {
          ...favorite,
          ad_details: adDetails
        };
      }).filter(fav => fav.ad_details); // Garder seulement ceux avec des annonces correspondantes
      
      setFilteredFavorites(enrichedFavorites);
      setLoading(false);
    } else if (favoriteEscorts.length === 0) {
      setFilteredFavorites([]);
      setLoading(false);
    }
  }, [favoriteEscorts, adsData]);

  // Charger les annonces depuis Supabase
  const loadAdsForFavorites = async () => {
    try {
      const adIds = favoriteEscorts.map(fav => fav.ad_id);
      
      if (adIds.length === 0) {
        setAdsData([]);
        return;
      }

      const { data, error } = await supabase
        .from('pending_ads')
        .select('*')
        .in('pending_ad_id', adIds)
        .eq('status', 'approved') // Seulement les annonces approuvées
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des annonces:', error);
        setAdsData([]);
        return;
      }

      setAdsData(data || []);
    } catch (error) {
      setAdsData([]);
    }
  };

  const loadFavorites = async () => {
    setLoading(true);
    try {
      if (!user) {
        router.push('/login?redirect=/profile/favorites');
        return;
      }
      
      if (fetchFavoriteEscorts) {
        await fetchFavoriteEscorts();
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleRemoveFavorite = async (favoriteId: string, adId: string) => {
    try {
      if (toggleFavorite) {
        // Utiliser la fonction du contexte
        await toggleFavorite(adId);
      } else {
        // Fallback: supprimer directement
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('id', favoriteId);

        if (error) throw error;

        // Rafraîchir la liste
        if (fetchFavoriteEscorts) {
          await fetchFavoriteEscorts();
        }
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const refreshFavorites = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  // Obtenir la liste des villes uniques
  const getUniqueCities = () => {
    const cities = filteredFavorites
      .map(fav => fav.ad_details?.location?.city)
      .filter(city => city) as string[];
    return ['all', ...Array.from(new Set(cities))];
  };

  // Filtrer par ville
  const getFilteredFavorites = () => {
    if (cityFilter === 'all') return filteredFavorites;
    return filteredFavorites.filter(
      fav => fav.ad_details?.location?.city?.toLowerCase() === cityFilter.toLowerCase()
    );
  };

  // Supprimer tous les favoris
  const removeAllFavorites = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer tous vos favoris ?')) return;
    
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('client_id', user?.user_id);

      if (error) throw error;

      // Rafraîchir la liste
      if (fetchFavoriteEscorts) {
        await fetchFavoriteEscorts();
      }
    } catch (error) {
      console.error('Error removing all favorites:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-20">
            <p className="text-gray-400">Redirection vers la page de connexion...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Chargement de vos favoris...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentFavorites = getFilteredFavorites();
  const uniqueCities = getUniqueCities();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête avec actions */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              <Heart className="inline-block w-8 h-8 mr-3 text-pink-500" fill="#ec4899" />
              Mes Favoris
            </h1>
            <p className="text-gray-400">
              {filteredFavorites.length} escort{filteredFavorites.length > 1 ? 's' : ''} dans vos favoris
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={refreshFavorites}
              disabled={refreshing}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors flex items-center gap-2"
            >
              {refreshing ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full"></div>
                  Rafraîchissement...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Rafraîchir
                </>
              )}
            </button>
            
            {uniqueCities.length > 1 && (
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {uniqueCities.map(city => (
                  <option key={city} value={city}>
                    {city === 'all' ? 'Toutes les villes' : city}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Statistiques rapides */}
        {filteredFavorites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <div className="text-2xl font-bold text-white">{filteredFavorites.length}</div>
              <div className="text-gray-400 text-sm">Total favoris</div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <div className="text-2xl font-bold text-purple-400">
                {new Set(filteredFavorites.map(f => f.ad_details?.location?.city)).size}
              </div>
              <div className="text-gray-400 text-sm">Villes</div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <div className="text-2xl font-bold text-pink-400">
                {filteredFavorites.reduce((max, fav) => 
                  Math.max(max, fav.ad_details?.images?.length || 0), 0
                )}
              </div>
              <div className="text-gray-400 text-sm">Photos max</div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <div className="text-2xl font-bold text-amber-400">
                {filteredFavorites.length > 0 
                  ? new Date(filteredFavorites[0].created_at).toLocaleDateString('fr-FR')
                  : 'Aucun'
                }
              </div>
              <div className="text-gray-400 text-sm">Dernier ajout</div>
            </div>
          </div>
        )}

        {/* Liste des favoris */}
        {currentFavorites.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
            <Heart className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              {filteredFavorites.length === 0 ? 'Aucun favori' : 'Aucun favori dans cette ville'}
            </h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {filteredFavorites.length === 0 
                ? "Ajoutez des escorts à vos favoris en cliquant sur l'icône cœur dans les annonces"
                : "Aucun favori trouvé pour la ville sélectionnée"
              }
            </p>
            <Link
              href="/escorts"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <MapPin className="w-5 h-5" />
              Parcourir les annonces
            </Link>
          </div>
        ) : (
          <>
            {/* Filtre actif */}
            {cityFilter !== 'all' && (
              <div className="mb-6 flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">
                    Filtre : <span className="font-semibold text-white">{cityFilter}</span>
                    <span className="ml-2 text-gray-400">
                      ({currentFavorites.length} annonce{currentFavorites.length > 1 ? 's' : ''})
                    </span>
                  </span>
                </div>
                <button
                  onClick={() => setCityFilter('all')}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                  Effacer le filtre
                </button>
              </div>
            )}

            {/* Grid des favoris */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentFavorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="group bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/20"
                >
                  {/* Image de l'escort */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={favorite.ad_details?.images?.[0] || '/default-avatar.png'}
                      alt={favorite.ad_details?.title || 'Escort'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/default-avatar.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <button
                      onClick={() => handleRemoveFavorite(favorite.id, favorite.ad_id)}
                      className="absolute top-3 right-3 p-2 bg-red-500/80 hover:bg-red-600 rounded-full transition-colors backdrop-blur-sm"
                      title="Retirer des favoris"
                    >
                      <Heart className="w-5 h-5 fill-white text-white" />
                    </button>
                    
                    {/* Badge de ville */}
                    <div className="absolute bottom-3 left-3">
                      <div className="flex items-center gap-1 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-sm text-white">
                        <MapPin className="w-3 h-3" />
                        {favorite.ad_details?.location?.city || 'Inconnue'}
                      </div>
                    </div>
                  </div>

                  {/* Informations */}
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-white mb-1 truncate">
                        {favorite.ad_details?.title || 'Escort Sans Nom'}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {favorite.ad_details?.description || 'Aucune description disponible'}
                      </p>
                    </div>

                    {/* Infos supplémentaires */}
                    <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1 text-gray-400">
                        <ImageIcon className="w-4 h-4" />
                        <span className="text-gray-300 font-medium">
                          {favorite.ad_details?.images?.length || 0} photo{favorite.ad_details?.images && favorite.ad_details.images.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      {/* <div className="flex items-center justify-end gap-1 text-gray-400">
                        <Euro className="w-4 h-4" />
                        <span className="text-amber-300 font-medium">
                          {favorite.ad_details?.rate ? `€${favorite.ad_details.rate}/h` : 'Tarif non spécifié'}
                        </span>
                      </div> */}
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-3">
                      <Link
                        href={`/escorts/${favorite.ad_details?.location?.city?.toLowerCase()}/${favorite.ad_details?.pending_ad_id}`}
                        className="flex-1 text-center py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Voir l'annonce
                      </Link>
                      <Link
                        href={`/escorts/${favorite.ad_details?.location?.city?.toLowerCase()}`}
                        className="flex-1 text-center py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                      >
                        Voir la ville
                      </Link>
                    </div>

                    {/* Date d'ajout */}
                    <div className="mt-3 pt-3 border-t border-gray-700/50">
                      <div className="text-xs text-gray-500 flex justify-between items-center">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Ajouté le {new Date(favorite.created_at).toLocaleDateString('fr-FR')}
                        </span>
                        <span>
                          {new Date(favorite.created_at).toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Actions globales */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/escorts"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-center"
          >
            ← Retour aux annonces
          </Link>
          
          {filteredFavorites.length > 0 && (
            <button
              onClick={removeAllFavorites}
              className="px-6 py-3 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors border border-red-800/50"
            >
              Supprimer tous les favoris
            </button>
          )}
        </div>

        {/* Section de tri si beaucoup de favoris */}
        {filteredFavorites.length > 6 && (
          <div className="mt-12 p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-4">Conseils d'organisation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-300 mb-2">Trier vos favoris</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Par ville pour trouver rapidement</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span>Par date d'ajout (les plus récents d'abord)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>Par tarif pour respecter votre budget</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-300 mb-2">Actions rapides</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>Cliquez sur l'icône cœur pour retirer un favori</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span>Utilisez le filtre par ville pour mieux organiser</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Notez les annonces pour mieux les retrouver</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}