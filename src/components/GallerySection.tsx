"use client"

import { useState, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { useScopedI18n } from '../../locales/client'

interface GallerySectionProps {
  images: string[]
  title?: string
  hasWatermark?: boolean
}

export default function GallerySection({ 
  images, 
  title,
  hasWatermark = true 
}: GallerySectionProps) {
  const t = useScopedI18n('GallerySection' as never) as (key: string, vars?: Record<string, any>) => string;
  const displayTitle = title || t('defaultTitle')
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const handlePrev = useCallback(() => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1)
    }
  }, [selectedImage])

  const handleNext = useCallback(() => {
    if (selectedImage !== null && selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1)
    }
  }, [selectedImage])

  if (!images || images.length === 0) return null

  return (
    <>
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
          <span>{displayTitle}</span>
          <span className="text-sm text-gray-400 font-normal">
            {images.length} {images.length > 1 ? t('photosCount') : t('photoCount')}
          </span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => setSelectedImage(index)}
            >
              <img 
                src={image} 
                alt={`${t('photoNumber')} ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              {/* Overlay avec zoom icon */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="w-8 h-8 text-white/80"/>
                </div>
              </div>
              
              {/* Filigrane */}
              {hasWatermark && (
                <div className="absolute bottom-2 right-2">
                  <div className="text-white/20 text-xs font-bold tracking-wider rotate-12">
                    {t('watermark')}
                  </div>
                </div>
              )}
              
              {/* Badge de numéro */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal d'agrandissement */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          {/* Bouton fermer */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition"
            title={t('navigation.close')}
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Bouton précédent */}
          {selectedImage > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition"
              title={t('navigation.previous')}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          
          {/* Bouton suivant */}
          {selectedImage < images.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition"
              title={t('navigation.next')}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
          
          {/* Image agrandie */}
          <div className="relative max-w-7xl max-h-[90vh] flex items-center justify-center">
            <img
              src={images[selectedImage]}
              alt={`${t('zoomPhoto')} ${selectedImage + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            
            {/* Filigrane sur l'image agrandie */}
            {hasWatermark && (
              <div className="absolute bottom-6 right-6">
                <div className="text-white/10 text-lg font-bold tracking-wider">
                  {t('watermark')}
                </div>
              </div>
            )}
            
            {/* Compteur */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
          
          {/* Navigation au clavier */}
          <div className="hidden">
            {selectedImage > 0 && (
              <button onClick={handlePrev} className="sr-only">
                {t('navigation.previous')}
              </button>
            )}
            {selectedImage < images.length - 1 && (
              <button onClick={handleNext} className="sr-only">
                {t('navigation.next')}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}