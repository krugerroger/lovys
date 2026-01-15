// app/api/admin/ads/pending/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Vérifier l'authentification ADMIN
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      )
    }

    // Vérifier les permissions admin
    const { data: userData } = await supabase
      .from('users')
      .select('user_type, is_active')
      .eq('user_id', user.id)
      .single()

    if (!userData || userData.user_type !== 'admin' || !userData.is_active) {
      return NextResponse.json(
        { error: 'Admin privileges required.' },
        { status: 403 }
      )
    }

// 1. Récupérer les pending ads
const { data: pendingAds, error: adsError } = await supabase
  .from('pending_ads')
  .select('*')
  .eq('status', 'pending')
  .order('created_at', { ascending: false })

if (adsError) {
  console.error('Error fetching pending ads:', adsError)
  return NextResponse.json(
    { error: 'Failed to fetch pending ads' },
    { status: 500 }
  )
}

// Si aucune annonce
if (!pendingAds || pendingAds.length === 0) {
  return NextResponse.json({
    success: true,
    count: 0,
    ads: []
  })
}

// 2. Formater les données
const formattedAds = pendingAds.map(ad => ({
  id: ad.escort_id,        // ✔ bonne clé
  escort_id: ad.escort_id,
  title: ad.title || 'Untitled',

  // Email et username sont maintenant dans pending_ads
  email: ad.email || "No email provided",
  username: ad.username || "No username provided",

  // Localisation
  country: ad.country || ad.location?.country || 'Unknown',
  city: ad.city || ad.location?.city || 'Unknown',

  images: ad.images || [],
  status: ad.status,
  created_at: ad.created_at
}))

return NextResponse.json({
  success: true,
  count: formattedAds.length,
  ads: formattedAds
})


  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}

// API pour approuver ou rejeter une annonce
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { action, adId, reason } = await request.json()

    if (!['approve', 'reject'].includes(action) || !adId) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      )
    }

    // 1. Vérifier l'authentification admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      )
    }

    const { data: userData } = await supabase
      .from('users')
      .select('user_type, is_active')
      .eq('user_id', user.id)
      .single()

    if (!userData || userData.user_type !== 'admin' || !userData.is_active) {
      return NextResponse.json(
        { error: 'Admin privileges required.' },
        { status: 403 }
      )
    }

    // 2. Récupérer l'annonce
    const { data: pendingAd, error: fetchError } = await supabase
      .from('pending_ads')
      .select('*')
      .eq('escort_id', adId) // CORRECTION: pending_ad_id
      .single()

    if (fetchError || !pendingAd) {
      console.error('Error fetching ad:', fetchError)
      return NextResponse.json(
        { error: 'Ad not found' },
        { status: 404 }
      )
    }

    // 3. Mettre à jour le statut dans pending_ads
    const { error: updateError } = await supabase
      .from('pending_ads')
      .update({
        status: action === 'approve' ? 'approved' : 'rejected',
        reviewed_by: user.id,
        review_reason: reason || null,
        updated_at: new Date().toISOString()
      })
      .eq('escort_id', adId) // CORRECTION: pending_ad_id

    if (updateError) {
      console.error('Error updating ad status:', updateError)
      return NextResponse.json(
        { error: 'Failed to update ad status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Ad ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      data: {
        ad_id: adId,
        status: action === 'approve' ? 'approved' : 'rejected',
        reviewed_by: user.id,
        review_reason: reason
      }
    })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}