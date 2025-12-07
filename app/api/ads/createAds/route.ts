// app/api/ads/createAds/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const COST = 5

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Vérifier l'authentification côté serveur
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      )
    }

    // 2. Récupérer les données du formulaire
    const formData = await request.json()
    

    // 3. Vérifier le solde
    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', user.id)
      .single()

    if (!wallet || wallet.balance < COST) {
      return NextResponse.json(
        { error: `Insufficient balance. Need $${COST}, you have $${wallet?.balance || 0}` },
        { status: 400 }
      )
    }

    // 4. Vérifier que c'est un escort
    const { data: userData } = await supabase
      .from('users')
      .select('user_type')
      .eq('user_id', user.id) // ⚠️ CORRECTION : user_id au lieu de id
      .single()

    if (!userData || userData.user_type !== 'escort') {
      return NextResponse.json(
        { error: 'Only escorts can create ads' },
        { status: 403 }
      )
    }


    // 5. Créer l'entrée dans pending_ads
    const { data: pendingAd, error: pendingAdError } = await supabase
      .from('pending_ads')
      .insert([{
        escort_id: user.id,
        ...formData, // ⚠️ CORRECTION : Stocke dans ad_data
        status: 'pending',
      }])
      .select()
      .single()

    if (pendingAdError) {
      console.error('Error creating pending ad:', pendingAdError)
      return NextResponse.json(
        { error: 'Failed to save ad: ' + pendingAdError.message },
        { status: 500 }
      )
    }

        // 6. Débiter le wallet
    const { error: debitError } = await supabase.rpc(
      'debit_wallet',
      { user_id_input: user.id, cost_input: COST }
    )

    if (debitError) {
      return NextResponse.json(
        { error: `Payment failed: ${debitError.message}` },
        { status: 500 }
      )
    }

    // 7. Créer la transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        amount: COST,
        type: 'debit',
        reference: `ad_creation_${pendingAd.id}`, // ⚠️ CORRECTION : pendingAd.id
        description: 'Ad creation fee',
      })
      .select()
      .single()

    if (transactionError) {
      console.error('Error creating transaction:', transactionError)
      // On continue même si la transaction échoue, car le débit a déjà été fait
    }

    // 8. Réponse de succès
    return NextResponse.json({
      success: true,
      message: 'Ad submitted successfully! $5 deducted from your balance.',
      pending_ad_id: pendingAd.id, // ⚠️ CORRECTION : pendingAd.id
      new_balance: (wallet.balance - COST),
      transaction_id: transaction?.id
    })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}