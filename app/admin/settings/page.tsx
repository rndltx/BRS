'use client'

import { useState, useEffect, useCallback } from 'react'
import { withAuth } from '../../components/withAuth'
import { Save } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { useToast } from "../../components/ui/use-toast"

interface Settings {
  siteName: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  theme: 'light' | 'dark' | 'system';
}

function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    siteName: '',
    contactEmail: '',
    phoneNumber: '',
    address: '',
    theme: 'light',
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/settings')
      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast({
        title: "Error",
        description: "Failed to fetch settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error('Failed to update settings')
      }

      const updatedSettings = await response.json()
      setSettings(updatedSettings)

      toast({
        title: "Success",
        description: "Settings updated successfully.",
      })
    } catch (error) {
      console.error('Error updating settings:', error)
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Site Name
          </label>
          <Input
            type="text"
            name="siteName"
            id="siteName"
            value={settings.siteName}
            onChange={handleChange}
            className="mt-1 block w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Contact Email
          </label>
          <Input
            type="email"
            name="contactEmail"
            id="contactEmail"
            value={settings.contactEmail}
            onChange={handleChange}
            className="mt-1 block w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Phone Number
          </label>
          <Input
            type="tel"
            name="phoneNumber"
            id="phoneNumber"
            value={settings.phoneNumber}
            onChange={handleChange}
            className="mt-1 block w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Address
          </label>
          <Input
            type="text"
            name="address"
            id="address"
            value={settings.address}
            onChange={handleChange}
            className="mt-1 block w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Theme
          </label>
          <select
            name="theme"
            id="theme"
            value={settings.theme}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  )
}

export default withAuth(AdminSettings)
