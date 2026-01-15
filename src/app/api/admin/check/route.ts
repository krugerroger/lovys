// app/api/admin/check/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // 1. Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { isAdmin: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // 2. Vérifier les permissions admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('user_type, is_active')
      .eq('user_id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { isAdmin: false, error: 'User not found' },
        { status: 401 }
      )
    }

    // 3. Vérifier si admin actif
    const isAdmin = userData.user_type === 'admin' && userData.is_active

    if (!isAdmin) {
      return NextResponse.json(
        { isAdmin: false, error: 'Admin privileges required' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      isAdmin: true,
      user: {
        id: user.id,
        email: user.email,
        user_type: userData.user_type,
      }
    })

  } catch (error: any) {
    console.error('Admin check error:', error)
    return NextResponse.json(
      { isAdmin: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}