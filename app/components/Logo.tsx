'use client'

import { motion } from 'framer-motion'

interface LogoProps {
  className?: string
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <motion.div 
      className={`flex items-center ${className} group`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative flex items-center"
        >
          <span className="text-3xl font-black bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 dark:from-emerald-300 dark:via-green-400 dark:to-teal-500 bg-clip-text text-transparent transform group-hover:scale-110 transition-all duration-300">
            BRS
          </span>
          {/* Primary glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 via-green-500/30 to-teal-600/30 dark:from-emerald-300/30 dark:via-green-400/30 dark:to-teal-500/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
          {/* Secondary glow effect */}
          <div className="absolute inset-0 bg-white/20 dark:bg-white/10 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100" />
        </motion.div>
      </div>
      <motion.div 
        className="ml-2 flex flex-col"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">CV.</span>
        <span className="font-bold text-lg bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
          Berkat Rahmat Sejahtera
        </span>
      </motion.div>
    </motion.div>
  )
}

