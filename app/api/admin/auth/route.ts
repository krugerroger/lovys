// app/api/admin/auth/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // 1. Authentification avec Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // 2. Vérifier si l'utilisateur est admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('user_type, is_active')
      .eq('user_id', authData.user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 401 }
      )
    }

    // 3. Vérifier les permissions admin
    if (userData.user_type !== 'admin') {
      // Déconnexion si pas admin
      await supabase.auth.signOut()
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    // 4. Vérifier si le compte est actif
    if (!userData.is_active) {
      await supabase.auth.signOut()
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        user_type: userData.user_type,
      },
      session: authData.session
    })

  } catch (error: any) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}