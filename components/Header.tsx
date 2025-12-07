import { Heart, LogOut, Star, User, Menu, X } from "lucide-react";
import { useState } from "react";
import RegistrationPopup from "./RegistrationPopup";
import { useUser } from "@/app/context/userContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const {user, logout} = useUser()
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-gray-800 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-gray-700">
        {/* Logo section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-2xl sm:text-3xl">💋</div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-pink-300">Lovys</h1>
            <p className="text-xs text-gray-400 uppercase hidden sm:block">
              Worldwide escort services
            </p>
          </div>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <button className="flex items-center gap-1 px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition">
            <img
              src="https://flagcdn.com/w20/us.png"
              alt="US"
              className="w-5 h-3"
            />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition text-white">
            <Star className="w-4 h-4" />
            <span className="text-sm hidden lg:inline">Favorite</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition text-white">
            <Heart className="w-4 h-4" />
            <span className="text-sm hidden lg:inline">Review</span>
          </button>
          <button
            onClick={() => {user ? router.push('/manage/ads/form') : setIsOpen(true)}}
            className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-pink-300 text-gray-900 rounded hover:bg-pink-400 transition font-medium"
          >
            <User className="w-4 h-4" />
            <span className="text-sm">Advertise</span>
            <span className="hidden lg:inline"> for $5</span>
          </button>
          {user &&<button onClick={()=> logout()} className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition text-white">
            <LogOut className="w-5 h-5" />
          </button>}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1 px-3 py-2 bg-pink-300 text-gray-900 rounded hover:bg-pink-400 transition font-medium text-sm"
          >
            <User className="w-4 h-4" />
            <span>Advertise</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition text-white"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        <RegistrationPopup isOpen={isOpen} setIsOpen={setIsOpen} />
      </header>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-b border-gray-700 px-4 py-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
              <button className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition text-white w-full justify-center">
                <img
                  src="https://flagcdn.com/w20/us.png"
                  alt="US"
                  className="w-5 h-3"
                />
                <span>Change Language</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition text-white justify-center">
                <Star className="w-4 h-4" />
                <span>Favorite</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition text-white justify-center">
                <Heart className="w-4 h-4" />
                <span>Review</span>
              </button>
            </div>
            
            {user && <button className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition text-white justify-center mt-2">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>}
          </div>
        </div>
      )}
    </>
  );
}