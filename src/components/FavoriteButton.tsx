'use client';

import { useUser } from '@/app/[locale]/context/userContext';
import { createClient } from '@/lib/supabase/client';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useScopedI18n } from '../../locales/client';

interface FavoriteButtonProps {
  adId: string;
  className?: string;
  showCount?: boolean;
}

export default function FavoriteButton({ 
  adId,  
  className = '',
  showCount = false 
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const supabase = createClient();
  const { user, favoriteEscorts, fetchFavoriteEscorts } = useUser();
  const t = useScopedI18n('FavoriteButton' as never) as (key: string, vars?: Record<string, any>) => string;

  useEffect(() => {
    if (user && adId) {
      checkIfFavorite();
      if (showCount) {
        getFavoriteCount();
      }
    }
  }, [user, adId, favoriteEscorts]);

  const checkIfFavorite = () => {
    if (!user || !adId) return;
    
    // Vérifier dans les favoris du contexte
    const isFav = favoriteEscorts.some(fav => fav.ad_id === adId && fav.client_id === user.user_id);
    setIsFavorite(isFav);
  };

  const getFavoriteCount = async () => {
    try {
      const { count, error } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('ad_id', adId);

      if (error) throw error;
      setFavoriteCount(count || 0);
    } catch (error) {
      console.error('Error getting favorite count:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error(t('messages.loginRequired'));
      return;
    }
    if (user.user_type !== 'client') {
      toast.error(t('messages.clientOnly'));
      return;
    }

    if (!adId) {
      toast.error(t('messages.adIdMissing'));
      return;
    }

    setLoading(true);

    try {
      if (isFavorite) {
        // Trouver l'ID du favori à supprimer
        const favorite = favoriteEscorts.find(fav => 
          fav.ad_id === adId && fav.client_id === user.user_id
        );

        if (favorite) {
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('id', favorite.id);

          if (error) throw error;
        }

        setIsFavorite(false);
        toast.success(t('messages.removedFromFavorites'));
        
        // Rafraîchir les favoris dans le contexte
        if (fetchFavoriteEscorts) {
          fetchFavoriteEscorts();
        }
      } else {
        // Ajouter aux favoris
        const { error } = await supabase
          .from('favorites')
          .insert({
            client_id: user.user_id,
            ad_id: adId,
          });

        if (error) throw error;

        setIsFavorite(true);
        toast.success(t('messages.addedToFavorites'));
        
        // Rafraîchir les favoris dans le contexte
        if (fetchFavoriteEscorts) {
          fetchFavoriteEscorts();
        }
      }

      // Rafraîchir le compteur si affiché
      if (showCount) {
        getFavoriteCount();
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      
      // Gestion spécifique des erreurs
      if (error.code === '23505') {
        toast.error(t('messages.alreadyInFavorites'));
      } else {
        toast.error(error.message || t('messages.genericError'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <button
        className={`p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors ${className}`}
        title={t('messages.loginToAdd')}
        onClick={() => toast.error(t('messages.loginRequired'))}
      >
        <Heart className="w-5 h-5 text-gray-500" />
        {showCount && favoriteCount > 0 && (
          <span className="ml-1 text-xs text-gray-400">{favoriteCount}</span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`group relative p-2 rounded-full transition-all ${
        isFavorite 
          ? 'bg-red-500/20 hover:bg-red-500/30' 
          : 'bg-gray-800 hover:bg-gray-700'
      } ${className}`}
      title={isFavorite ? t('tooltips.removeFromFavorites') : t('tooltips.addToFavorites')}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <>
          <Heart 
            className={`w-5 h-5 transition-all ${
              isFavorite 
                ? 'fill-red-500 text-red-500 group-hover:scale-110' 
                : 'text-gray-400 group-hover:text-pink-500'
            }`}
          />
          {showCount && favoriteCount > 0 && (
            <span className={`absolute -top-1 -right-1 text-xs rounded-full w-5 h-5 flex items-center justify-center ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}>
              {favoriteCount}
            </span>
          )}
        </>
      )}
    </button>
  );
}