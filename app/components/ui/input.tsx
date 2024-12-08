// components/ui/input.tsx
import { cn } from "../../lib/utils"
import React from 'react'

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-all duration-200',
        className
      )}
      {...props}
    />
  )
}