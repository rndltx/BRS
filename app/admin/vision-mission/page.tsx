'use client'

import { useState, useEffect } from 'react'
import { withAuth } from '../../components/withAuth'
import { Save } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { useToast } from "../../components/ui/use-toast"

function VisionMissionAdmin() {
  const [visionMission, setVisionMission] = useState({ vision: '', mission: '' })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchVisionMission()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchVisionMission = async () => {
    try {
      const response = await fetch('/api/vision-mission')
      if (!response.ok) {
        throw new Error('Failed to fetch vision & mission')
      }
      const data = await response.json()
      setVisionMission(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching vision & mission:', error)
      toast({
        title: "Error",
        description: "Failed to fetch vision & mission. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setVisionMission(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/vision-mission', {
        method: 'PUT', // Change to PUT
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visionMission),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update vision & mission')
      }

      const updated = await response.json()
      setVisionMission(updated)
      
      toast({
        title: "Success",
        description: "Vision & Mission updated successfully.",
      })
    } catch (error) {
      console.error('Error updating vision & mission:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update vision & mission",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Vision & Mission Management</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="vision" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Vision
          </label>
          <Textarea
            id="vision"
            name="vision"
            value={visionMission.vision}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full"
            placeholder="Enter your company's vision"
          />
        </div>
        <div>
          <label htmlFor="mission" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Mission
          </label>
          <Textarea
            id="mission"
            name="mission"
            value={visionMission.mission}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full"
            placeholder="Enter your company's mission"
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </form>
    </div>
  )
}

export default withAuth(VisionMissionAdmin)

