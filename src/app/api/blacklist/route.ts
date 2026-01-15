// app/api/blacklist/route.ts
import { createClient } from '@/lib/supabase/client';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier que c'est un escort
    const { data: userProfile } = await supabase
      .from('users')
      .select('user_type')
      .eq('user_id', user.id)
      .single();

    if (userProfile?.user_type !== 'escort') {
      return NextResponse.json({ error: 'Accès réservé aux escorts' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('escort_blacklist')
      .select(`
        *,
        blocked_user:users!blocked_user_id (
          user_id,
          username,
          email,
          created_at
        )
      `)
      .eq('escort_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Error fetching blacklist:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la blacklist' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier que c'est un escort
    const { data: userProfile } = await supabase
      .from('users')
      .select('user_type')
      .eq('user_id', user.id)
      .single();

    if (userProfile?.user_type !== 'escort') {
      return NextResponse.json({ error: 'Accès réservé aux escorts' }, { status: 403 });
    }

    const body = await request.json();
    const { blocked_user_id } = body;

    if (!blocked_user_id) {
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
    }

    // Vérifier que l'utilisateur n'est pas soi-même
    if (user.id === blocked_user_id) {
      return NextResponse.json({ error: 'Vous ne pouvez pas vous bloquer vous-même' }, { status: 400 });
    }

    // Vérifier que l'utilisateur à bloquer est un client
    const { data: userToBlock } = await supabase
      .from('users')
      .select('user_type')
      .eq('user_id', blocked_user_id)
      .single();

    if (!userToBlock || userToBlock.user_type !== 'client') {
      return NextResponse.json({ error: 'Utilisateur non trouvé ou non client' }, { status: 404 });
    }

    const { error } = await supabase
      .from('escort_blacklist')
      .insert({
        escort_id: user.id,
        blocked_user_id
      });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Cet utilisateur est déjà blacklisté' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding to blacklist:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout à la blacklist' },
      { status: 500 }
    );
  }
}