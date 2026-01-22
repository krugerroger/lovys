// app/api/ads/createAds/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // Important pour les uploads de fichiers

export async function POST(request: NextRequest) {
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

    // 2. Lire FormData
    const form = await request.formData()

    const categoriesString = form.get('categories') as string || '';
    const rawCategories = form.get("categories");
    const rawServices = form.get("services");

    // 3. Récupérer les fichiers images
    const images = form.getAll('images') as File[]
    
    // 4. Récupérer la vidéo (si elle existe)
    const videoFile = form.get('video') as File | null
    
    // 5. Validation et upload des images
    const imagePaths: string[] = []
    
    if (images.length > 0) {
      // Limiter le nombre d'images (ex: 10 max)
      const maxImages = 10
      const imagesToUpload = images.slice(0, maxImages)
      
      for (const image of imagesToUpload) {
        // Vérification de la taille (ex: 5MB max par image)
        if (image.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: `L'image ${image.name} est trop volumineuse (max 5MB)` },
            { status: 400 }
          )
        }
        
        // Vérification du type de fichier
        const fileExt = image.name.split('.').pop()?.toLowerCase()
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif']
        
        if (!fileExt || !allowedExtensions.includes(fileExt)) {
          return NextResponse.json(
            { error: `Type de fichier non autorisé pour ${image.name} (seuls JPG, PNG, WEBP, GIF sont acceptés)` },
            { status: 400 }
          )
        }
        
        // Générer un nom de fichier unique
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}_${image.name}`
        const filePath = `ads/${authUser.id}/${fileName}`
        
        // Upload de l'image
        const { error: uploadError } = await supabase.storage
          .from('adsMedia') // Nom du bucket dans Supabase Storage
          .upload(filePath, image, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (uploadError) {
          console.error('Upload error:', uploadError)
          // Supprimer les images déjà uploadées en cas d'erreur
          if (imagePaths.length > 0) {
            await supabase.storage.from('adsMedia').remove(imagePaths)
          }
          return NextResponse.json(
            { error: `Failed to upload image ${image.name}: ${uploadError.message}` },
            { status: 500 }
          )
        }
        
        // Récupération de l'URL publique
        const { data: { publicUrl } } = supabase.storage
          .from('adsMedia')
          .getPublicUrl(filePath)
        
        imagePaths.push(publicUrl)
      }
    }

    // 6. Upload de la vidéo (si elle existe)
    let videoUrl: string | null = null
    
    if (videoFile && videoFile.size > 0) {
      // Vérification de la taille de la vidéo (ex: 50MB max)
      const maxVideoSize = 50 * 1024 * 1024 // 50MB
      if (videoFile.size > maxVideoSize) {
        // Nettoyer les images déjà uploadées
        if (imagePaths.length > 0) {
          await supabase.storage.from('adsMedia').remove(imagePaths)
        }
        return NextResponse.json(
          { error: `La vidéo ${videoFile.name} est trop volumineuse (max 50MB)` },
          { status: 400 }
        )
      }
      
      // Vérification du type de fichier vidéo
      const videoFileExt = videoFile.name.split('.').pop()?.toLowerCase()
      const allowedVideoExtensions = ['mp4', 'webm', 'mov', 'avi', 'mkv']
      
      if (!videoFileExt || !allowedVideoExtensions.includes(videoFileExt)) {
        // Nettoyer les images déjà uploadées
        if (imagePaths.length > 0) {
          await supabase.storage.from('adsMedia').remove(imagePaths)
        }
        return NextResponse.json(
          { error: `Type de fichier vidéo non autorisé pour ${videoFile.name} (seuls MP4, WebM, MOV, AVI, MKV sont acceptés)` },
          { status: 400 }
        )
      }
      
      // Générer un nom de fichier unique pour la vidéo
      const videoFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}_${videoFile.name}`
      const videoFilePath = `videos/${authUser.id}/${videoFileName}`
      
      try {
        // Upload de la vidéo
        const { error: videoUploadError } = await supabase.storage
          .from('adsMedia') // Même bucket ou un bucket dédié
          .upload(videoFilePath, videoFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: `video/${videoFileExt}`
          })
        
        if (videoUploadError) {
          console.error('Video upload error:', videoUploadError)
          // Nettoyer les images déjà uploadées
          if (imagePaths.length > 0) {
            await supabase.storage.from('adsMedia').remove(imagePaths)
          }
          return NextResponse.json(
            { error: `Failed to upload video ${videoFile.name}: ${videoUploadError.message}` },
            { status: 500 }
          )
        }
        
        // Récupération de l'URL publique de la vidéo
        const { data: { publicUrl: videoPublicUrl } } = supabase.storage
          .from('adsMedia')
          .getPublicUrl(videoFilePath)
        
        videoUrl = videoPublicUrl
        
      } catch (videoError: any) {
        console.error('Video processing error:', videoError)
        // Nettoyer les images déjà uploadées
        if (imagePaths.length > 0) {
          await supabase.storage.from('adsMedia').remove(imagePaths)
        }
        return NextResponse.json(
          { error: `Error processing video: ${videoError.message}` },
          { status: 500 }
        )
      }
    }

    // 7. Extraire et parser les champs
    const pendingAdData = {
      escort_id: authUser.id,
      title: form.get("title") as string,
      email: authUser.email || "",
      username: form.get("username") as string,

      // Location reconstruite depuis les champs individuels
      location: {
        country: form.get("location_country") as string || "",
        city: form.get("location_city") as string || "",
      },

      // PhysicalDetails reconstruit depuis les champs individuels
      physicalDetails: {
        age: parseInt(form.get("physicalAge") as string) || null,
        height: form.get("physicalHeight") as string || "",
        weight: form.get("physicalWeight") as string || "",
        bust: form.get("physicalBust") as string || ""
      },

      // Rates reconstruit depuis les champs individuels
      rates: {
        thirtyMinutes: parseFloat(form.get("ratesThirtyMinutes") as string) || null,
        oneHour: parseFloat(form.get("ratesOneHour") as string) || null,
        twoHours: parseFloat(form.get("ratesTwoHours") as string) || null,
        fullNight: parseFloat(form.get("ratesOvernight") as string) || null
      },

      // Services reconstruit depuis les champs individuels
      services: rawServices ? JSON.parse(rawServices as string) : {},

      // Contacts reconstruit depuis les champs individuels
      contacts: {
        phoneNumber: form.get("contactsPhoneNumber") as string || "",
        whatsapp: form.get("contactsWhatsapp") as string || "",
        telegram: form.get("contactsTelegram") as string || "",
        instagram: form.get("contactsInstagram") as string || "",
        twitch: form.get("contactsTwitch") as string || "",
        fansly: form.get("contactsFansly") as string || "",
        onlyfans: form.get("contactsOnlyfans") as string || "",
        twitter: form.get("contactsTwitter") as string || "",
        signal: form.get("contactsSignal") as string || ""
      },

      // Images uploadées
      images: imagePaths,

      // URL de la vidéo (si elle existe)
      video_url: videoUrl,

      // Catégories parsées depuis string séparée par |
      categories: rawCategories ? JSON.parse(rawCategories as string) : {},

      description: form.get("description") as string || "",
      currency: form.get("currency") as string || "USD",
      
      status: "approved", // Par défaut à "approved" pour publication immédiate
    };

    // 8. Validation des champs obligatoires
    if (!pendingAdData.title || !pendingAdData.location.country || !pendingAdData.location.city) {
      // Nettoyage des fichiers uploadés si validation échoue
      const filesToRemove: string[] = [...imagePaths]
      if (videoUrl) filesToRemove.push(videoUrl)
      
      if (filesToRemove.length > 0) {
        await supabase.storage.from('adsMedia').remove(
          filesToRemove.map(url => {
            const match = url.match(/(ads|videos)\/(.*)$/)
            return match ? match[0] : url
          })
        )
      }
      return NextResponse.json(
        { error: "Missing required fields: title, country, city" },
        { status: 400 }
      )
    }

    // 10. INSÉRER la nouvelle annonce avec les images et la vidéo
    const { data, error } = await supabase
      .from("pending_ads")
      .insert({
        ...pendingAdData,
      })
      .select()
      .single()

    if (error) {
      // Nettoyage des fichiers uploadés si insertion échoue
      const filesToRemove: string[] = [...imagePaths]
      if (videoUrl) filesToRemove.push(videoUrl)
      
      if (filesToRemove.length > 0) {
        await supabase.storage.from('adsMedia').remove(
          filesToRemove.map(url => {
            const match = url.match(/(ads|videos)\/(.*)$/)
            return match ? match[0] : url
          })
        )
      }
      return NextResponse.json({ 
        error: "Failed to save ad: " + error.message 
      }, { status: 500 })
    }

    const pendingAd = data

    return NextResponse.json({
      success: true,
      message: "Ad saved successfully",
      ad: pendingAd,
      hasVideo: !!videoUrl
    }, { status: 201 })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    )
  }
}