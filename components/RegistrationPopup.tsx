// import { Eye, EyeOff, X } from 'lucide-react';
// import Image from 'next/image';
// import { useState, useEffect, useRef } from 'react';
// import SignInForm from './SignInForm';
// import EscortRegistrationForm from './EscortRegistrationForm';
// import UserRegistrationForm from './UserRegistrationForm';

// export type FormType = 'registration' | 'user' | 'escort' | 'login';

// export default function RegistrationPopup({
//   isOpen,
//   setIsOpen
// }: {
//   isOpen: boolean;
//   setIsOpen: (open: boolean) => void;
// }) {
//   const [currentForm, setCurrentForm] = useState<FormType>('registration');
//   const [isClosing, setIsClosing] = useState(false);
//   const popupRef = useRef<HTMLDivElement>(null);
//   const contentRef = useRef<HTMLDivElement>(null);

//   // Gérer la fermeture avec animation
//   const handleClose = () => {
//     setIsClosing(true);
//     setTimeout(() => {
//       setIsOpen(false);
//       setIsClosing(false);
//       setCurrentForm('registration');
//     }, 300);
//   };

//   // Fermer en cliquant en dehors
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         popupRef.current &&
//         !popupRef.current.contains(event.target as Node) &&
//         isOpen &&
//         !isClosing
//       ) {
//         handleClose();
//       }
//     };

//     const handleEscapeKey = (event: KeyboardEvent) => {
//       if (event.key === 'Escape' && isOpen && !isClosing) {
//         handleClose();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     document.addEventListener('keydown', handleEscapeKey);

//     // Désactiver le scroll du body mais permettre le scroll dans la popup
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//       // Scroll au top quand on change de formulaire
//       if (contentRef.current) {
//         contentRef.current.scrollTop = 0;
//       }
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.removeEventListener('keydown', handleEscapeKey);
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen, isClosing, currentForm]);

//   // Navigation entre les formulaires
//   const navigateToForm = (form: FormType) => {
//     setCurrentForm(form);
//   };

//   // Navigation en arrière
//   const goBack = () => {
//     if (currentForm === 'user' || currentForm === 'escort' || currentForm === 'login') {
//       setCurrentForm('registration');
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div
//       className={`fixed inset-0 bg-gray-900 flex items-start md:items-center justify-center z-50 transition-all duration-300 ${
//         isClosing ? 'bg-opacity-0' : 'bg-opacity-80'
//       }`}
//     >
//       <div
//         ref={popupRef}
//         className={`relative bg-gray-800 rounded-none md:rounded-xl max-w-3xl w-full h-full md:h-auto md:max-h-[90vh] overflow-hidden transition-all duration-300 transform ${
//           isClosing
//             ? 'opacity-0 scale-95 translate-y-4'
//             : 'opacity-100 scale-100 translate-y-0'
//         }`}
//       >
//         {/* Background Pattern */}
//         <div className="absolute inset-0 opacity-5 pointer-events-none">
//           <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
//             <pattern
//               id="pattern"
//               x="0"
//               y="0"
//               width="100"
//               height="100"
//               patternUnits="userSpaceOnUse"
//             >
//               <circle
//                 cx="50"
//                 cy="50"
//                 r="30"
//                 fill="none"
//                 stroke="white"
//                 strokeWidth="1"
//               />
//               <path
//                 d="M20,50 Q35,30 50,50 T80,50"
//                 fill="none"
//                 stroke="white"
//                 strokeWidth="1"
//               />
//             </pattern>
//             <rect width="100%" height="100%" fill="url(#pattern)" />
//           </svg>
//         </div>

//         {/* Header fixe */}
//         <div className=" px-4 md:px-6 py-3 border-b border-gray-700 flex items-center justify-between bg-gray-800 sticky top-0 z-10">
//           <div className="flex items-center gap-3">
//             {(currentForm === 'user' ||
//               currentForm === 'escort' ||
//               currentForm === 'login') && (
//               <button
//                 onClick={goBack}
//                 className="text-gray-400 hover:text-white transition p-1"
//                 aria-label="Go back"
//               >
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 19l-7-7 7-7"
//                   />
//                 </svg>
//               </button>
//             )}
//             <h2 className="text-lg md:text-xl font-bold text-white">
//               {currentForm === 'registration' && 'Choose Account Type'}
//               {currentForm === 'user' && 'User Registration'}
//               {currentForm === 'escort' && 'Escort Registration'}
//               {currentForm === 'login' && 'Sign In'}
//             </h2>
//           </div>

//           <button
//             onClick={handleClose}
//             className="text-gray-400 hover:text-white transition p-1"
//             aria-label="Close"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Contenu scrollable */}
//         <div 
//           ref={contentRef}
//           className="relative overflow-y-auto h-[calc(100%-60px)] md:h-auto md:max-h-[calc(90vh-60px)]"
//         >
//           {/* Registration Selection */}
//           <div
//             className={`transition-all duration-300 min-h-full ${
//               currentForm === 'registration'
//                 ? 'opacity-100 translate-x-0'
//                 : 'opacity-0 -translate-x-full absolute inset-0'
//             }`}
//           >
//             <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-700">
//               {/* User Section */}
//               <div className="p-6 md:p-8 lg:p-12 flex flex-col items-center">
//                 <div className="w-24 h-36 sm:w-32 sm:h-48 md:w-40 md:h-64 mb-4 md:mb-6 relative">
//                   <Image
//                     src="/images/man.webp"
//                     alt="User Silhouette"
//                     fill
//                     className="object-contain"
//                     sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
//                     priority
//                   />
//                 </div>

//                 <h2 className="text-xl md:text-2xl font-bold text-white mb-1 text-center">
//                   User
//                 </h2>
//                 <p className="text-gray-400 text-xs md:text-sm mb-4 text-center px-2">
//                   Get free private online chat!
//                 </p>

//                 <button
//                   onClick={() => navigateToForm('user')}
//                   className="w-full max-w-xs py-3 bg-pink-300 text-gray-900 rounded-full hover:bg-pink-400 transition font-semibold shadow-lg hover:shadow-pink-300/20 text-sm md:text-base"
//                 >
//                   Register as User
//                 </button>

//               </div>

//               {/* Escort Section */}
//               <div className="p-6 md:p-8 lg:p-12 flex flex-col items-center">
//                 <div className="w-24 h-36 sm:w-32 sm:h-48 md:w-40 md:h-64 mb-4 md:mb-6 relative">
//                   <Image
//                     src="/images/girl.webp"
//                     alt="Escort Silhouette"
//                     fill
//                     className="object-contain"
//                     sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
//                     priority
//                   />
//                 </div>

//                 <h2 className="text-xl md:text-2xl font-bold text-white mb-1 text-center">
//                   Escort
//                 </h2>
//                 <p className="text-gray-400 text-xs md:text-sm mb-4 text-center px-2">
//                   Get listed in just 3 minutes
//                 </p>

//                 <button
//                   onClick={() => navigateToForm('escort')}
//                   className="w-full max-w-xs py-3 bg-pink-300 text-gray-900 rounded-full hover:bg-pink-400 transition font-semibold shadow-lg hover:shadow-pink-300/20 text-sm md:text-base"
//                 >
//                   Register as Escort
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* User Registration Form */}
//           <div
//             className={`transition-all duration-300 min-h-full ${
//               currentForm === 'user'
//                 ? 'opacity-100 translate-x-0'
//                 : 'opacity-0 translate-x-full absolute inset-0'
//             }`}
//           >
//             <UserRegistrationForm
//               isOpen={isOpen}
//               setIsOpen={setIsOpen}
//               onBack={() => navigateToForm('registration')}
//               onSwitchToLogin={() => navigateToForm('login')}
//             />
//           </div>

//           {/* Escort Registration Form */}
//           <div
//             className={`transition-all duration-300 min-h-full ${
//               currentForm === 'escort'
//                 ? 'opacity-100 translate-x-0'
//                 : 'opacity-0 translate-x-full absolute inset-0'
//             }`}
//           >
//             <EscortRegistrationForm
//               isOpen={isOpen}
//               setIsOpen={setIsOpen}
//               onBack={() => navigateToForm('registration')}
//               onSwitchToLogin={() => navigateToForm('login')}
//             />
//           </div>

//           {/* Login Form */}
//           <div
//             className={`transition-all duration-300 min-h-full ${
//               currentForm === 'login'
//                 ? 'opacity-100 translate-x-0'
//                 : 'opacity-0 translate-x-full absolute inset-0'
//             }`}
//           >
//             <SignInForm
//               isOpen={isOpen}
//               setIsOpen={setIsOpen}
//               onBack={() => navigateToForm('registration')}
//               onSwitchToUser={() => navigateToForm('user')}
//               onSwitchToEscort={() => navigateToForm('escort')}
//             />
//           </div>
//         </div>

//         {/* Footer conditionnel - Sticky en bas sur mobile */}
//         {(currentForm === 'registration' || currentForm === 'login') && (
//           <div className="bg-gray-900 py-4 px-4 md:px-6 text-center sticky bottom-0 border-t border-gray-700">
//             {currentForm === 'registration' && (
//               <p className="text-xs md:text-sm text-gray-400">
//                 Already have an account?{' '}
//                 <button
//                   onClick={() => navigateToForm('login')}
//                   className="text-pink-300 hover:text-pink-400 underline font-medium"
//                 >
//                   Sign in here!
//                 </button>
//               </p>
//             )}
            
//             {currentForm === 'login' && (
//               <p className="text-xs md:text-sm text-gray-400">
//                 Forgot your password?{' '}
//                 <a
//                   href="#"
//                   className="text-pink-300 hover:text-pink-400 underline font-medium"
//                 >
//                   Click here to recover!
//                 </a>
//               </p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }