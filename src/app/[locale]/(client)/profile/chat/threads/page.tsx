// /profile/chat/threads/page.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Search, 
  MoreVertical,
  ChevronLeft,
  User,
  MessageCircle,
  Plus,
  Check,
  CheckCheck,
  Paperclip,
  Phone,
  X,
  Loader2
} from 'lucide-react';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useUser } from '@/app/[locale]/context/userContext';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Conversation, Message } from '@/types/profile';
import { useI18n, useScopedI18n } from '../../../../../../../locales/client';

// Interfaces

export default function MessagesPage() {
  const { user } = useUser();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [showMobileConversations, setShowMobileConversations] = useState(true);
  
  // État pour l'ID de l'escort venant des paramètres
  const [escortIdFromParams, setEscortIdFromParams] = useState<string | null>(null);
  const [processingEscortParam, setProcessingEscortParam] = useState(false);
  const [creatingConversation, setCreatingConversation] = useState(false);
  const [hasProcessedEscortParam, setHasProcessedEscortParam] = useState(false);

  const t = useScopedI18n('Profile.Chat' as never) as (key: string, vars?: Record<string, any>) => string;
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // ✅ Récupérer l'ID de l'escort depuis les paramètres d'URL
  useEffect(() => {
    const escortId = searchParams.get('escort');
    if (escortId) {
      setEscortIdFromParams(escortId);
      // Réinitialiser le flag quand un nouvel escortId arrive
      setHasProcessedEscortParam(false);
    }
  }, [searchParams]);

  // ✅ Charger les conversations initiales
  useEffect(() => {
    if (!user?.user_id) return;
    
    loadConversations();
    
    // S'abonner aux nouveaux messages en temps réel
    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as Message;
            
            if (selectedConversation?.id === newMessage.conversation_id) {
              setMessages(prev => [...prev, newMessage]);
              if (newMessage.sender_id !== user.user_id) {
                markMessageAsRead(newMessage.id);
              }
            }
            
            loadConversations();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedConversation]);

  // ✅ Traiter l'escort ID APRÈS que les conversations soient chargées
  useEffect(() => {
    if (!user?.user_id || !escortIdFromParams || hasProcessedEscortParam || loading) return;

    const processEscortId = async () => {
      await handleEscortFromParams(escortIdFromParams);
      setHasProcessedEscortParam(true);
    };

    processEscortId();
  }, [user, escortIdFromParams, loading, hasProcessedEscortParam]);

  // ✅ Fonction pour gérer l'escort depuis les paramètres
  const handleEscortFromParams = async (escortId: string) => {
    if (!user?.user_id || processingEscortParam) return;
    
    setProcessingEscortParam(true);
    
    try {
      // Vérifier que l'utilisateur est un client
      if (user.user_type !== 'client') {
        console.log(t('errors.clientsOnly'));
        return;
      }

      // Vérifier s'il existe déjà une conversation entre ces deux utilisateurs
      const existingConversation = findExistingConversation(user.user_id, escortId);
      
      let conversation: Conversation | null = existingConversation;

      if (!conversation) {
        // Chercher dans la base de données
        const { data: dbConversation, error: checkError } = await supabase
          .from('conversations')
          .select('*')
          .or(`and(participant1.eq.${user.user_id},participant2.eq.${escortId}),and(participant1.eq.${escortId},participant2.eq.${user.user_id})`)
          .maybeSingle(); // Utiliser maybeSingle au lieu de single

        if (dbConversation && !checkError) {
          // Récupérer les informations de l'escort
          const { data: escortData } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', escortId)
            .eq('user_type', 'escort')
            .single();

          if (escortData) {
            conversation = {
              ...dbConversation,
              other_user: escortData,
              unread_count: 0,
              last_message: '',
              last_message_sender: null,
              last_message_at: dbConversation.updated_at
            };
          }
        }
      }

      if (!conversation) {
        // Créer une nouvelle conversation UNIQUEMENT si elle n'existe pas
        setCreatingConversation(true);
        
        // Récupérer les informations de l'escort pour la nouvelle conversation
        const { data: escortData, error: escortError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', escortId)
          .eq('user_type', 'escort')
          .single();

        if (escortError || !escortData) {
          console.error(t('errors.escortNotFound'), escortError);
          return;
        }

        const { data: newConversation, error: createError } = await supabase
          .from('conversations')
          .insert({
            participant1: user.user_id,
            participant2: escortId
          })
          .select()
          .single();

        if (createError) {
          // Si erreur de contrainte d'unicité, la conversation existe déjà
          if (createError.code === '23505') {
            console.log(t('errors.conversationExists'));
            await loadConversations();
            // Après rechargement, trouver la conversation
            const refreshedConversation = findExistingConversation(user.user_id, escortId);
            if (refreshedConversation) {
              conversation = refreshedConversation;
            }
          } else {
            throw createError;
          }
        } else {
          conversation = {
            ...newConversation,
            other_user: escortData,
            unread_count: 0,
            last_message: '',
            last_message_sender: null,
            last_message_at: new Date().toISOString()
          };

          // Ajouter à la liste des conversations
          setConversations(prev => [conversation!, ...prev]);
        }
      }

      // Sélectionner et charger la conversation si trouvée/créée
      if (conversation) {
        setSelectedConversation(conversation);
        setShowMobileConversations(false);
        
        // Nettoyer l'URL en retirant le paramètre escort
        const url = new URL(window.location.href);
        url.searchParams.delete('escort');
        window.history.replaceState({}, '', url.toString());
      }
      
    } catch (error) {
      console.error(t('errors.loadError'), error);
    } finally {
      setProcessingEscortParam(false);
      setCreatingConversation(false);
    }
  };

  // ✅ Fonction pour trouver une conversation existante entre deux utilisateurs
  const findExistingConversation = (userId1: string, userId2: string): Conversation | null => {
    return conversations.find(conv => {
      const otherUser = conv.other_user;
      if (!otherUser) return false;
      
      return (conv.participant1 === userId1 && conv.participant2 === userId2) ||
             (conv.participant1 === userId2 && conv.participant2 === userId1);
    }) || null;
  };

  // ✅ Charger les messages quand une conversation est sélectionnée
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      markConversationAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  // ✅ Scroll automatique vers le bas
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // ✅ ALGORITHME : Charger les conversations
  const loadConversations = async () => {
    if (!user?.user_id) return;
    
    setLoading(true);
    try {
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant1.eq.${user.user_id},participant2.eq.${user.user_id}`)
        .order('updated_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      const conversationsWithDetails = await Promise.all(
        (conversationsData || []).map(async (conversation) => {
          const otherUserId = conversation.participant1 === user.user_id 
            ? conversation.participant2 
            : conversation.participant1;

          const { data: otherUserData } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', otherUserId)
            .single();

          const { data: lastMessageData } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conversation.id)
            .eq('is_read', false)
            .neq('sender_id', user.user_id);

          return {
            ...conversation,
            last_message: lastMessageData?.content,
            last_message_sender: lastMessageData?.sender_id,
            last_message_at: lastMessageData?.created_at,
            unread_count: unreadCount || 0,
            other_user: otherUserData
          };
        })
      );

      setConversations(conversationsWithDetails);
    } catch (error) {
      console.error(t('errors.loadError'), error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ALGORITHME : Charger les messages d'une conversation
  const loadMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      const messagesWithSenders = await Promise.all(
        (messagesData || []).map(async (message) => {
          const { data: senderData } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', message.sender_id)
            .single();

          return {
            ...message,
            sender: senderData
          };
        })
      );

      setMessages(messagesWithSenders);
    } catch (error) {
      console.error(t('errors.loadError'), error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // ✅ ALGORITHME : Envoyer un message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user?.user_id || sending) return;

    setSending(true);
    try {
      const { data: newMessageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: user.user_id,
          content: newMessage.trim(),
          is_read: false
        })
        .select()
        .single();

      if (messageError) throw messageError;

      setMessages(prev => [...prev, {
        ...newMessageData,
        sender: {
          user_id: user.user_id,
          email: user.email || '',
          username: user.username || '',
          user_type: user.user_type as 'client' | 'escort' | 'admin',
          is_active: true,
          created_at: new Date().toISOString()
        }
      }]);

      setNewMessage('');
      loadConversations();
    } catch (error) {
      console.error(t('errors.sendMessageError'), error);
      alert(t('errors.sendMessageError'));
    } finally {
      setSending(false);
    }
  };

  // ✅ ALGORITHME : Marquer comme lu
  const markConversationAsRead = async (conversationId: string) => {
    if (!user?.user_id) return;

    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.user_id)
        .eq('is_read', false);

      setMessages(prev => prev.map(msg => 
        msg.sender_id !== user.user_id ? { ...msg, is_read: true } : msg
      ));

      setConversations(prev => prev.map(conv => 
        conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
      ));
    } catch (error) {
      console.error(t('errors.markReadError'), error);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);
    } catch (error) {
      console.error(t('errors.markReadError'), error);
    }
  };

  // ✅ Fonctions de formatage
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: fr });
    } catch {
      return '--:--';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      if (isToday(date)) {
        return t('conversations.today');
      }
      
      if (isYesterday(date)) {
        return t('conversations.yesterday');
      }
      
      return format(date, 'dd MMM', { locale: fr });
    } catch {
      return t('conversations.unknownDate');
    }
  };

  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: fr 
      });
    } catch {
      return '';
    }
  };

  // ✅ Gestion des touches
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (selectedConversation) {
        handleSendMessage();
      }
    }
  };

  // ✅ Filtrer les conversations
  const filteredConversations = conversations.filter(conv => {
    const otherUser = conv.other_user;
    if (!otherUser) return false;
    
    return otherUser.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
           conv.last_message?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">{t('errors.notAuthenticated')}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar des conversations */}
      <div className={`${showMobileConversations ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-80 lg:w-96 shrink-0 border-r border-gray-200 bg-white`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">{t('title')}</h2>
            <button
              onClick={() => setShowMobileConversations(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition md:hidden"
              title={t('conversations.viewConversations')}
            >
              <MessageCircle className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Barre de recherche des conversations */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t('conversations.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Liste des conversations */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-sm text-gray-500">{t('loading.conversations')}</span>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-400 mb-2">{t('conversations.noConversations')}</p>
              <p className="text-gray-400 text-sm">{t('conversations.noConversationsDescription')}</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const otherUser = conversation.other_user;
              if (!otherUser) return null;
              
              const isActive = conversation.id === selectedConversation?.id;
              
              return (
                <div
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    setShowMobileConversations(false);
                  }}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
                    isActive ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      {otherUser.is_active && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {otherUser.username}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {conversation.last_message_at && formatRelativeTime(conversation.last_message_at)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.last_message_sender === user.user_id ? t('conversations.youPrefix') : ''}
                        {conversation.last_message || t('conversations.newConversation')}
                      </p>
                      
                      {conversation.unread_count && conversation.unread_count > 0 ? (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded-full">
                          {t('conversations.unreadCount', { count: conversation.unread_count })}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Zone de chat principale */}
      <div className={`${!showMobileConversations || selectedConversation ? 'flex' : 'hidden'} md:flex flex-1 flex-col`}>
        {creatingConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">{t('chat.openingConversation')}</h3>
            <p className="text-gray-400">{t('chat.pleaseWait')}</p>
          </div>
        ) : !selectedConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <MessageCircle className="w-24 h-24 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">{t('chat.noConversationSelected')}</h3>
            <p className="text-gray-400">{t('chat.noConversationSelectedDescription')}</p>
          </div>
        ) : (
          <>
            {/* Header de la conversation */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileConversations(true)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                
                <div>
                  <h2 className="font-bold text-gray-800">
                    {selectedConversation.other_user?.username}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedConversation.other_user?.user_type === 'escort' 
                        ? 'bg-pink-100 text-pink-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {t(`userTypes.${selectedConversation.other_user?.user_type}`)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {selectedConversation.other_user?.is_active ? t('conversations.online') : t('conversations.offline')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 bg-gray-50"
            >
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-sm text-gray-500">{t('loading.messages')}</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-400">{t('chat.noMessages')}</p>
                  <p className="text-gray-400 text-sm mt-1">{t('chat.firstMessagePrompt')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    const isOwn = message.sender_id === user.user_id;
                    const showDate = index === 0 || 
                      formatDate(messages[index - 1].created_at) !== formatDate(message.created_at);
                    
                    return (
                      <React.Fragment key={message.id}>
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <div className="px-3 py-1 bg-white border border-gray-200 rounded-full">
                              <span className="text-xs text-gray-500 font-medium">
                                {formatDate(message.created_at)}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] ${isOwn ? 'ml-auto' : ''}`}>
                            <div
                              className={`rounded-2xl px-4 py-2 ${
                                isOwn
                                  ? 'bg-blue-500 text-white rounded-br-sm'
                                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              <div className={`flex items-center justify-end gap-1 mt-1 ${
                                isOwn ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                <span className="text-xs">{formatTime(message.created_at)}</span>
                                {isOwn && (
                                  message.is_read ? 
                                    <CheckCheck className="w-3 h-3" /> : 
                                    <Check className="w-3 h-3" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input message */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={t('chat.typingPlaceholder')}
                  disabled={sending}
                  className="flex-1 min-h-[44px] max-h-32 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  rows={1}
                />
                
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                  className={`p-3 rounded-lg transition ${
                    newMessage.trim() && !sending
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-100 cursor-not-allowed'
                  }`}
                  title={sending ? t('chat.sending') : t('chat.sendButton')}
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}