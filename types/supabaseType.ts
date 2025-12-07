
// types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  escort_id: string;
  title: string;

  location: {
    country: string;
    city: string;
  };

  physical_details: {
    age: number;
    height: number;
    weight: number;
    bust: string;
  };

  rates: {
    thirty_minutes: number | null;
    one_hour: number;
    two_hours: number | null;
    full_night: number | null;
  };

  services: {
    [key: string]: {
      enabled: boolean;
      price: number | null;
      comment: string;
    };
  };

  contacts: Record<string, any>; // si tu veux un typage strict, je peux te le générer aussi

  description: string;
  categories: string[];
  images: string[];
  video_url: string | null;
  currency: string;
  status: 'published' | 'draft';
  views: number;
}

export type AdInsert = {
  escort_id: string;
  title: string;

  location: {
    country: string;
    city: string;
  };

  physical_details: {
    age: number;
    height: number;
    weight: number;
    bust: string;
  };

  rates: {
    thirty_minutes: number | null;
    one_hour: number;
    two_hours: number | null;
    full_night: number | null;
  };

  services: {
    [key: string]: {
      enabled: boolean;
      price: number | null;
      comment: string;
    };
  };

  contacts: Record<string, any>; 
  // Si tu veux, je peux te faire une version stricte

  description: string;
  categories: string[];
  images: string[];
  video_url: string | null;
  currency: string;

  // Champs automatiques ajoutés dans createAd
  status?: 'published' | 'draft';
  created_at?: string;
  updated_at?: string;

  views: number;
};

export type AdUpdate = {
  escort_id?: string;
  title?: string;

  location?: {
    country: string;
    city: string;
  };

  physical_details?: {
    age: number;
    height: number;
    weight: number;
    bust: string;
  };

  rates?: {
    thirty_minutes: number | null;
    one_hour: number;
    two_hours: number | null;
    full_night: number | null;
  };

  services?: {
    [key: string]: {
      enabled: boolean;
      price: number | null;
      comment: string;
    };
  };

  contacts?: Record<string, any>;
  
  description?: string;
  categories?: string[];
  images?: string[];
  video_url?: string | null;
  currency?: string;

  status?: 'published' | 'draft';

  // Automatique dans ta fonction updateAd
  updated_at?: string;

  views?: number;
};
