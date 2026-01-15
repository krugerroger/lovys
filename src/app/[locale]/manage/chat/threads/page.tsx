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
  X
} from 'lucide-react';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useUser } from '@/app/[locale]/context/userContext';
import { createClient } from '@/lib/supabase/client';
import { useScopedI18n } from '../../../../../../locales/client';

// Interfaces
interface UserProfile {
  user_id: string;
  email: string;
  username: string;
  user_type: 'client' | 'escort' | 'admin';
  is_active: boolean;
  created_at: string;
}

interface Conversation {
  id: string;
  participant1: string;
  participant2: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  last_message_sender?: string;
  last_message_at?: string;
  unread_count?: number;
  other_user?: UserProfile;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: UserProfile;
}

export default function MessagesPage() {
  const { user } = useUser();
  const supabase = createClient();
  const t = useScopedI18n('Manage.Messages' as never) as (key: string, vars?: Record<string, any>) => string;
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [showMobileConversations, setShowMobileConversations] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // ✅ Charger les conversations
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
      console.error('Error loading conversations:', error);
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
      console.error('Error loading messages:', error);
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
      console.error('Error sending message:', error);
      alert(t('messages.sendError'));
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
      console.error('Error marking as read:', error);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  // ✅ Fonctions de formatage
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: fr });
    } catch {
      return t('dates.unknownTime');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      if (isToday(date)) {
        return t('dates.today');
      }
      
      if (isYesterday(date)) {
        return t('dates.yesterday');
      }
      
      return format(date, 'dd MMM', { locale: fr });
    } catch {
      return t('dates.unknownDate');
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
        <p className="text-gray-500">{t('emptyStates.loginRequired')}</p>
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
            <h2 className="text-xl font-bold text-gray-800">{t('pageTitle')}</h2>
            <button
              onClick={() => setShowMobileConversations(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition md:hidden"
              title={t('actions.newConversation')}
            >
              <MessageCircle className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Barre de recherche des conversations */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
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
              <span className="ml-3 text-gray-500">{t('messages.loadingConversations')}</span>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-400 mb-2">{t('emptyStates.noConversations')}</p>
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
                        {conversation.last_message_sender === user.user_id ? t('conversation.you') : ''}
                        {conversation.last_message || t('conversation.newConversation')}
                      </p>
                      
                      {conversation.unread_count && conversation.unread_count > 0 ? (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded-full">
                          {conversation.unread_count}
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
        {!selectedConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <MessageCircle className="w-24 h-24 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">{t('emptyStates.selectConversation')}</h3>
            <p className="text-gray-400">{t('emptyStates.selectPrompt')}</p>
          </div>
        ) : (
          <>
            {/* Header de la conversation */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileConversations(true)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                  title={t('actions.back')}
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
                      {selectedConversation.other_user?.user_type === 'escort' 
                        ? t('conversation.userTypes.escort')
                        : selectedConversation.other_user?.user_type === 'admin'
                        ? t('conversation.userTypes.admin')
                        : t('conversation.userTypes.client')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {selectedConversation.other_user?.is_active ? t('online') : t('offline')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title={t('actions.call')}
                >
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title={t('actions.menu')}
                >
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
                  <span className="ml-3 text-gray-500">{t('messages.loading')}</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-400">{t('emptyStates.noMessages')}</p>
                  <p className="text-gray-400 text-sm mt-1">{t('emptyStates.firstMessage')}</p>
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
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title={t('actions.attach')}
                >
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={t('messages.inputPlaceholder')}
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
                  title={t('actions.send')}
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