'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface WithAuthProps {
  [key: string]: any
}

export const withAuth = (Component: React.ComponentType<WithAuthProps>) => {
  return function WithAuthComponent(props: WithAuthProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const checkAuth = () => {
        const token = localStorage.getItem('adminToken')
        if (!token) {
          router.push('/admin/login')
          return
        }
        
        try {
          // Optional: Decode JWT to check expiry
          const payload = JSON.parse(atob(token.split('.')[1]))
          if (payload.exp * 1000 < Date.now()) {
            localStorage.removeItem('adminToken')
            router.push('/admin/login')
            return
          }
        } catch (error) {
          console.error('Token validation error:', error)
          localStorage.removeItem('adminToken')
          router.push('/admin/login')
          return
        }

        setIsLoading(false)
      }

      checkAuth()
    }, [router])

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )
    }

    return <Component {...props} />
  }
}
