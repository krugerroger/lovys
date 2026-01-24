// app/api/ads/createAds/route.ts (CORRIGÉ)
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Vérifier l'authentification
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    // 2. Lire FormData
    const form = await request.formData()
    const pending_ad_id = form.get("pending_ad_id") as string | null

    // 3. Récupérer les fichiers
    const images = form.getAll('images') as File[]
    const videoFile = form.get('video') as File | null

    // 4. Pour les mises à jour, vérifier l'autorisation
    if (pending_ad_id) {
      const { data: existingAd } = await supabase
        .from('pending_ads')
        .select('pending_ad_id, escort_id')
        .eq('pending_ad_id', pending_ad_id)
        .eq('escort_id', authUser.id)
        .single()

      if (!existingAd) {
        return NextResponse.json(
          { error: 'Ad not found or unauthorized to update' },
          { status: 404 }
        )
      }
    }

    // 5. Upload des images
    const imagePaths: string[] = []
    
    if (images.length > 0) {
      for (const image of images.slice(0, 10)) {
        // Validation
        if (image.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: `Image ${image.name} is too large (max 5MB)` },
            { status: 400 }
          )
        }
        
        const fileExt = image.name.split('.').pop()?.toLowerCase()
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif']
        if (!fileExt || !allowedExtensions.includes(fileExt)) {
          return NextResponse.json(
            { error: `Invalid image type for ${image.name}` },
            { status: 400 }
          )
        }
        
        // Nom unique
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `ads/${authUser.id}/${fileName}`
        
        // Upload
        const { error: uploadError } = await supabase.storage
          .from('adsMedia')
          .upload(filePath, image, {
            cacheControl: '3600',
            upsert: false,
            contentType: image.type
          })
        
        if (uploadError) {
          // Cleanup
          if (imagePaths.length > 0) {
            await supabase.storage.from('adsMedia').remove(imagePaths.map(p => {
              const match = p.match(/ads\/[^/]+\/([^/]+)$/)
              return `ads/${authUser.id}/${match ? match[1] : ''}`
            }))
          }
          return NextResponse.json(
            { error: `Failed to upload image: ${uploadError.message}` },
            { status: 500 }
          )
        }
        
        // URL publique
        const { data: { publicUrl } } = supabase.storage
          .from('adsMedia')
          .getPublicUrl(filePath)
        imagePaths.push(publicUrl)
      }
    }

    // 6. Upload de la vidéo
    let videoUrl: string | null = null
    
    if (videoFile && videoFile.size > 0) {
      // Validation
      if (videoFile.size > 50 * 1024 * 1024) {
        // Cleanup images
        if (imagePaths.length > 0) {
          await supabase.storage.from('adsMedia').remove(imagePaths.map(p => {
            const match = p.match(/ads\/[^/]+\/([^/]+)$/)
            return `ads/${authUser.id}/${match ? match[1] : ''}`
          }))
        }
        return NextResponse.json(
          { error: 'Video too large (max 50MB)' },
          { status: 400 }
        )
      }
      
      const videoFileExt = videoFile.name.split('.').pop()?.toLowerCase()
      const allowedVideoExtensions = ['mp4', 'webm', 'mov', 'avi', 'mkv']
      
      if (!videoFileExt || !allowedVideoExtensions.includes(videoFileExt)) {
        // Cleanup
        if (imagePaths.length > 0) {
          await supabase.storage.from('adsMedia').remove(imagePaths.map(p => {
            const match = p.match(/ads\/[^/]+\/([^/]+)$/)
            return `ads/${authUser.id}/${match ? match[1] : ''}`
          }))
        }
        return NextResponse.json(
          { error: 'Invalid video format' },
          { status: 400 }
        )
      }
      
      // Nom unique
      const videoFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${videoFileExt}`
      const videoFilePath = `videos/${authUser.id}/${videoFileName}`
      
      try {
        const { error: videoUploadError } = await supabase.storage
          .from('adsMedia')
          .upload(videoFilePath, videoFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: `video/${videoFileExt}`
          })
        
        if (videoUploadError) {
          throw videoUploadError
        }
        
        const { data: { publicUrl: videoPublicUrl } } = supabase.storage
          .from('adsMedia')
          .getPublicUrl(videoFilePath)
        videoUrl = videoPublicUrl
        
      } catch (videoError: any) {
        // Cleanup
        if (imagePaths.length > 0) {
          await supabase.storage.from('adsMedia').remove(imagePaths.map(p => {
            const match = p.match(/ads\/[^/]+\/([^/]+)$/)
            return `ads/${authUser.id}/${match ? match[1] : ''}`
          }))
        }
        return NextResponse.json(
          { error: `Video upload failed: ${videoError.message}` },
          { status: 500 }
        )
      }
    }

    // 7. Préparer les données
    const pendingAdData = {
      escort_id: authUser.id,
      title: form.get("title") as string,
      email: authUser.email || "",
      username: form.get("username") as string,

      location: {
        country: form.get("location_country") as string || "",
        city: form.get("location_city") as string || "",
      },

      physicalDetails: {
        age: parseInt(form.get("physicalAge") as string) || null,
        height: form.get("physicalHeight") as string || "",
        weight: form.get("physicalWeight") as string || "",
        bust: form.get("physicalBust") as string || ""
      },

      rates: {
        thirty_minutes: parseFloat(form.get("ratesThirtyMinutes") as string) || null,
        one_hour: parseFloat(form.get("ratesOneHour") as string) || null,
        two_hours: parseFloat(form.get("ratesTwoHours") as string) || null,
        overnight: parseFloat(form.get("ratesOvernight") as string) || null
      },

      services: form.get("services") ? JSON.parse(form.get("services") as string) : {},
      categories: form.get("categories") ? JSON.parse(form.get("categories") as string) : {},

      contacts: {
        phone_number: form.get("contactsPhoneNumber") as string || "",
        whatsapp: form.get("contactsWhatsapp") as string || "",
        telegram: form.get("contactsTelegram") as string || "",
        instagram: form.get("contactsInstagram") as string || "",
        twitch: form.get("contactsTwitch") as string || "",
        fansly: form.get("contactsFansly") as string || "",
        onlyfans: form.get("contactsOnlyfans") as string || "",
        twitter: form.get("contactsTwitter") as string || "",
        signal: form.get("contactsSignal") as string || ""
      },

      images: imagePaths,
      video_url: videoUrl,
      description: form.get("description") as string || "",
      currency: form.get("currency") as string || "USD",
      status: "approved",
      updated_at: new Date().toISOString()
    };

    // 8. Validation
    if (!pendingAdData.title || !pendingAdData.location.country || !pendingAdData.location.city) {
      // Cleanup
      const cleanupPaths = [...imagePaths, videoUrl].filter(Boolean)
      if (cleanupPaths.length > 0) {
        await supabase.storage.from('adsMedia').remove(
          cleanupPaths.map(url => {
            if (!url) return '';
            const parts = url.split('/');
            return parts.slice(-2).join('/');
          })
        )
      }
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // 9. INSERT ou UPDATE
    let pendingAd;
    let dbError;

    if (pending_ad_id) {
      // UPDATE
      const { data, error } = await supabase
        .from("pending_ads")
        .update(pendingAdData)
        .eq("pending_ad_id", pending_ad_id)
        .eq("escort_id", authUser.id)
        .select()
        .single();
      
      pendingAd = data;
      dbError = error;
    } else {
      // INSERT
      const { data, error } = await supabase
        .from("pending_ads")
        .insert({
          ...pendingAdData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      pendingAd = data;
      dbError = error;
    }

    // 10. Gestion des erreurs
    if (dbError) {
      // Cleanup
      const cleanupPaths = [...imagePaths, videoUrl].filter(Boolean)
      if (cleanupPaths.length > 0) {
        await supabase.storage.from('adsMedia').remove(
          cleanupPaths.map(url => {
            if (!url) return '';
            const parts = url.split('/');
            return parts.slice(-2).join('/');
          })
        )
      }
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      )
    }

    // 11. Réponse
    return NextResponse.json({
      success: true,
      message: pending_ad_id ? "Ad updated successfully" : "Ad created successfully",
      ad: pendingAd,
      hasVideo: !!videoUrl
    }, { status: pending_ad_id ? 200 : 201 })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}