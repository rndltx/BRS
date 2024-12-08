// Simplified version for this example
import { useState } from 'react'

export function useToast() {
  const [, setToasts] = useState([])

  const toast = ({ title, description, variant = "default" }) => {
    setToasts((prevToasts) => [
      ...prevToasts,
      { title, description, variant },
    ])
    // In a real implementation, you'd manage the toasts state and render them
    console.log(`Toast: ${title} - ${description} (${variant})`)
  }

  return { toast }
}

