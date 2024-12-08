'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Laptop } from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion'

// Types
type SettingsTheme = 'light' | 'dark' | undefined
type Theme = 'light' | 'dark' | 'system'

interface MotionButtonProps extends HTMLMotionProps<"button"> {
  onClick?: () => void;
  title?: string;
}

const MotionButton = motion.button as React.ComponentType<MotionButtonProps>

const themes = [
  { name: 'Light', value: 'light' as Theme, icon: Sun },
  { name: 'Dark', value: 'dark' as Theme, icon: Moon },
  { name: 'System', value: 'system' as Theme, icon: Laptop },
] as const

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { settings, updateSettings } = useSettings()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    const settingsTheme: SettingsTheme = newTheme === 'system' ? undefined : newTheme
    updateSettings({ theme: settingsTheme })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-5 left-5 z-50"
    >
      <AnimatePresence mode="sync">
        <div className="flex space-x-2">
          {themes.map((themeOption) => (
            <MotionButton
              key={themeOption.value}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              className={`p-2 rounded-full transition-colors duration-200 ${
                theme === themeOption.value
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleThemeChange(themeOption.value)}
              title={themeOption.name}
            >
              <themeOption.icon className="w-5 h-5" />
            </MotionButton>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  )
}
