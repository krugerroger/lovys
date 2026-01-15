"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Home, Mail, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/[locale]/context/userContext';
import { useScopedI18n } from '../../../../../locales/client';

export default function ProfileSettingsPage() {
  const { user, refreshUser } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    newPassword: '',
    currentPassword: ''
  });

  const t = useScopedI18n('Profile.Settings' as never) as (key: string, vars?: Record<string, any>) => string;

  // ✅ Initialiser formData quand user est chargé
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        username: user.username || '',
        newPassword: '',
        currentPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ Fonction de sauvegarde avec validation et API
  const handleSave = async () => {
    if (!user) {
      toast.error(t('messages.loginRequired'));
      return;
    }

    // Validation
    if (!formData.username.trim()) {
      toast.error(t('messages.usernameRequired'));
      return;
    }

    if (formData.newPassword && !formData.currentPassword) {
      toast.error(t('messages.currentPasswordRequired'));
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      toast.error(t('messages.passwordLength'));
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();

      // 1. Mettre à jour le username dans la table users
      if (formData.username !== user.username) {
        const { error: usernameError } = await supabase
          .from('users')
          .update({ username: formData.username })
          .eq('user_id', user.user_id);

        if (usernameError) throw usernameError;
      }

      // 2. Mettre à jour l'email si changé
      if (formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email
        });

        if (emailError) throw emailError;
        toast.info(t('messages.emailConfirmationSent'));
      }

      // 3. Mettre à jour le mot de passe si fourni
      if (formData.newPassword && formData.currentPassword) {
        // Vérifier d'abord le mot de passe actuel
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email || '',
          password: formData.currentPassword
        });

        if (signInError) {
          toast.error(t('messages.currentPasswordIncorrect'));
          setLoading(false);
          return;
        }

        // Mettre à jour le mot de passe
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.newPassword
        });

        if (passwordError) throw passwordError;
      }

      toast.success(t('messages.updateSuccess'));
      
      // Réinitialiser les champs de mot de passe
      setFormData({
        ...formData,
        newPassword: '',
        currentPassword: ''
      });

      // Rafraîchir les données utilisateur
      if (refreshUser) {
        await refreshUser();
      }

    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || t('messages.updateError'));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fonction pour retourner à l'accueil
  const handleGoHome = () => {
    router.push('/');
  };

  // ✅ Afficher un loader si l'utilisateur n'est pas chargé
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800">
      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {/* En-tête avec titre et bouton retour mobile */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t('title')}
              </h1>
              <p className="text-gray-600 mt-1">
                {t('subtitle')}
              </p>
            </div>
            
            {/* Bouton Accueil pour mobile/tablette */}
            <button
              onClick={handleGoHome}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2 text-sm md:text-base"
            >
              <Home className="w-4 h-4" />
              {t('goHome')}
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                {t('email')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('emailHelper')}
              </p>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                {t('username')}
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Séparateur */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t('changePassword')}
              </h3>
            </div>

            {/* New password */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                {t('newPassword')}
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                disabled={loading}
                placeholder={t('newPasswordPlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Current password */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                {t('currentPassword')}
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                disabled={loading}
                placeholder={t('currentPasswordPlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('saving')}
                </>
              ) : (
                t('save')
              )}
            </button>
          </div>

          {/* Contact with administrator */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {t('contactAdmin')}
              </h2>
            </div>
            <p className="text-gray-700">
              Please, send message to{' '}
              <a 
                href="mailto:info@lovira.com" 
                className="text-blue-600 hover:underline font-medium"
              >
                info@lovira.com
              </a>
            </p>
          </div>

          {/* Delete account */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Trash2 className="w-6 h-6 text-red-500" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {t('deleteAccount')}
              </h2>
            </div>
            <p className="text-gray-700">
              {t('deleteAccountMessage', { email: 'info@lovira.com' })}
            </p>
          </div>

          {/* Boutons d'action en bas */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGoHome}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition font-medium flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              {t('backToHome')}
            </button>
            
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('saving')}
                </>
              ) : (
                t('saveChanges')
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}