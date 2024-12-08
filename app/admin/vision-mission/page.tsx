'use client'

import { useState, useEffect, useCallback } from 'react'
import { withAuth } from '../../components/withAuth'
import { Save } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { useToast } from "../../components/ui/use-toast"

function VisionMissionAdmin() {
  const [visionMission, setVisionMission] = useState({ vision: '', mission: '' })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchVisionMission = useCallback(async () => {
    try {
      const response = await fetch('/api/vision-mission')
      if (!response.ok) {
        throw new Error('Failed to fetch vision & mission')
      }
      const data = await response.json()
      setVisionMission({
        vision: data.vision || '',
        mission: data.mission || ''
      })
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
  }, [toast])

  useEffect(() => {
    fetchVisionMission()
  }, [fetchVisionMission])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setVisionMission(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!visionMission.vision || !visionMission.mission) {
      toast({
        title: "Error",
        description: "Vision and mission are required.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/vision-mission', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vision: visionMission.vision.trim(),
          mission: visionMission.mission.trim()
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update vision & mission')
      }

      toast({
        title: "Success",
        description: "Vision & Mission updated successfully.",
      })
      
      fetchVisionMission() // Refresh data
    } catch (error) {
      console.error('Error updating vision & mission:', error)
      toast({
        title: "Error",
        description: "Failed to update vision & mission. Please try again.",
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
            required
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
            required
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

