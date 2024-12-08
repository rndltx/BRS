'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, Compass } from 'lucide-react'

export default function VisionMission() {
  const [visionMission, setVisionMission] = useState({ vision: '', mission: '' })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchVisionMission()
  }, [])

  const fetchVisionMission = async () => {
    try {
      const response = await fetch('/api/vision-mission')
      if (!response.ok) {
        throw new Error('Failed to fetch vision & mission')
      }
      const data = await response.json()
      setVisionMission(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching vision & mission:', error)
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

  // Split mission text into array of points
  const missionPoints = visionMission.mission.split('\n').filter(point => point.trim())

  return (
    <section id="vision-mission" className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent"
        >
          Vision & Mission
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center mb-6 p-3 bg-blue-500/10 dark:bg-blue-400/10 rounded-lg w-fit">
              <Target className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                Our Vision
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {visionMission.vision}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center mb-6 p-3 bg-green-500/10 dark:bg-green-400/10 rounded-lg w-fit">
              <Compass className="w-6 h-6 mr-2 text-green-600 dark:text-green-400" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                Our Mission
              </h3>
            </div>
            <ul className="space-y-4">
              {missionPoints.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                  className="flex items-start"
                >
                  <span className="flex-shrink-0 w-2 h-2 mt-2 mr-3 bg-green-500 dark:bg-green-400 rounded-full" />
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {point.trim()}
                  </p>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

