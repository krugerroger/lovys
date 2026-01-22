// app/api/admin/ads/[id]/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

type Params = Promise<{ id: string }>

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Ad ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('pending_ads')
      .select('pending_ad_id, title, city, escort_id, email, created_at')
      .eq('pending_ad_id', id)

    if (error) {
      console.error('Error fetching ad:', error)
      return NextResponse.json(
        { error: 'Ad not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      ad: data,
      message: 'Ad found successfully'
    })

  } catch (error) {
    console.error('Error in ad search API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    if (!id) {
      return NextResponse.json(
        { error: 'Ad ID is required' },
        { status: 400 }
      )
    }

    const { error: deleteError } = await supabase
      .from('pending_ads')
      .delete()
      .eq('pending_ad_id', id)

    if (deleteError) {
      console.error('Error deleting ad:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete ad' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Ad deleted successfully',
      deletedId: id
    })

  } catch (error) {
    console.error('Error in delete ad API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}