'use client'

import { motion, HTMLMotionProps } from 'framer-motion'

interface LogoProps extends HTMLMotionProps<"div"> {
  className?: string
}

const gradientColors = {
  light: {
    from: 'from-emerald-400',
    via: 'via-green-500',
    to: 'to-teal-600',
  },
  dark: {
    from: 'dark:from-emerald-300',
    via: 'dark:via-green-400',
    to: 'dark:to-teal-500',
  },
}

export default function Logo({ className = '', ...props }: LogoProps) {
  return (
    <motion.div 
      className={`flex items-center ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-label="BRS - Berkat Rahmat Sejahtera Logo"
      {...props}
    >
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative flex items-center"
        >
          <span className={`text-3xl font-black bg-gradient-to-br ${gradientColors.light.from} ${gradientColors.light.via} ${gradientColors.light.to} ${gradientColors.dark.from} ${gradientColors.dark.via} ${gradientColors.dark.to} bg-clip-text text-transparent`}>
            BRS
          </span>
          {/* Primary glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors.light.from}/30 ${gradientColors.light.via}/30 ${gradientColors.light.to}/30 ${gradientColors.dark.from}/30 ${gradientColors.dark.via}/30 ${gradientColors.dark.to}/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse`} />
          {/* Secondary glow effect */}
          <div className="absolute inset-0 bg-white/20 dark:bg-white/10 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100" />
        </motion.div>
      </motion.div>
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

