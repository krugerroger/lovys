// app/api/reviews/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Non autorisé',
        message: 'Vous devez être connecté' 
      }, { status: 401 });
    }
    
    // Vérifier que l'utilisateur possède l'avis
    const { data: review } = await supabase
      .from('reviews')
      .select('escort_id, user_id')
      .eq('id', id)
      .single();
    
    if (!review) {
      return NextResponse.json({ 
        error: 'Avis non trouvé',
        message: 'Cet avis n\'existe pas' 
      }, { status: 404 });
    }
    
    if (review.user_id !== user.id) {
      return NextResponse.json({ 
        error: 'Permission refusée',
        message: 'Vous ne pouvez supprimer que vos propres avis' 
      }, { status: 403 });
    }
    
    // Supprimer l'avis
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Mettre à jour la note moyenne
    await updateEscortRating(review.escort_id);
    
    return NextResponse.json({ 
      success: true,
      message: 'Avis supprimé avec succès' 
    });
    
  } catch (error) {
    console.error('Erreur suppression avis:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur',
      message: 'ble de supprimer l\'avis' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Non autorisé',
        message: 'Vous devez être connecté' 
      }, { status: 401 });
    }
    
    const body = await request.json();
    const { rating, comment, anonymous } = body;
    
    // Vérifier que l'utilisateur possède l'avis
    const { data: review } = await supabase
      .from('reviews')
      .select('escort_id, user_id')
      .eq('id', id)
      .single();
    
    if (!review) {
      return NextResponse.json({ 
        error: 'Avis non trouvé',
        message: 'Cet avis n\'existe pas' 
      }, { status: 404 });
    }
    
    if (review.user_id !== user.id) {
      return NextResponse.json({ 
        error: 'Permission refusée',
        message: 'Vous ne pouvez modifier que vos propres avis' 
      }, { status: 403 });
    }
    
    // Mettre à jour l'avis
    const { data: updatedReview, error } = await supabase
      .from('reviews')
      .update({
        rating,
        comment,
        anonymous,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Mettre à jour la note moyenne
    await updateEscortRating(review.escort_id);
    
    return NextResponse.json({ 
      success: true,
      message: 'Avis mis à jour avec succès',
      review: updatedReview 
    });
    
  } catch (error) {
    console.error('Erreur mise à jour avis:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur',
      message: 'Impossible de mettre à jour l\'avis' 
    }, { status: 500 });
  }
}

async function updateEscortRating(escortId: string) {
  const supabase = await createClient();
  
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('escort_id', escortId);
  
  if (reviews && reviews.length > 0) {
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await supabase
      .from('pending_ads')
      .update({ 
        rating: parseFloat(averageRating.toFixed(1)),
        reviews_count: reviews.length 
      })
      .eq('escort_id', escortId);
  }
}