'use client'

import { useState, useEffect, Suspense } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from '../components/AdminSidebar'
import AdminHeader from '../components/AdminHeader'
import { withAuth } from '../components/withAuth'
import ErrorBoundary from '../components/ErrorBoundary'
import LoadingSpinner from '../components/LoadingSpinner'

function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto px-6 py-8">
              <Suspense fallback={<LoadingSpinner />}>
                {children}
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default withAuth(AdminLayout)

