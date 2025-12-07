// // app/actions/ads.ts
// 'use server'

// import { createAd, updateAd, publishAd, archiveAd, deleteAd } from '@/lib/supabase/ads'
// import { AdInsert } from '@/types/supabaseType'
// import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'

// export async function createAdAction(formData: FormData) {
//   try {
//     const adData = {
//       escort_id: formData.get('escort_id') as string,
//       title: formData.get('title') as string,
//       description: formData.get('description') as string,
//       location: JSON.parse(formData.get('location') as string),
//       physical_details: JSON.parse(formData.get('physical_details') as string),
//       rates: JSON.parse(formData.get('rates') as string),
//       services: JSON.parse(formData.get('services') as string),
//       contacts: JSON.parse(formData.get('contacts') as string),
//       categories: JSON.parse(formData.get('categories') as string),
//       currency: formData.get('currency') as string,
//     }

//     const result = await createAd(adData as AdInsert)
    
//     if (!result.success) {
//       return { success: false, error: result.error }
//     }

//     revalidatePath('/manage/ads')
//     return { success: true, data: result.data }
    
//   } catch (error: any) {
//     console.error('Create ad action error:', error)
//     return { success: false, error: error.message }
//   }
// }

// export async function updateAdAction(id: string, formData: FormData) {
//   try {
//     const adData = {
//       title: formData.get('title') as string,
//       description: formData.get('description') as string,
//       location: JSON.parse(formData.get('location') as string),
//       physical_details: JSON.parse(formData.get('physical_details') as string),
//       rates: JSON.parse(formData.get('rates') as string),
//       services: JSON.parse(formData.get('services') as string),
//       contacts: JSON.parse(formData.get('contacts') as string),
//       categories: JSON.parse(formData.get('categories') as string),
//       currency: formData.get('currency') as string,
//     }

//     const result = await updateAd(id, adData)
    
//     if (!result.success) {
//       return { success: false, error: result.error }
//     }

//     revalidatePath('/manage/ads')
//     revalidatePath(`/manage/ads/${id}`)
//     return { success: true, data: result.data }
    
//   } catch (error: any) {
//     console.error('Update ad action error:', error)
//     return { success: false, error: error.message }
//   }
// }

// export async function publishAdAction(id: string) {
//   try {
//     const result = await publishAd(id)
    
//     if (!result.success) {
//       return { success: false, error: result.error }
//     }

//     revalidatePath('/manage/ads')
//     revalidatePath(`/manage/ads/${id}`)
//     revalidatePath('/ads')
//     return { success: true, data: result.data }
    
//   } catch (error: any) {
//     console.error('Publish ad action error:', error)
//     return { success: false, error: error.message }
//   }
// }

// export async function archiveAdAction(id: string) {
//   try {
//     const result = await archiveAd(id)
    
//     if (!result.success) {
//       return { success: false, error: result.error }
//     }

//     revalidatePath('/manage/ads')
//     revalidatePath(`/manage/ads/${id}`)
//     return { success: true, data: result.data }
    
//   } catch (error: any) {
//     console.error('Archive ad action error:', error)
//     return { success: false, error: error.message }
//   }
// }

// export async function deleteAdAction(id: string) {
//   try {
//     const result = await deleteAd(id)
    
//     if (!result.success) {
//       return { success: false, error: result.error }
//     }

//     revalidatePath('/manage/ads')
//     redirect('/manage/ads')
    
//   } catch (error: any) {
//     console.error('Delete ad action error:', error)
//     return { success: false, error: error.message }
//   }
// }