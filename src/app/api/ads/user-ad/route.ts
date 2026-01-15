import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// app/api/ads/user-ad/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  
  const supabase = await createClient()
  const { data: ad } = await supabase
    .from('pending_ads')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'approved')
    .single()
  
  return NextResponse.json({ 
    success: !!ad, 
    ad 
  })
}

