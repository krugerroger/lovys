// conversationService.ts - Server Actions/API functions
import { createClient } from "@/lib/supabase/server";

export async function startConversation(userId: string, escortId: string) {
  const supabase = await createClient();

  try {
    // Chercher si la conversation existe déjà
    const { data: existing, error: searchError } = await supabase
      .from("conversations")
      .select("*")
      .or(`participant1.eq.${userId},participant2.eq.${userId}`)
      .or(`participant1.eq.${escortId},participant2.eq.${escortId}`)
      .limit(1)
      .single();

    // Si on trouve une conversation où les deux participants sont présents
    if (existing && !searchError) {
      if (
        (existing.participant1 === userId && existing.participant2 === escortId) ||
        (existing.participant1 === escortId && existing.participant2 === userId)
      ) {
        return existing;
      }
    }

    // Sinon créer une nouvelle conversation
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        participant1: userId,
        participant2: escortId,
        last_message: "Conversation started",
        last_message_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
      throw new Error(`Failed to create conversation: ${error.message}`);
    }

    return data;
  } catch (error) {
    // Si la conversation n'existe pas, on continue pour la créer
    if (error instanceof Error && error.message.includes("No rows found")) {
      // Créer une nouvelle conversation
      const { data, error: createError } = await supabase
        .from("conversations")
        .insert({
          participant1: userId,
          participant2: escortId,
          last_message: "Conversation started",
          last_message_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        throw new Error(`Failed to create conversation: ${createError.message}`);
      }

      return data;
    }
    
    throw error;
  }
}

export async function sendMessage(conversationId: string, content: string, senderId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content: content.trim(),
        is_read: false
      })
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      throw new Error(`Failed to send message: ${error.message}`);
    }

    // Mettre à jour la conversation avec le dernier message
    const { error: updateError } = await supabase
      .from("conversations")
      .update({
        last_message: content.trim(),
        last_message_at: new Date().toISOString()
      })
      .eq("id", conversationId);

    if (updateError) {
      console.error("Error updating conversation:", updateError);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Send message error:", error);
    throw error;
  }
}

export async function getConversationMessages(conversationId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Failed to get messages: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("Get messages error:", error);
    throw error;
  }
}

export async function markMessagesAsRead(conversationId: string, userId: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", userId)
      .eq("is_read", false);

    if (error) {
      console.error("Error marking messages as read:", error);
    }

    return { success: !error };
  } catch (error) {
    console.error("Mark as read error:", error);
    throw error;
  }
}