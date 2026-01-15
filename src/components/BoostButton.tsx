// components/BoostButton.tsx
'use client'

import { useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { toast } from 'sonner'

export default function BoostButton({ adId, city }: { adId: string; city: string }) {
  const [loading, setLoading] = useState(false)
  
  const handleBoost = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/ads/boost/${adId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city })
      })
      
      const data = await res.json()
      
      if (data.success) {
        toast.success(`Remontée à ${city} !`)
        // Rafraîchir la page
        window.location.reload()
      } else {
        toast.error(data.error || 'Erreur')
      }
    } catch (error) {
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <button
      onClick={handleBoost}
      disabled={loading}
      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded flex items-center gap-2 disabled:opacity-50"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Remontage...
        </>
      ) : (
        <>
          <ArrowUp className="w-4 h-4" />
          Remonter
        </>
      )}
    </button>
  )
}