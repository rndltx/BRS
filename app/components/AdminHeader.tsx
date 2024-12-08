'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, ChevronDown, User, Bell, ChevronRight, Search, LogOut } from 'lucide-react'

interface AdminHeaderProps {
  toggleSidebar: () => void;
}

export default function AdminHeader({ toggleSidebar }: AdminHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/')
  }

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(path => path)
    return paths.map((path, index) => {
      const href = '/admin/dashboard' + paths.slice(0, index + 0).join('/')
      return { name: path.charAt(0).toUpperCase() + path.slice(1), href }
    })
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <header className="bg-gradient-to-r from-white/80 via-gray-50/90 to-white/80 dark:from-gray-900/80 dark:via-gray-800/90 dark:to-gray-900/80 shadow-lg backdrop-blur-md border-b border-gray-200/80 dark:border-gray-700/80 sticky top-0 z-40">
      <div className="mx-auto">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center pl-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700/50 transition-all duration-300"
            >
              <Menu className="h-5 w-5 transition-transform duration-200 hover:scale-110" aria-hidden="true" />
            </button>
            <nav className="hidden md:flex ml-4">
              <ol className="flex items-center space-x-2 text-sm font-medium">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <ChevronRight size={12} className="mx-2 text-gray-400 dark:text-gray-500" />}
                    {index === breadcrumbs.length - 1 ? (
                      <span className="font-semibold text-gray-900 dark:text-white">{crumb.name}</span>
                    ) : (
                      <Link href={crumb.href} className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors duration-200">
                        {crumb.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="flex items-center space-x-3 pr-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700/50 transition-all duration-200"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="hidden md:flex items-center space-x-2">
              <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700/50 transition-all duration-200">
                <Bell className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center p-1 rounded-full hover:ring-2 hover:ring-gray-200 dark:hover:ring-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  <span className="sr-only">Open user menu</span>
                  <User className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 text-white p-1.5 transition-all duration-300 hover:shadow-lg hover:scale-105" aria-hidden="true" />
                </button>
                <AnimatePresence>
                {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="origin-top-right absolute right-0 mt-3 w-48 rounded-xl shadow-xl py-1.5 bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 focus:outline-none overflow-hidden"
                    >
                      <Link href="/admin/profile" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-200 dark:hover:bg-gray-700/50 dark:hover:text-indigo-400 transition-colors duration-200">
                        Your Profile
                      </Link>
                      <Link href="/admin/settings" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-200 dark:hover:bg-gray-700/50 dark:hover:text-indigo-400 transition-colors duration-200">
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-200 dark:hover:bg-gray-700/50 dark:hover:text-indigo-400 transition-colors duration-200"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md"
          >
            <div className="mx-auto flex items-center p-3">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search..."
                className="ml-3 block w-full bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

