// lib/supabase/ads.ts
import { createClient } from './server'
import { AdInsert, AdUpdate, Database } from '@/types/supabaseType'



// export async function createAd(adData: AdInsert) {
//   const { user } = useUser()
  
//   try {
//     const supabase = createClient();

//      const COST = 5; // prix d'une annonce

//   // 1️⃣ Récupérer utilisateur connecté

//   const userId = user?.user_id;

//   // 2️⃣ Vérifier son solde

//   if (!user || user.balance < COST) {
//     return {
//       success: false,
//       error: "Solde insuffisant. Veuillez recharger votre compte.",
//     };
//   }

//   // 3️⃣ Débiter le wallet (transaction atomique)
//   const { data: updatedWallet, error: updateErr } = await supabase.rpc(
//     "debit_wallet",
//     { user_id_input: userId, cost_input: COST }
//   );

//   if (updateErr) return { success: false, error: updateErr.message };

//     const { data, error } = await supabase
//       .from('ads')
//       .insert([{
//         ...adData,
//         status: 'draft',
//       }])
//       .select()
//       .single();

//     if (error) {
//       console.error("Create ad error:", error);
//       return {
//         success: false,
//         error: error.message,
//         data: null
//       };
//     }

//     return {
//       success: true,
//       data: JSON.parse(JSON.stringify(data)),
//       error: null
//     };

//   } catch (err: any) {
//     console.error("Create ad exception:", err);
//     return {
//       success: false,
//       error: err?.message ?? "Unknown error",
//       data: null
//     };
//   }
// }



export async function updateAd(id: string, adData: AdUpdate) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('ads')
      .update({
        ...adData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update ad error:', error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data, error: null }
  } catch (error: any) {
    console.error('Update ad exception:', error)
    return { success: false, error: error.message, data: null }
  }
}

export async function getAd(id: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('ads')
      .select(`
        *,
        escort:escort_id (
          id,
          username,
          professional_name,
          profile_image
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Get ad error:', error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data, error: null }
  } catch (error: any) {
    console.error('Get ad exception:', error)
    return { success: false, error: error.message, data: null }
  }
}

export async function getUserAds(userId: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .eq('escort_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get user ads error:', error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data, error: null }
  } catch (error: any) {
    console.error('Get user ads exception:', error)
    return { success: false, error: error.message, data: null }
  }
}

export async function publishAd(id: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('ads')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Publish ad error:', error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data, error: null }
  } catch (error: any) {
    console.error('Publish ad exception:', error)
    return { success: false, error: error.message, data: null }
  }
}

export async function archiveAd(id: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('ads')
      .update({
        status: 'archived',
        archived_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Archive ad error:', error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data, error: null }
  } catch (error: any) {
    console.error('Archive ad exception:', error)
    return { success: false, error: error.message, data: null }
  }
}

export async function deleteAd(id: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('ads')
      .update({
        status: 'deleted',
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Delete ad error:', error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data, error: null }
  } catch (error: any) {
    console.error('Delete ad exception:', error)
    return { success: false, error: error.message, data: null }
  }
}

export async function searchAds(filters: {
  city?: string
  services?: string[]
  price_min?: number
  price_max?: number
  rating_min?: number
  categories?: string[]
  limit?: number
  offset?: number
}) {
  try {
    const supabase = await createClient()
    
    let query = supabase
      .from('ads')
      .select(`
        *,
        escort:escort_id (
          id,
          username,
          professional_name,
          profile_image,
          rating
        )
      `, { count: 'exact' })
      .eq('status', 'published')

    // Appliquer les filtres
    if (filters.city) {
      query = query.or(`city.ilike.%${filters.city}%,country.ilike.%${filters.city}%`)
    }

    if (filters.price_min !== undefined) {
      query = query.gte('rates->one_hour', filters.price_min)
    }

    if (filters.price_max !== undefined) {
      query = query.lte('rates->one_hour', filters.price_max)
    }

    if (filters.rating_min !== undefined) {
      query = query.gte('escort.rating', filters.rating_min)
    }

    if (filters.categories && filters.categories.length > 0) {
      query = query.overlaps('categories', filters.categories)
    }

    // Services (recherche dans les services JSON)
    if (filters.services && filters.services.length > 0) {
      filters.services.forEach(service => {
        query = query.contains('services', { [service]: { enabled: true } })
      })
    }

    // Pagination
    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    // Tri par défaut
    query = query.order('published_at', { ascending: false })

    const { data, error, count } = await query

    if (error) {
      console.error('Search ads error:', error)
      return { success: false, error: error.message, data: null, count: 0 }
    }

    return { success: true, data, count, error: null }
  } catch (error: any) {
    console.error('Search ads exception:', error)
    return { success: false, error: error.message, data: null, count: 0 }
  }
}

export async function incrementAdViews(id: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase.rpc('increment_ad_views', {
      ad_id: id
    })

    if (error) {
      console.error('Increment views error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error('Increment views exception:', error)
    return { success: false, error: error.message }
  }
}

export async function getAdStats(userId: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('ads')
      .select('status')
      .eq('escort_id', userId)

    if (error) {
      console.error('Get ad stats error:', error)
      return { success: false, error: error.message, data: null }
    }

    // Aggregate counts per status on the client side
    const stats = (data || []).reduce((acc: Record<string, number>, row: any) => {
      const status = row.status || 'unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    return { success: true, data: stats, error: null }
  } catch (error: any) {
    console.error('Get ad stats exception:', error)
    return { success: false, error: error.message, data: null }
  }
}