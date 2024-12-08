'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Laptop } from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'
import { motion, AnimatePresence } from 'framer-motion'

const themes = [
  { name: 'Light', value: 'light', icon: Sun },
  { name: 'Dark', value: 'dark', icon: Moon },
  { name: 'System', value: 'system', icon: Laptop },
]

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { settings, updateSettings } = useSettings()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    updateSettings({ theme: newTheme as 'light' | 'dark' })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-5 left-5 z-50"
    >
      <AnimatePresence mode="sync">
        <div className="flex space-x-2">
          {themes.map((theme) => (
            <motion.button
              key={theme.value}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              className={`p-2 rounded-full transition-colors duration-200 ${
                theme === theme.value
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleThemeChange(theme.value)}
              title={theme.name}
            >
              <theme.icon className="w-5 h-5" />
            </motion.button>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  )
}
