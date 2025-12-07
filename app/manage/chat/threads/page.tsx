"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Search, 
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon,
  Paperclip,
  Mic,
  Check,
  CheckCheck,
  ChevronLeft,
  Menu,
  X,
  User,
  MessageCircle,
  Calendar,
  Shield,
  Heart,
  Star,
  MapPin,
  Clock,
  Filter,
  Plus,
  LogOut
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useUser } from '@/app/context/userContext';
import { useUserConversations, useConversationMessages, useSendMessage } from '@/hooks/conversationHooks';
import { startConversation } from '@/lib/supabase/messages';

// Interface pour les profils (similaire à votre table profiles)
interface Profile {
  id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  online?: boolean;
  last_seen?: string;
  rating?: number;
  location?: string;
  category?: string;
}

// Interface pour les conversations
interface Conversation {
  id: string;
  participant1: string;
  participant2: string;
  last_message: string;
  last_message_at: string;
  created_at: string;
  participant1_profile?: Profile;
  participant2_profile?: Profile;
  other_user?: Profile;
  unread_count?: number;
}

// Interface pour les messages
interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export default function MessagesPage() {
  const { user } = useUser();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileConversations, setShowMobileConversations] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [newChatEscortId, setNewChatEscortId] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Charger les conversations de l'utilisateur
  const { 
    conversations, 
    loading: loadingConversations, 
    error: conversationsError,
    refresh: refreshConversations 
  } = useUserConversations();
  
  // Charger les messages de la conversation sélectionnée
  const { 
    messages, 
    loading: loadingMessages, 
    error: messagesError,
    refresh: refreshMessages 
  } = useConversationMessages(selectedConversation?.id || null);
  
  // Hook pour envoyer des messages
  const { sendMessage, sending } = useSendMessage();

  // Données mockées pour la démonstration (escorts disponibles)
  const availableEscorts: Profile[] = [
    { id: 'esc1', display_name: 'Sophia', avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b786d4d9?w=150', online: true, rating: 4.9, location: 'Paris', category: 'VIP Escort' },
    { id: 'esc2', display_name: 'Emma', avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', online: true, rating: 4.7, location: 'London', category: 'Model' },
    { id: 'esc3', display_name: 'Chloe', avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', online: false, rating: 4.8, location: 'New York', category: 'Student' },
    { id: 'esc4', display_name: 'Lena', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', online: true, rating: 4.6, location: 'Tokyo', category: 'Massage' },
  ];

  // Filtrer les conversations
  const filteredConversations = conversations.filter(conv => {
    const otherUser = conv.other_user || 
      (conv.participant1_profile?.id === user?.user_id ? conv.participant2_profile : conv.participant1_profile);
    
    if (!otherUser) return false;
    
    const matchesSearch = 
      otherUser.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.last_message?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'online') return matchesSearch && otherUser.online;
    if (activeFilter === 'unread') return matchesSearch && (conv.unread_count || 0) > 0;
    
    return matchesSearch;
  });

  // Démarrer une nouvelle conversation
  const handleStartNewConversation = async (escortId: string) => {
    if (!user?.user_id) {
      alert('Vous devez être connecté pour démarrer une conversation');
      return;
    }

    setIsStartingChat(true);
    try {
      const conversation = await startConversation(user.user_id, escortId);
      
      // Trouver l'escort dans la liste
      const escort = availableEscorts.find(e => e.id === escortId);
      
      const newConv: Conversation = {
        id: conversation.id,
        participant1: user.user_id,
        participant2: escortId,
        last_message: 'Conversation démarrée',
        last_message_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        other_user: escort
      };
      
      setSelectedConversation(newConv);
      setShowMobileConversations(false);
      setNewChatEscortId('');
      refreshConversations();
      
    } catch (error) {
      console.error('Failed to start conversation:', error);
      alert('Erreur lors du démarrage de la conversation');
    } finally {
      setIsStartingChat(false);
    }
  };

  // Envoyer un message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    try {
      await sendMessage(selectedConversation.id, newMessage);
      setNewMessage('');
      refreshConversations(); // Rafraîchir la liste des conversations pour mettre à jour le dernier message
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Navigation clavier
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Formater l'heure
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: fr });
    } catch {
      return '--:--';
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      
      if (date.toDateString() === today.toDateString()) {
        return "Aujourd'hui";
      }
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return "Hier";
      }
      
      return format(date, 'dd MMM', { locale: fr });
    } catch {
      return 'Date inconnue';
    }
  };

  // Statut du message
  const getMessageStatus = (message: Message) => {
    if (message.sender_id === user?.user_id) {
      if (message.is_read) {
        return <CheckCheck className="w-3 h-3 text-blue-500 ml-1" />;
      }
      return <Check className="w-3 h-3 text-gray-400 ml-1" />;
    }
    return null;
  };

  // Grouper les messages par date
  const groupedMessages = messages.reduce((groups: any[], message: Message) => {
    const date = formatDate(message.created_at);
    const lastGroup = groups[groups.length - 1];
    
    if (lastGroup && lastGroup.date === date) {
      lastGroup.messages.push(message);
    } else {
      groups.push({ date, messages: [message] });
    }
    
    return groups;
  }, []);

  // Scroll vers le bas
  useEffect(() => {
    if (selectedConversation && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedConversation]);

  return (
    <div className="flex flex-wrap bg-gray-50">
      {/* Conversations List */}
      <div className=" w-full shrink-0 border-r border-gray-200 bg-white
        relative overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
            <div className="p-2 hover:bg-gray-100 rounded-lg relative group">
              <Plus className="w-5 h-5 text-gray-600" />
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-2 hidden group-hover:block z-50">
                <p className="text-sm font-medium text-gray-700 mb-2">Nouvelle conversation</p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableEscorts.map(escort => (
                    <button
                      key={escort.id}
                      onClick={() => handleStartNewConversation(escort.id)}
                      disabled={isStartingChat}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded w-full text-left disabled:opacity-50"
                    >
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                          {escort.avatar_url ? (
                            <img
                              src={escort.avatar_url}
                              alt={escort.display_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        {escort.online && (
                          <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">{escort.display_name}</p>
                        <p className="text-xs text-gray-500">{escort.location}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setActiveFilter('online')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition whitespace-nowrap ${
                activeFilter === 'online'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              En ligne
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition whitespace-nowrap ${
                activeFilter === 'unread'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Non lus
            </button>
          </div>
        </div>

        {/* Conversations */}
        <div className="overflow-y-auto h-[calc(100vh-160px)] md:h-[calc(100vh-170px)]">
          {loadingConversations ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            </div>
          ) : conversationsError ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-red-500 mb-2">Erreur de chargement</p>
              <button 
                onClick={refreshConversations}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
              >
                Réessayer
              </button>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-400 mb-2">Aucune conversation</p>
              <p className="text-gray-400 text-sm mb-4">Commencez une nouvelle discussion</p>
              <div className="space-y-2">
                {availableEscorts.slice(0, 3).map(escort => (
                  <button
                    key={escort.id}
                    onClick={() => handleStartNewConversation(escort.id)}
                    disabled={isStartingChat}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg w-full text-left"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        {escort.avatar_url ? (
                          <img
                            src={escort.avatar_url}
                            alt={escort.display_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-gray-400 m-2" />
                        )}
                      </div>
                      {escort.online && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{escort.display_name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-gray-500">{escort.rating}</span>
                        <MapPin className="w-3 h-3 text-gray-400 ml-1" />
                        <span className="text-xs text-gray-500">{escort.location}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const otherUser = conversation.other_user || 
                (conversation.participant1_profile?.id === user?.user_id 
                  ? conversation.participant2_profile 
                  : conversation.participant1_profile);
              
              if (!otherUser) return null;
              
              return (
                <div
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    setShowMobileConversations(false);
                  }}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
                    selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                        {otherUser.avatar_url ? (
                          <img
                            src={otherUser.avatar_url}
                            alt={otherUser.display_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <User className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      {otherUser.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {otherUser.display_name || 'Utilisateur'}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.last_message_at)}
                        </span>
                      </div>
                      
                      {otherUser.rating && (
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-medium text-gray-600">{otherUser.rating}</span>
                          {otherUser.location && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{otherUser.location}</span>
                            </>
                          )}
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.last_message || 'Nouvelle conversation'}
                      </p>
                      
                      {/* Message non lu */}
                      {(conversation.unread_count || 0) > 0 && (
                        <div className="mt-1">
                          <span className="inline-block px-2 py-0.5 bg-pink-500 text-white text-xs font-medium rounded-full">
                            {conversation.unread_count}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="
         flex-1 flex flex-col bg-white
        relative
      ">
        {!selectedConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <MessageCircle className="w-24 h-24 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Aucune conversation sélectionnée</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Sélectionnez une conversation existante ou démarrez-en une nouvelle
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {availableEscorts.map(escort => (
                <button
                  key={escort.id}
                  onClick={() => handleStartNewConversation(escort.id)}
                  disabled={isStartingChat}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left disabled:opacity-50"
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      {escort.avatar_url ? (
                        <img
                          src={escort.avatar_url}
                          alt={escort.display_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-400 m-3" />
                      )}
                    </div>
                    {escort.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">{escort.display_name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs text-gray-600">{escort.rating}</span>
                      <MapPin className="w-3 h-3 text-gray-400 ml-1" />
                      <span className="text-xs text-gray-600">{escort.location}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileConversations(true)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    {selectedConversation.other_user?.avatar_url ? (
                      <img
                        src={selectedConversation.other_user.avatar_url}
                        alt={selectedConversation.other_user.display_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  {selectedConversation.other_user?.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div>
                  <h2 className="font-bold text-gray-800">
                    {selectedConversation.other_user?.display_name || 'Utilisateur'}
                  </h2>
                  <div className="flex items-center gap-2">
                    {selectedConversation.other_user?.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-gray-600">{selectedConversation.other_user.rating}</span>
                      </div>
                    )}
                    <p className="text-sm text-gray-500">
                      {selectedConversation.other_user?.online ? 'En ligne' : 'Hors ligne'}
                    </p>
                    {selectedConversation.other_user?.location && (
                      <p className="text-sm text-gray-500">
                        • {selectedConversation.other_user.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                </div>
              ) : messagesError ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-red-500 mb-2">Erreur de chargement des messages</p>
                  <button 
                    onClick={refreshMessages}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                  >
                    Réessayer
                  </button>
                </div>
              ) : groupedMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-400">Aucun message</p>
                  <p className="text-gray-400 text-sm mt-1">Envoyez votre premier message !</p>
                  
                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-6">
                    <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Proposer un rendez-vous</span>
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      <span>Demander une vérification</span>
                    </button>
                  </div>
                </div>
              ) : (
                groupedMessages.map((group: any, groupIndex: number) => (
                  <div key={groupIndex} className="mb-6">
                    {/* Date Separator */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="px-3 py-1 bg-white border border-gray-200 rounded-full">
                        <span className="text-xs text-gray-500 font-medium">{group.date}</span>
                      </div>
                    </div>
                    
                    {/* Messages */}
                    {group.messages.map((msg: Message) => {
                      const isOwn = msg.sender_id === user?.user_id;
                      
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
                        >
                          <div className={`max-w-[70%]`}>
                            <div
                              className={`rounded-xl px-3 py-2 ${
                                isOwn
                                  ? 'bg-pink-500 text-white rounded-br-sm'
                                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              <div className={`flex items-center justify-end gap-1 mt-1 ${
                                isOwn ? 'text-pink-100' : 'text-gray-500'
                              }`}>
                                <span className="text-xs">{formatTime(msg.created_at)}</span>
                                {getMessageStatus(msg)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
              {/* Quick Actions */}
              <div className="flex items-center gap-2 mb-3 overflow-x-auto">
                <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition flex items-center gap-1 whitespace-nowrap">
                  <Calendar className="w-4 h-4" />
                  <span>Proposer un rendez-vous</span>
                </button>
                <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition flex items-center gap-1 whitespace-nowrap">
                  <Shield className="w-4 h-4" />
                  <span>Demander une vérification</span>
                </button>
                <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition flex items-center gap-1 whitespace-nowrap">
                  <Heart className="w-4 h-4" />
                  <span>Ajouter aux favoris</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                </button>
                
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Écrivez votre message..."
                    disabled={sending}
                    className="w-full min-h-[44px] max-h-32 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
                    rows={1}
                  />
                </div>
                
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Mic className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    className={`p-3 rounded-lg transition ${
                      newMessage.trim() && !sending
                        ? 'bg-pink-500 hover:bg-pink-600'
                        : 'bg-gray-100 cursor-not-allowed'
                    }`}
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}