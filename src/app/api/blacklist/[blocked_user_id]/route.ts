// app/api/blacklist/[blocked_user_id]/route.ts
import { createClient } from '@/lib/supabase/client';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { blocked_user_id: string } }
) {
  try {
    const supabase = createClient();
    const blockedUserId = params.blocked_user_id;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { error } = await supabase
      .from('escort_blacklist')
      .delete()
      .eq('escort_id', user.id)
      .eq('blocked_user_id', blockedUserId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error removing from blacklist:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la blacklist' },
      { status: 500 }
    );
  }
}