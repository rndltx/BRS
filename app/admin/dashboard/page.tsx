'use client'

import { useState, useEffect } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { ShoppingBag, Image, Video, Presentation } from 'lucide-react'
import { withAuth } from '../../components/withAuth'

interface DashboardStats {
  products: number;
  gallery: number;
  videos: number;
  slideshow: number;
}

const MotionDiv = motion.div as React.ComponentType<HTMLMotionProps<"div">>

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (!response.ok) throw new Error('Failed to fetch stats')
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError('Failed to fetch dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const statItems = [
    {
      name: 'Products',
      value: stats?.products || 0,
      icon: ShoppingBag,
      color: 'blue',
      description: 'Active products'
    },
    {
      name: 'Gallery',
      value: stats?.gallery || 0,
      icon: Image,
      color: 'emerald',
      description: 'Total images'
    },
    {
      name: 'Videos',
      value: stats?.videos || 0,
      icon: Video,
      color: 'purple',
      description: 'Active videos'
    },
    {
      name: 'Slideshow',
      value: stats?.slideshow || 0,
      icon: Presentation,
      color: 'amber',
      description: 'Active slides'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 md:p-8">
      <MotionDiv
        className="max-w-7xl mx-auto space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            CV. Berkat Rahmat Sejahtera
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`h-6 w-6 text-${item.color}-600 dark:text-${item.color}-400`} />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {item.value}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {item.description}
              </p>
              
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-white/20 dark:from-transparent dark:via-white/5 dark:to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </MotionDiv>
    </div>
  )
}

export default withAuth(AdminDashboard)

