"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Search, 
  UserX, 
  Ban, 
  Shield, 
  Check, 
  X, 
  AlertCircle,
  Loader2,
  User,
  Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useScopedI18n } from '../../../../../locales/client';

interface BlacklistedUser {
  id: string;
  escort_id: string;
  blocked_user_id: string;
  created_at: string;
  blocked_user?: {
    user_id: string;
    username: string;
    created_at: string;
  };
}

export default function BlacklistPage() {
  const router = useRouter();
  const supabase = createClient();
  const t = useScopedI18n('Manage.Blacklist' as never) as (key: string, vars?: Record<string, any>) => string;
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [blacklistedUsers, setBlacklistedUsers] = useState<BlacklistedUser[]>([]);
  const [loadingBlacklist, setLoadingBlacklist] = useState(true);
  const [blockingUser, setBlockingUser] = useState<string | null>(null);
  const [unblockingUser, setUnblockingUser] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Vérifier que l'utilisateur est un escort et charger ses données
  useEffect(() => {
    checkUserAndLoadData();
  }, []);

  const checkUserAndLoadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login?redirect=/manage/blacklist');
        return;
      }

      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!userProfile || userProfile.user_type !== 'escort') {
        setErrorMessage(t('access.escortOnly'));
        return;
      }

      setCurrentUser(userProfile);
      loadBlacklistedUsers(user.id);
    } catch (error) {
      console.error('Error checking user:', error);
      setErrorMessage(t('access.permissionError'));
    } finally {
      setLoading(false);
    }
  };

  const loadBlacklistedUsers = async (escortId: string) => {
    try {
      setLoadingBlacklist(true);
      
      const { data, error } = await supabase
        .from('escort_blacklist')
        .select(`
          *,
          blocked_user:users!blocked_user_id (
            user_id,
            username,
            created_at
          )
        `)
        .eq('escort_id', escortId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBlacklistedUsers(data || []);
    } catch (error) {
      console.error('Error loading blacklisted users:', error);
      setErrorMessage(t('messages.error.load'));
    } finally {
      setLoadingBlacklist(false);
    }
  };

  const searchClients = async (query: string) => {
    if (!query.trim() || !currentUser) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    setErrorMessage('');

    try {
      const { data, error } = await supabase
        .from('users')
        .select('user_id, username, created_at')
        .eq('user_type', 'client')
        .neq('user_id', currentUser.user_id)
        .or(`username.ilike.%${query}%`)
        .order('username')
        .limit(10);

      if (error) throw error;

      // Filtrer les utilisateurs déjà blacklistés
      const alreadyBlacklistedIds = new Set(
        blacklistedUsers.map(user => user.blocked_user_id)
      );
      
      const filteredResults = (data || []).filter(user => 
        !alreadyBlacklistedIds.has(user.user_id)
      );

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching clients:', error);
      setErrorMessage(t('messages.error.search'));
    } finally {
      setSearching(false);
    }
  };

  const blockUser = async (userId: string, username: string) => {
    if (!currentUser) return;

    setBlockingUser(userId);
    setErrorMessage('');

    try {
      // Vérifier que l'utilisateur n'est pas déjà blacklisté
      const existing = blacklistedUsers.find(u => u.blocked_user_id === userId);
      if (existing) {
        setErrorMessage(t('messages.error.alreadyBlacklisted'));
        return;
      }

      const { error } = await supabase
        .from('escort_blacklist')
        .insert({
          escort_id: currentUser.user_id,
          blocked_user_id: userId
        });

      if (error) {
        if (error.code === '23505') {
          setErrorMessage(t('messages.error.alreadyBlacklisted'));
        } else {
          throw error;
        }
        return;
      }

      // Mettre à jour la liste des blacklistés
      await loadBlacklistedUsers(currentUser.user_id);
      
      // Mettre à jour les résultats de recherche
      setSearchResults(prev => prev.filter(user => user.user_id !== userId));
      setSearchQuery('');
      
      setSuccessMessage(`${username} ${t('messages.success.block')}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error blocking user:', error);
      setErrorMessage(t('messages.error.block'));
    } finally {
      setBlockingUser(null);
    }
  };

  const unblockUser = async (userId: string, username: string) => {
    if (!currentUser) return;

    if (!confirm(t('buttons.confirmUnblock').replace('cet utilisateur', username))) {
      return;
    }

    setUnblockingUser(userId);
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('escort_blacklist')
        .delete()
        .eq('escort_id', currentUser.user_id)
        .eq('blocked_user_id', userId);

      if (error) throw error;

      // Mettre à jour la liste des blacklistés
      setBlacklistedUsers(prev => prev.filter(user => user.blocked_user_id !== userId));
      
      setSuccessMessage(`${username} ${t('messages.success.unblock')}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error unblocking user:', error);
      setErrorMessage(t('messages.error.unblock'));
    } finally {
      setUnblockingUser(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (errorMessage && !currentUser) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-3">{t('access.denied')}</h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            {t('access.goHome')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">{t('pageTitle')}</h1>
              <p className="text-pink-100">
                {t('pageSubtitle')}
              </p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm">
              {t('description')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Messages d'état */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-green-700">{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{errorMessage}</span>
          </div>
        )}

        {/* Section recherche et blocage */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            {t('search.title')}
          </h2>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                searchClients(e.target.value);
              }}
              placeholder={t('search.placeholder')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Résultats de recherche */}
          {searching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              <span className="ml-2 text-gray-500">{t('search.loading')}</span>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user.username}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {t('blacklisted.registeredOn')} {formatDate(user.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => blockUser(user.user_id, user.username)}
                    disabled={blockingUser === user.user_id}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {blockingUser === user.user_id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Ban className="w-4 h-4" />
                    )}
                    {blockingUser === user.user_id ? t('buttons.blocking') : t('buttons.block')}
                  </button>
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-8">
              <p className="text-gray-500">{t('search.noResults')}</p>
            </div>
          ) : null}
        </div>

        {/* Liste des utilisateurs blacklistés */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <UserX className="w-5 h-5" />
              {t('blacklisted.title')} ({blacklistedUsers.length})
            </h2>
            
            <button
              onClick={() => loadBlacklistedUsers(currentUser.user_id)}
              className="text-sm text-pink-600 hover:text-pink-700 flex items-center gap-1"
            >
              <Loader2 className={`w-4 h-4 ${loadingBlacklist ? 'animate-spin' : ''}`} />
              {t('buttons.refresh')}
            </button>
          </div>

          {loadingBlacklist ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
              <span className="ml-3 text-gray-500">{t('loadingBlacklist')}</span>
            </div>
          ) : blacklistedUsers.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{t('blacklisted.empty')}</p>
              <p className="text-gray-400 text-sm mt-1">
                {t('blacklisted.emptySubtitle')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {blacklistedUsers.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <Ban className="w-6 h-6 text-red-600" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-bold text-gray-800">
                            {item.blocked_user?.username || t('blacklisted.unknownUser')}
                          </p>
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            {t('blacklisted.blacklisted')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{t('blacklisted.since')} {formatDate(item.created_at)}</span>
                          </div>
                          
                          {item.blocked_user?.created_at && (
                            <div>
                              <span className="text-gray-400">{t('blacklisted.registeredOn')} </span>
                              {formatDate(item.blocked_user.created_at)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => unblockUser(
                        item.blocked_user_id,
                        item.blocked_user?.username || t('blacklisted.unknownUser')
                      )}
                      disabled={unblockingUser === item.blocked_user_id}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 disabled:opacity-50"
                    >
                      {unblockingUser === item.blocked_user_id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      {unblockingUser === item.blocked_user_id ? t('buttons.unblocking') : t('buttons.unblock')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {t('info.title')}
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• {t('info.points.p1')}</li>
            <li>• {t('info.points.p2')}</li>
            <li>• {t('info.points.p3')}</li>
            <li>• {t('info.points.p4')}</li>
            <li>• {t('info.points.p5')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}