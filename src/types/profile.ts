import { PreviewAdData } from "./adsForm";

export interface ProfileData {
    user_id: string;
    email: string;
    balance: number;
    username: string;
    user_type: 'client' | 'escort' | 'admin';
}

export interface Profile {
    user_id: string;
    email: string;
    username: string;
    is_active: boolean;
    user_type: 'client' | 'escort' | 'admin';
}

export interface Favorite {
  id: string;
  client_id: string;
  ad_id: string;
  created_at: string;
}
export interface UserProfile {
  user_id: string;
  email: string;
  username: string;
  user_type: 'client' | 'escort' | 'admin';
  is_active: boolean;
  created_at: string;
}
export interface Conversation {
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

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: UserProfile;
}

export interface FavoriteAd {
  id: string;
  client_id: string;
  ad_id: string;
  created_at: string;
  ad_details?: PreviewAdData;
}