"use client";
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signIn } from '@/lib/supabase/auth-action';

export default function SignInForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

// Dans SignInForm.tsx
const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setIsLoading(true);
  
  try {
    // Utilisation de l'action serveur pour la connexion
    const result = await signIn(formData.email, formData.password);

    if (result.error) {
      throw new Error(result.error);
    }

    if (result.success) {
      // Succès - le middleware redirigera automatiquement
      toast.success("Successfully signed in! Welcome back!");
      
      
      // Rafraîchir la page pour déclencher le middleware
      // Le middleware redirigera automatiquement vers la bonne page
      router.refresh();
    }

  } catch (error: any) {
    console.error('Sign in error:', error);
    toast.error("Sign in failed: " + (error.message || "An error occurred during sign in. Please try again."));
    setErrors({ submit: error.message });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="bg-linear-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left Side - Form */}
          <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 md:p-10 border border-gray-700/50 shadow-2xl">
            <div className="mb-8">
              <div className="w-16 h-16 bg-linear-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-400 text-center text-sm">
                Sign in to access your account
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-white text-sm font-medium">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className={`w-full pl-10 pr-4 py-3.5 bg-gray-900/70 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 hover:border-gray-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-2 mt-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm">{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-white text-sm font-medium">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-12 py-3.5 bg-gray-900/70 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 hover:border-gray-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-2 mt-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm">{errors.password}</span>
                  </div>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <a
                  href="/forgot-password"
                  className="text-sm text-cyan-400 hover:text-cyan-300 underline"
                >
                  Forgot your password?
                </a>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-linear-to-r from-cyan-500 to-cyan-600 text-white rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Sign In
                    </>
                  )}
                </button>
                
                {errors.submit && (
                  <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-300 text-sm">{errors.submit}</span>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Right Side - Info */}
          <div className="flex flex-col justify-center">
            <div className="bg-linear-to-br from-gray-800/50 to-gray-900/30 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-gray-700/30 h-full">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Don't have an account?
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Button to create new account */}
                    <button 
                      onClick={() => router.push('/register')}
                      className="w-full py-4 border-2 border-cyan-400 text-cyan-400 rounded-xl hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300 font-semibold text-lg group"
                    >
                      Create a New Account
                    </button>

                    {/* Or register as specific type */}
                    <div className="text-center">
                      <p className="text-gray-400 text-sm mb-4">
                        Or register as:
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => router.push('/register/user')}
                          className="flex-1 py-3 border border-gray-600 text-white rounded-xl hover:bg-gray-700/50 transition-all font-medium"
                        >
                          User
                        </button>
                        <button
                          onClick={() => router.push('/register/escort')}
                          className="flex-1 py-3 border border-pink-600 text-pink-400 rounded-xl hover:bg-pink-600/20 transition-all font-medium"
                        >
                          Escort
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-700/50">
                  <h4 className="font-semibold text-white mb-3">Features:</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      Secure authentication
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      Personalized dashboard
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      Easy account management
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}