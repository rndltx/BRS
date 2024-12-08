// components/ui/button.tsx
import { cn } from "../../lib/utils"
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline'
}

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-all duration-200',
        {
          'bg-blue-500 hover:bg-blue-600 text-white': variant === 'default',
          'bg-red-500 hover:bg-red-600 text-white': variant === 'destructive',
          'border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}