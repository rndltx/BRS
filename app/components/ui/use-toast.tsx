import { useState } from 'react'

interface Toast {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ 
    title, 
    description, 
    variant = "default" 
  }: Toast) => {
    setToasts((prevToasts) => [
      ...prevToasts,
      { title, description, variant },
    ])
    // In a real implementation, you'd manage the toasts state and render them
    console.log(`Toast: ${title} - ${description} (${variant})`)
  }

  return { toast }
}
