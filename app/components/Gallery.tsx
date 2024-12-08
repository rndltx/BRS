'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion'

// Create typed motion components
interface MotionDivProps extends HTMLMotionProps<"div"> {
  onClick?: () => void;
}

const MotionDiv = motion.div as React.ComponentType<MotionDivProps>

interface GalleryImage {
  id: number;
  title: string;
  image_url: string;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery')
      if (!response.ok) {
        throw new Error('Failed to fetch gallery images')
      }
      const data = await response.json()
      setImages(data)
    } catch (error) {
      console.error('Error fetching gallery images:', error)
      setError('Failed to load gallery images')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
        >
          Our Gallery
        </MotionDiv>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <MotionDiv
              key={image.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative h-64 rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => setSelectedImage(image)}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 z-10" />
              {image.image_url && (
                <Image
                  src={image.image_url}
                  alt={image.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <h3 className="text-white text-lg font-semibold">{image.title}</h3>
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {selectedImage && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-4xl h-full max-h-[80vh] rounded-xl overflow-hidden"
            >
              {selectedImage.image_url && (
                <Image
                  src={selectedImage.image_url}
                  alt={selectedImage.title}
                  fill
                  className="object-contain backdrop-blur-sm"
                  sizes="(max-width: 1536px) 100vw, 1536px"
                />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
                className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all duration-200"
              >
                ×
              </button>
            </motion.div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </section>
  )
}

