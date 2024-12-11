'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const withAuth = (Component: React.ComponentType<any>) => {
  return function WithAuthComponent(props: any) {
    const router = useRouter()

    useEffect(() => {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        router.push('/admin/login')
      }
    }, [router])

    return <Component {...props} />
  }
}

