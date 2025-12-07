"user client"
import { EyeOff, Eye, User, Mail, Lock, AlertCircle, CheckCircle, Star } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUp } from "@/lib/supabase/auth-action";

export default function EscortRegistrationForm({
  isOpen,
  setIsOpen,
  onBack,
  onSwitchToLogin
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onBack: () => void;
  onSwitchToLogin: () => void;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Utilisation de l'action serveur pour l'inscription
      const result = await signUp(
        formData.email,
        formData.password,
        formData.username,
        'escort' // userType
      );

      if (result.error) {
        throw new Error(result.error.message || result.error || "Unknown error");

      }

      if (result.success) {
        if (result.requiresEmailVerification) {
          // Email de vérification envoyé
          toast.success(
            "Account created successfully! 🎉",
            {
              description: result.message || "Please check your email to verify your account."
            }
          );
        } else {
          // Compte créé et directement connecté
          toast.success(
            "Escort account created successfully! 🎉",
            {
              description: "Welcome to our platform!"
            }
          );
          
          // Fermer la popup
          setIsOpen(false);
          
          // Le middleware redirigera automatiquement vers /manage/dashboard
          router.refresh();

        }

        // Réinitialisation du formulaire
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      }

    } catch (error) {
      console.error('Registration error:', error);
      
      toast.error(
        "Registration failed",
        {
          description: error instanceof Error ? error.message : "An error occurred during registration. Please try again."
        }
      );
      
      setErrors({ 
        submit: error instanceof Error ? error.message : "Registration failed. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-linear-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left Side - Form */}
          <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 md:p-10 border border-gray-700/50 shadow-2xl">
            <div className="mb-8">
              <div className="w-16 h-16 bg-linear-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Create Escort Account
              </h2>
              <p className="text-gray-400 text-center text-sm">
                Join our professional platform
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Username */}
              <div>
                <label className="block text-white text-sm font-medium mb-3">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-500 group-focus-within:text-pink-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    className={`w-full pl-10 pr-4 py-3.5 bg-gray-900/70 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-gray-500 ${
                      errors.username ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                </div>
                {errors.username && (
                  <div className="flex items-center gap-2 mt-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm">{errors.username}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-white text-sm font-medium mb-3">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-500 group-focus-within:text-pink-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className={`w-full pl-10 pr-4 py-3.5 bg-gray-900/70 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-gray-500 ${
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
                <label className="block text-white text-sm font-medium mb-3">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-pink-400 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a secure password"
                    className={`w-full pl-10 pr-12 py-3.5 bg-gray-900/70 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-gray-500 ${
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

              {/* Confirm Password */}
              <div>
                <label className="block text-white text-sm font-medium mb-3">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-pink-400 transition-colors" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={`w-full pl-10 pr-12 py-3.5 bg-gray-900/70 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-gray-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center gap-2 mt-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm">{errors.confirmPassword}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-linear-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-pink-500/20 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Star className="w-5 h-5" />
                      Create Escort Account
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

            <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="text-pink-400 hover:text-pink-300 font-medium underline transition-colors"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>

          {/* Right Side - Info */}
          <div className="flex flex-col justify-center">
            <div className="bg-linear-to-br from-gray-800/50 to-gray-900/30 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-gray-700/30 h-full">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Benefits for Escorts
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-lg mb-1">Quick Setup</h4>
                        <p className="text-gray-300">
                          Get started in minutes with our simple registration process.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-lg mb-1">Unlimited Adverts</h4>
                        <p className="text-gray-300">
                          Post as many advertisements as you need for your services.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-lg mb-1">Large Client Base</h4>
                        <p className="text-gray-300">
                          Access thousands of verified clients looking for services.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer avec lien de connexion */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-pink-400 hover:text-pink-300 font-medium underline transition-colors"
            >
              Sign in to your account
            </button>
          </p>
          <p className="text-gray-500 text-xs mt-2">
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}