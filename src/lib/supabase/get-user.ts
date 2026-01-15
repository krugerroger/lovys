// lib/supabase/get-user.ts
import { createServerSupabaseClient } from './server'

export async function getUser() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getUserRole() {
  const user = await getUser()
  return user?.user_metadata?.role || 'user'
}

