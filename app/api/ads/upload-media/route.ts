import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // 1. Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Récupérer les données du formulaire
    const formData = await request.formData()
    const pendingAdId = formData.get('pending_ad_id') as string
    const files = formData.getAll('files') as File[]
    const type = formData.get('type') as 'image' | 'video'

    // 3. Validation
    if (!pendingAdId || files.length === 0 || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: pending_ad_id, files, type' },
        { status: 400 }
      )
    }

    if (type !== 'image' && type !== 'video') {
      return NextResponse.json(
        { error: 'Invalid type. Must be "image" or "video"' },
        { status: 400 }
      )
    }

    // 4. Vérifier que l'annonce appartient à l'utilisateur
    const { data: pendingAd, error: pendingError } = await supabase
      .from('pending_ads')
      .select('escort_id, ad_data')
      .eq('id', pendingAdId) // ⚠️ CORRECTION : 'id' pas 'pending_ad_id'
      .single()

    if (pendingError || !pendingAd) {
      return NextResponse.json(
        { error: 'Pending ad not found' },
        { status: 404 }
      )
    }

    if (pendingAd.escort_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to modify this ad' },
        { status: 403 }
      )
    }

    const uploadedUrls: string[] = []

    // 5. Upload chaque fichier
    for (const file of files) {
      // Limiter le nombre d'images à 3
      if (type === 'image' && uploadedUrls.length >= 3) {
        break
      }

      // Limiter le nombre de vidéos à 1
      if (type === 'video' && uploadedUrls.length >= 1) {
        break
      }

      // Validation de la taille du fichier (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        console.warn(`File ${file.name} exceeds 10MB limit`)
        continue
      }

      // Validation du type MIME
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
      const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg']
      
      const allowedTypes = type === 'image' ? allowedImageTypes : allowedVideoTypes
      
      if (!allowedTypes.includes(file.type)) {
        console.warn(`File ${file.name} has invalid MIME type: ${file.type}`)
        continue
      }

      // Générer un nom de fichier unique
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2, 9)
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 
                     (type === 'image' ? 'jpg' : 'mp4')
      const fileName = `${timestamp}_${random}.${fileExt}`
      const filePath = `ads/${user.id}/${pendingAdId}/${type}s/${fileName}`

      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('adsMedia') // ⚠️ Vérifiez que ce bucket existe
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error for', file.name, ':', uploadError)
        continue
      }

      // Récupérer l'URL publique
      const { data: publicUrlData } = supabase.storage
        .from('adsMedia')
        .getPublicUrl(filePath)

      if (publicUrlData.publicUrl) {
        uploadedUrls.push(publicUrlData.publicUrl)
      }
    }

    // 6. Mettre à jour les URLs dans pending_ads
    if (uploadedUrls.length > 0) {
      // Récupérer les données actuelles de l'annonce
      const { data: currentAd } = await supabase
        .from('pending_ads')
        .select('ad_data')
        .eq('id', pendingAdId)
        .single()

      if (currentAd?.ad_data) {
        let updatedData = { ...currentAd.ad_data }

        if (type === 'image') {
          // Ajouter les nouvelles images (limité à 3)
          const existingImages = currentAd.ad_data.images || []
          const newImages = [...existingImages, ...uploadedUrls]
          
          // Garder seulement les 3 premières images
          updatedData.images = newImages.slice(0, 3)
          
        } else if (type === 'video') {
          // Mettre à jour la vidéo (une seule vidéo par annonce)
          updatedData.video_url = uploadedUrls[0]
        }

        // Mettre à jour la colonne ad_data
        const { error: updateError } = await supabase
          .from('pending_ads')
          .update({ 
            ad_data: updatedData,
            updated_at: new Date().toISOString()
          })
          .eq('id', pendingAdId)

        if (updateError) {
          console.error('Error updating pending ad:', updateError)
        }
      }
    }

    // 7. Réponse
    return NextResponse.json({
      success: true,
      message: `${uploadedUrls.length} file(s) uploaded successfully`,
      urls: uploadedUrls,
      type: type
    })

  } catch (error: any) {
    console.error('Upload media error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}