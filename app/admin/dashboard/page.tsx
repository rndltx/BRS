'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Image, Video, BarChart2, TrendingUp, AlertCircle } from 'lucide-react'
import { withAuth } from '../../components/withAuth'

interface DashboardStats {
  products: number;
  gallery: number;
  videos: number;
}

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, galleryRes, videosRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/gallery'),
          fetch('/api/videos')
        ]);

        const products = await productsRes.json();
        const gallery = await galleryRes.json();
        const videos = await videosRes.json();

        setStats({
          products: products.length,
          gallery: gallery.length,
          videos: videos.length
        });
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Error: {error}</span>
          </div>
        </div>
      </div>
    )
  }

  const statItems = [
    { name: 'Total Products', value: stats?.products || 0, icon: ShoppingBag, change: '+2', trend: 'up' },
    { name: 'Gallery Images', value: stats?.gallery || 0, icon: Image, change: '+5', trend: 'up' },
    { name: 'Video Uploads', value: stats?.videos || 0, icon: Video, change: '0', trend: 'neutral' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 md:p-8 lg:p-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent"
      >
        CV. Berkat Rahmat Sejahtera Admin Dashboard
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-gray-600 dark:text-gray-300 mb-10"
      >
        Welcome to the admin dashboard. Here&apos;s an overview of your website&apos;s content.
      </motion.p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {statItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 dark:bg-blue-400/10 rounded-xl">
                <item.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-4xl font-bold bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                {item.value}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {item.name}
            </h3>
            <div className={`flex items-center ${
              item.trend === 'up' ? 'text-green-500' : 
              item.trend === 'down' ? 'text-red-500' : 'text-gray-500'
            }`}>
              {item.trend === 'up' && <TrendingUp className="h-4 w-4 mr-1" />}
              {item.trend === 'down' && <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />}
              {item.trend === 'neutral' && <BarChart2 className="h-4 w-4 mr-1" />}
              <span className="font-medium">{item.change} this week</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default withAuth(AdminDashboard)

