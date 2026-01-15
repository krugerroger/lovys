// app/api/admin/ads/pending/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

// 1. Récupérer les pending ads
const { data: pendingAds, error: adsError } = await supabase
  .from('pending_ads')
  .select('*')
  .eq('status', 'approved')
  .order("boost_at", { ascending: false })      // Toujours en premier
  .order("created_at", { ascending: false }); 

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
  id: ad.escort_id,
  escort_id: ad.escort_id,

  // Basic info
  title: ad.title || "Untitled",
  description: ad.description || "",

  // Email + username
  email: ad.email || "No email provided",
  username: ad.username || "No username provided",

  // Location
  location: {
    country: ad.location?.country || "Unknown",
    city: ad.location?.city || "Unknown"
  },

  // OR flattened if you need
  country: ad.location?.country || "Unknown",
  city: ad.location?.city || "Unknown",

  // Physical Details
  physicalDetails: {
    age: ad.physicalDetails?.age || null,
    height: ad.physicalDetails?.height || "",
    weight: ad.physicalDetails?.weight || "",
    bust: ad.physicalDetails?.bust || ""
  },

  // Rates
  rates: {
    thirtyMinutes: ad.rates?.thirtyMinutes || null,
    oneHour: ad.rates?.oneHour || null,
    twoHours: ad.rates?.twoHours || null,
    fullNight: ad.rates?.fullNight || null
  },

  // Services
  services: {
    enabled: ad.services?.enabled || false,
    price: ad.services?.price || null,
    comment: ad.services?.comment || ""
  },

  // Contacts
  contacts: {
    phoneNumber: ad.contacts?.phoneNumber || "",
    whatsapp: ad.contacts?.whatsapp || "",
    telegram: ad.contacts?.telegram || "",
    instagram: ad.contacts?.instagram || "",
    twitch: ad.contacts?.twitch || "",
    fansly: ad.contacts?.fansly || "",
    onlyfans: ad.contacts?.onlyfans || "",
    twitter: ad.contacts?.twitter || "",
    signal: ad.contacts?.signal || ""
  },

  // Categories array
  categories: ad.categories || [],

  // Images
  images: ad.images || [],

  // Status
  status: ad.status,

  // Timestamps
  created_at: ad.created_at,
  updated_at: ad.updated_at || null
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