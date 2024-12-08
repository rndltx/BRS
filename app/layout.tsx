'use client'

import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeSwitcher from './components/ThemeSwitcher'
import { SettingsProvider } from './contexts/SettingsContext'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import './globals.css'

config.autoAddCss = false

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <SettingsProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
              <div className="relative z-0">
                <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:bg-[url('/grid-dark.svg')] pointer-events-none"></div>
                <div className="relative">
                  {children}
                </div>
              </div>
            </div>
          </ThemeProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}

