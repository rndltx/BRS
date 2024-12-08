'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Home, Briefcase, Image, Video, Settings, HelpCircle } from 'lucide-react'

interface AdminSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const menuItems = [
  { name: 'Dashboard', icon: Home, href: '/admin/dashboard' },
  { name: 'Vision & Mission', icon: Briefcase, href: '/admin/vision-mission' },
  { name: 'Products', icon: Briefcase, href: '/admin/products' },
  { name: 'Gallery', icon: Image, href: '/admin/gallery' },
  { name: 'Videos', icon: Video, href: '/admin/videos' },
  { name: 'Slideshow', icon: Image, href: '/admin/slideshow' },
  { name: 'Settings', icon: Settings, href: '/admin/settings' },
  { name: 'Help', icon: HelpCircle, href: '/admin/help' },
]

export default function AdminSidebar({ isOpen, toggleSidebar }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-white/90 via-gray-50/95 to-white/90 dark:from-gray-800/90 dark:via-gray-850/95 dark:to-gray-900/90 shadow-xl md:relative border-r border-gray-200/80 dark:border-gray-700/80 backdrop-blur-md"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200/80 dark:border-gray-700/80 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <Link 
                href="/admin/dashboard" 
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent hover:opacity-80 transition-all duration-300 transform hover:scale-105"
              >
                CV. BRS Admin
              </Link>
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-grow py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {menuItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center mx-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 transition-all duration-300
                    ${pathname === item.href 
                      ? 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-600 dark:from-blue-400/20 dark:to-blue-500/20 dark:text-blue-400 shadow-sm transform hover:scale-102' 
                      : 'hover:bg-gray-100/80 dark:hover:bg-gray-700/50 hover:transform hover:translate-x-1'
                    }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 transition-colors duration-200 
                    ${pathname === item.href 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    }`} 
                  />
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                    className="font-medium"
                  >
                    {item.name}
                  </motion.span>
                </Link>
              ))}
            </nav>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

