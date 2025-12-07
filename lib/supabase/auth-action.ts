// lib/supabase/auth-actions.ts
'use server'

import { createClient } from './server'
import { revalidatePath } from 'next/cache'

export async function signIn(email: string, password: string) {
  const supabase = await createClient()
  
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please try again.');
      } else if (authError.message.includes('Email not confirmed')) {
        throw new Error('Please verify your email address before signing in.');
      } else {
        throw new Error(authError.message);
      }
    }

    if (authData.user) {
      // Revalider toutes les pages après la connexion
      revalidatePath('/', 'layout')
      
      return { 
        success: true, 
        data: { user: authData.user },
        error: null
      };
    }

    throw new Error('Authentication failed');
    
  } catch (error: any) {
    console.error('Sign in error:', error)
    return { 
      success: false, 
      data: null,
      error: error.message || 'An error occurred during sign in' 
    };
  }
}

export async function signUp(
  email: string,
  password: string,
  username: string,
  userType: 'client' | 'escort' = 'client'
) {
  const supabase = await createClient()
  
  try {
    // 1. Validation des données
    if (!email || !password || !username) {
      throw new Error('Please fill in all required fields.')
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.')
    }

    if (username.length < 3) {
      throw new Error('Username must be at least 3 characters long.')
    }

    // 2. Vérifier si l'email existe déjà
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle()

    if (checkError) {
      console.error('Error checking existing user:', checkError)
    }

    if (existingUser) {
      throw new Error('This email is already registered. Please sign in instead.')
    }

    // 3. Créer le compte d'authentification
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          username: username.trim(),
          user_type: userType,
          email: email.trim(),
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (authError) {
      // Gestion des erreurs spécifiques
      if (authError.message.includes('already registered')) {
        throw new Error('This email is already registered. Please sign in instead.')
      } else if (authError.message.includes('password')) {
        throw new Error('Password requirements not met. Please try a stronger password.')
      } else if (authError.message.includes('rate limit')) {
        throw new Error('Too many attempts. Please try again later.')
      } else if (authError.message.includes('email')) {
        throw new Error('Please enter a valid email address.')
      } else {
        console.error('Sign up auth error:', authError)
        throw new Error('Registration failed. Please try again.')
      }
    }

    if (!authData.user) {
      throw new Error('User account creation failed. Please try again.')
    }

    // 4. Créer le profil utilisateur dans la table users
    const { error: userError } = await supabase
      .from('users')
      .insert({
        user_id: authData.user.id,
        email: email.trim(),
        username: username.trim(),
        user_type: userType,
      })

    if (userError) {
      console.error('Error creating user profile:', userError)
      
      // Tentative de suppression du compte auth si le profil échoue
      if (authData.user) {
        await supabase.auth.admin.deleteUser(authData.user.id).catch(console.error)
      }
      
      if (userError.code === '23505') { // Violation de contrainte unique
        if (userError.message.includes('username')) {
          throw new Error('This username is already taken. Please choose another one.')
        } else if (userError.message.includes('email')) {
          throw new Error('This email is already registered. Please sign in instead.')
        }
      }
      
      throw new Error('Failed to create user profile. Please try again.')
    }

    // 5. Créer le portefeuille utilisateur
    const { error: walletError } = await supabase
      .from('wallets')
      .insert({
        user_id: authData.user.id,
        balance: 0,
      })

    if (walletError) {
      console.error('Error creating user wallet:', walletError)
      // On ne jette pas d'erreur ici car l'utilisateur est créé
      // Le portefeuille peut être créé plus tard
    }

    // 6. Si c'est un escort, créer une entrée dans la table escorts
    if (userType === 'escort') {
      const { error: escortError } = await supabase
        .from('escorts')
        .insert({
          user_id: authData.user.id,
          is_verified: false,
          is_active: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (escortError) {
        console.error('Error creating escort profile:', escortError)
        // On ne jette pas d'erreur ici, l'utilisateur peut compléter son profil plus tard
      }
    }

    // 7. Revalider les données
    revalidatePath('/', 'layout')

    // 8. Retourner la réponse
    const requiresEmailVerification = !authData.session
    
    return { 
      success: true, 
      requiresEmailVerification,
      message: requiresEmailVerification 
        ? 'Please check your email to verify your account before signing in.'
        : 'Account created successfully! You are now signed in.',
      data: { 
        user: authData.user,
        session: authData.session 
      },
      error: null
    }
    
  } catch (error: any) {
    console.error('Sign up error:', error)
    
    // Ne pas logger les mots de passe
    const safeError = error.message 
      ? error.message.replace(/password/gi, '********')
      : 'An error occurred during registration'
    
    return { 
      success: false, 
      requiresEmailVerification: false,
      message: null,
      data: null,
      error: safeError 
    }
  }
}

export async function signOut() {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/', 'layout');
    return { success: true, error: null };
    
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCurrentUser() {
  const supabase = await createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw new Error(error.message);
    }

    if (!user) {
      return { user: null, error: null };
    }

    // Récupérer les informations utilisateur supplémentaires
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return { 
      user, 
      profile: userData,
      error: null
    };
    
  } catch (error: any) {
    return { user: null, profile: null, error: error.message };
  }
}