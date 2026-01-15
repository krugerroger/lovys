// app/api/ads/position/route.ts
import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')
  
  if (!city) {
    return NextResponse.json({
      success: false,
      error: "City parameter is required"
    }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    
    const { data: ads, error } = await supabase
      .from('pending_ads')
      .select('pending_ad_id, created_at, city_boosted_at')
      .eq('status', 'approved')
      .ilike('location->>city', `%${city}%`)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      ads: ads || [],
      count: ads?.length || 0,
      city: city
    })
    
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || "Internal server error"
    }, { status: 500 })
  }
}