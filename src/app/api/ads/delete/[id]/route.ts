import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

type Params = Promise<{ id: string }>

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Ad ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Vérifier que l'annonce existe et appartient à l'utilisateur
    const { data: existingAd, error: checkError } = await supabase
      .from('pending_ads')
      .select('*')
      .eq('pending_ad_id', id)
      .eq('escort_id', authUser.id)
      .single()

    if (checkError || !existingAd) {
      return NextResponse.json(
        { error: 'Ad not found or unauthorized' },
        { status: 404 }
      )
    }

    // Supprimer les images du storage
    if (existingAd.images && Array.isArray(existingAd.images)) {
      const imagePaths = existingAd.images.map((url: string) => {
        const match = url.match(/ads\/([^/]+)\/([^/]+)/)
        return match ? `ads/${match[1]}/${match[2]}` : null
      }).filter(Boolean)

      if (imagePaths.length > 0) {
        await supabase.storage.from('adsMedia').remove(imagePaths)
      }
    }

    // Supprimer la vidéo si elle existe
    if (existingAd.video_url) {
      const videoMatch = existingAd.video_url.match(/videos\/([^/]+)\/([^/]+)/)
      if (videoMatch) {
        await supabase.storage.from('adsMedia').remove([`videos/${videoMatch[1]}/${videoMatch[2]}`])
      }
    }

    // Supprimer l'annonce de la base de données
    const { error: deleteError } = await supabase
      .from('pending_ads')
      .delete()
      .eq('pending_ad_id', id)
      .eq('escort_id', authUser.id)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete ad from database' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Ad deleted successfully',
      deletedId: id
    })

  } catch (error) {
    console.error('Delete API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}