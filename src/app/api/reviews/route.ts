// app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Non autorisé',
        message: 'Vous devez être connecté pour laisser un avis' 
      }, { status: 401 });
    }
    
    const body = await request.json();
    const { escort_id, ad_id, rating, comment, city, anonymous = false } = body;
    
    // Validation
    if (!escort_id || !ad_id || !rating || !comment || !city) {
      return NextResponse.json({ 
        error: 'Données manquantes',
        message: 'Tous les champs sont requis' 
      }, { status: 400 });
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ 
        error: 'Note invalide',
        message: 'La note doit être entre 1 et 5' 
      }, { status: 400 });
    }
    
    // Vérifier si l'utilisateur a déjà laissé un avis pour cette annonce
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('ad_id', ad_id)
      .eq('user_id', user.id)
      .single();
    
    if (existingReview) {
      return NextResponse.json({ 
        error: 'Avis déjà existant',
        message: 'Vous avez déjà laissé un avis pour cette annonce' 
      }, { status: 409 });
    }
    
    // Créer l'avis
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        escort_id,
        ad_id,
        user_id: user.id,
        rating,
        comment,
        city,
        anonymous
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erreur création avis:', error);
      return NextResponse.json({ 
        error: 'Erreur serveur',
        message: error.message 
      }, { status: 500 });
    }
    
    // Mettre à jour la note moyenne de l'annonce (optionnel)
    await updateEscortRating(escort_id);
    
    return NextResponse.json({ 
      success: true,
      message: 'Avis publié avec succès',
      review 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Erreur API reviews:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur',
      message: 'Une erreur inattendue est survenue' 
    }, { status: 500 });
  }
}

// Fonction pour mettre à jour la note moyenne
async function updateEscortRating(escortId: string) {
  const supabase = await createClient();
  
  // Calculer la moyenne des notes
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('escort_id', escortId);
  
  if (reviews && reviews.length > 0) {
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    // Mettre à jour la table pending_ads
    await supabase
      .from('pending_ads')
      .update({ 
        rating: parseFloat(averageRating.toFixed(1)),
        reviews_count: reviews.length,
        updated_at: new Date().toISOString()
      })
      .eq('escort_id', escortId);
  }
}

// GET pour récupérer les avis
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const escortId = searchParams.get('escort_id');
    const adId = searchParams.get('ad_id');
    const limit = searchParams.get('limit') || '10';
    
    if (!escortId && !adId) {
      return NextResponse.json({ 
        error: 'Paramètres manquants',
        message: 'escort_id ou ad_id requis' 
      }, { status: 400 });
    }
    
    const supabase = await createClient();
    
    let query = supabase
      .from('reviews')
      .select(`
        *,
        users:user_id (
          username
        )
      `)
      .order('created_at', { ascending: false });
    
    if (escortId) query = query.eq('escort_id', escortId);
    if (adId) query = query.eq('ad_id', adId);
    
    const { data: reviews, error } = await query.limit(parseInt(limit));
    
    if (error) throw error;
    
    return NextResponse.json({ 
      success: true,
      reviews: reviews || [],
      count: reviews?.length || 0
    });
    
  } catch (error) {
    console.error('Erreur GET reviews:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur',
      message: 'Impossible de récupérer les avis' 
    }, { status: 500 });
  }
}