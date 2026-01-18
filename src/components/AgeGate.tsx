'use client'

import { useEffect, useState } from 'react'

export default function AgeGate() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('ageConfirmed')
    if (!accepted) {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('ageConfirmed', 'true')
    setVisible(false)
  }

  const reject = () => {
    window.location.href = 'https://www.google.com'
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="max-w-md rounded-lg bg-white p-6 text-center shadow-xl">
        <h2 className="mb-4 text-xl font-bold">Avez-vous 18 ans ?</h2>
        <p className="mb-6 text-gray-600">
          Ce site est réservé aux personnes majeures.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={accept}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Oui, j’ai 18 ans
          </button>

          <button
            onClick={reject}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Non
          </button>
        </div>
      </div>
    </div>
  )
}
