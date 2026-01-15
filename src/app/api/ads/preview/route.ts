// app/api/ads/preview/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Vérifier l'authentification
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

    if (authError || !authUser) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    // 2. Récupérer l'annonce en attente de l'utilisateur
    const { data: pendingAd, error: fetchError } = await supabase
      .from('pending_ads')
      .select('*')
      .eq('escort_id', authUser.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 est l'erreur "No rows returned", ce qui est acceptable
      return NextResponse.json(
        { error: 'Failed to fetch ad: ' + fetchError.message },
        { status: 500 }
      )
    }

    // 3. Si aucune annonce trouvée, retourner null
    if (!pendingAd) {
      return NextResponse.json(
        { ad: null },
        { status: 200 }
      )
    }

    // 4. Formater l'annonce pour la prévisualisation
    const formattedAd = {
      ...pendingAd,
      // S'assurer que les champs optionnels existent
      location: pendingAd.location || { city: [], country: '' },
      physicalDetails: pendingAd.physicalDetails || { age: null, height: '', weight: '', bust: '' },
      rates: pendingAd.rates || {},
      services: pendingAd.services || {},
      contacts: pendingAd.contacts || {},
      categories: pendingAd.categories || [],
      images: pendingAd.images || [],
      verified: pendingAd.verified || false,
      online: pendingAd.ad_online || false,
      // Ajouter des données simulées pour la prévisualisation
      rating: pendingAd.rating || (4.5 + Math.random() * 0.5),
      reviews: pendingAd.reviews || Math.floor(Math.random() * 50) + 1
    }

    return NextResponse.json(
      { 
        success: true,
        ad: formattedAd 
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}