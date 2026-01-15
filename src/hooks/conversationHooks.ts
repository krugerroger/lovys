// conversationHooks.ts - React Hooks
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/app/context/userContext";

// Hook pour charger et écouter les messages
export function useConversationMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useUser();

  const loadMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      
      // Marquer les messages comme lus
      if (user?.user_id && data) {
        const unreadMessages = data.filter(
          msg => msg.sender_id !== user.user_id && !msg.is_read
        );
        
        if (unreadMessages.length > 0) {
          const { error: updateError } = await supabase
            .from("messages")
            .update({ is_read: true })
            .in('id', unreadMessages.map(msg => msg.id));
            
          if (updateError) {
            console.error("Error updating read status:", updateError);
          }
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load messages');
      setError(error);
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId, user?.user_id]);

  useEffect(() => {
    if (!conversationId) return;

    loadMessages();

    // Créer un client pour la subscription
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`
        },
        async (payload) => {
          setMessages((prev) => {
            // Éviter les doublons
            if (prev.some(msg => msg.id === payload.new.id)) {
              return prev;
            }
            return [...prev, payload.new];
          });
          
          // Marquer le nouveau message comme lu si c'est l'utilisateur actuel qui l'a envoyé
          if (user?.user_id && payload.new.sender_id !== user.user_id) {
            const { error } = await supabase
              .from("messages")
              .update({ is_read: true })
              .eq("id", payload.new.id);
              
            if (error) {
              console.error("Error marking new message as read:", error);
            }
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages((prev) =>
            prev.map(msg => 
              msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user?.user_id, loadMessages]);

  return { messages, loading, error, refresh: loadMessages };
}

// Hook pour gérer l'envoi de messages
export function useSendMessage() {
  const { user } = useUser();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = async (conversationId: string, content: string) => {
    if (!user?.user_id || !content.trim()) {
      throw new Error('User not authenticated or empty message');
    }

    try {
      setSending(true);
      setError(null);

      const supabase = createClient();
      const { data, error: supabaseError } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: user.user_id,
          content: content.trim(),
          is_read: false
        })
        .select()
        .single();

      if (supabaseError) {
        console.error("Supabase error:", supabaseError);
        throw supabaseError;
      }
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to send message');
      setError(error);
      console.error('Error sending message:', err);
      throw error;
    } finally {
      setSending(false);
    }
  };

  return { sendMessage, sending, error };
}

// Hook pour les conversations d'un utilisateur
export function useUserConversations() {
  const { user } = useUser();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadConversations = useCallback(async () => {
    if (!user?.user_id) {
      setConversations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      
      // Récupérer les conversations avec les infos de l'autre participant
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          participant1:profiles!conversations_participant1_fkey (
            id,
            username,
            display_name,
            avatar_url,
            online
          ),
          participant2:profiles!conversations_participant2_fkey (
            id,
            username,
            display_name,
            avatar_url,
            online
          )
        `)
        .or(`participant1.eq.${user.user_id},participant2.eq.${user.user_id}`)
        .order("last_message_at", { ascending: false });

      if (error) throw error;

      // Formater les conversations pour avoir l'autre participant
      const formattedConversations = (data || []).map(conv => {
        const otherParticipant = 
          conv.participant1?.id === user.user_id 
            ? conv.participant2 
            : conv.participant1;
        
        return {
          ...conv,
          other_user: otherParticipant,
          unread_count: 0 // Vous pouvez calculer cela avec une sous-requête si nécessaire
        };
      });

      setConversations(formattedConversations);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load conversations');
      setError(error);
      console.log('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.user_id]);

  useEffect(() => {
    if (!user?.user_id) return;

    loadConversations();

    // Écouter les nouvelles conversations et mises à jour
    const supabase = createClient();
    const channel = supabase
      .channel(`conversations:${user.user_id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "conversations",
          filter: `or(participant1.eq.${user.user_id},participant2.eq.${user.user_id})`
        },
        () => {
          // Recharger la liste des conversations
          loadConversations();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
          filter: `or(participant1.eq.${user.user_id},participant2.eq.${user.user_id})`
        },
        () => {
          // Recharger la liste des conversations
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.user_id, loadConversations]);

  return { conversations, loading, error, refresh: loadConversations };
}

// Hook pour obtenir l'autre participant d'une conversation
export function useOtherParticipant(conversation: any) {
  const { user } = useUser();
  
  if (!conversation || !user) return null;
  
  return conversation.participant1?.id === user.user_id 
    ? conversation.participant2 
    : conversation.participant1;
}

// Hook pour compter les messages non lus dans une conversation
export function useUnreadCount(conversationId: string | null) {
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!conversationId || !user?.user_id) {
      setUnreadCount(0);
      return;
    }

    const supabase = createClient();
    
    // Compter les messages non lus
    const countUnread = async () => {
      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: 'exact', head: true })
        .eq("conversation_id", conversationId)
        .neq("sender_id", user.user_id)
        .eq("is_read", false);

      if (!error && count !== null) {
        setUnreadCount(count);
      }
    };

    countUnread();

    // Écouter les changements de messages
    const channel = supabase
      .channel(`unread:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`
        },
        () => {
          countUnread();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user?.user_id]);

  return unreadCount;
}