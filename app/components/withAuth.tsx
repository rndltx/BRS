'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function withAuth(WrappedComponent: React.ComponentType) {
  return function AuthComponent(props: any) {
    const router = useRouter()

    useEffect(() => {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        router.push('/admin/login')
      }
    }, [router])

    return <WrappedComponent {...props} />
  }
}

