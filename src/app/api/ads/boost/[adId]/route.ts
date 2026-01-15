// app/api/ads/boost/[adId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ adId: string }> }
): Promise<NextResponse> {
  const { adId } = await params;

  const supabase = await createClient();
  const { city } = await request.json();

  // Authentification
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  // Vérifier que l'annonce appartient à l'utilisateur
  const { data: ad } = await supabase
    .from('pending_ads')
    .select('pending_ad_id, escort_id, city_boosted_at')
    .eq('pending_ad_id', adId)
    .single();

  if (!ad || ad.escort_id !== user.id) {
    return NextResponse.json({ error: 'Annonce non trouvée' }, { status: 404 });
  }

  // Enregistrer le timestamp pour cette ville
  const now = new Date().toISOString();
  const updatedBoosts = {
    ...(ad.city_boosted_at || {}),
    [city.toLowerCase()]: now
  };

  await supabase
    .from('pending_ads')
    .update({
      city_boosted_at: updatedBoosts,
      updated_at: now
    })
    .eq('pending_ad_id', adId);

  return NextResponse.json({
    success: true,
    boosted_at: now,
    city: city
  });
}
