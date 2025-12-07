'use server'

import { createClient } from "@/lib/supabase/server"
import { AdInsert } from "@/types/supabaseType"
import { revalidatePath } from "next/cache"

const COST = 5 // prix d'une annonce

export async function createAd(
  adData: AdInsert, 
  userId: string, 
  userBalance: number
) {
  try {
    const supabase = await createClient()

    // 1. Vérifier le solde
    if (userBalance < COST) {
      return {
        success: false,
        error: "Insufficient balance. Please recharge your account.",
      }
    }

    // 2. Vérifier que l'utilisateur est un escort
    const { data: userData } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', userId)
      .single()

    if (!userData || userData.user_type !== 'escort') {
      return {
        success: false,
        error: "Only escorts can create ads.",
      }
    }

    // 3. Transaction atomique : débit + création d'annonce
    const { data: transactionResult, error: transactionError } = await supabase.rpc(
      "create_ad_with_debit",
      {
        p_user_id: userId,
        p_cost: COST,
        p_ad_data: {
          ...adData,
          escort_id: userId,
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    )

    if (transactionError) {
      console.error("Transaction error:", transactionError)
      return {
        success: false,
        error: transactionError.message,
      }
    }

    // 4. Revalider les données
    revalidatePath('/manage/ads')
    revalidatePath('/ads')

    return {
      success: true,
      data: transactionResult,
      message: "Ad created successfully!"
    }

  } catch (error: any) {
    console.error("Create ad exception:", error)
    return {
      success: false,
      error: error?.message || "Unknown error",
    }
  }
}

// Fonction pour publier une annonce existante
export async function publishAd(adId: string, userId: string) {
  try {
    const supabase = await createClient()

    // 1. Vérifier que l'annonce appartient à l'utilisateur
    const { data: ad, error: fetchError } = await supabase
      .from('ads')
      .select('*')
      .eq('id', adId)
      .eq('escort_id', userId)
      .single()

    if (fetchError || !ad) {
      return {
        success: false,
        error: "Ad not found or you don't have permission.",
      }
    }

    // 2. Vérifier le solde pour publier
    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', userId)
      .single()

    if (!wallet || wallet.balance < COST) {
      return {
        success: false,
        error: "Insufficient balance to publish ad.",
      }
    }

    // 3. Transaction : débit + mise à jour statut
    const { data: result, error: transactionError } = await supabase.rpc(
      "publish_ad_with_debit",
      {
        p_user_id: userId,
        p_cost: COST,
        p_ad_id: adId
      }
    )

    if (transactionError) {
      return {
        success: false,
        error: transactionError.message,
      }
    }

    // 4. Revalider
    revalidatePath('/manage/ads')
    revalidatePath('/ads')

    return {
      success: true,
      data: result,
      message: "Ad published successfully!"
    }

  } catch (error: any) {
    console.error("Publish ad error:", error)
    return {
      success: false,
      error: error?.message || "Unknown error",
    }
  }
}