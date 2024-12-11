'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SlideshowImage {
  id: number;
  image_url: string;
  created_at: string;
}

export default function ImageSlideshow() {
  const [images, setImages] = useState<SlideshowImage[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/slideshow')
        if (!response.ok) {
          throw new Error('Failed to fetch images')
        }
        const data = await response.json()
        setImages(data)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to fetch images')
        setIsLoading(false)
      }
    }

    fetchImages()
  }, [])

  useEffect(() => {
    if (images.length === 0) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images])

  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="absolute inset-0 bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="absolute inset-0 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No images available</p>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 z-0">
      <AnimatePresence mode="sync">
        {images.map((image, index) => (
          index === currentImageIndex && (
            <motion.div
              key={image.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img
                src={`https://rizsign.my.id${image.image_url}`}
                alt={`Slideshow image ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </motion.div>
          )
        ))}
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-white w-4' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

