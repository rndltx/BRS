'use client'

import { useState, useEffect, useCallback } from 'react'
import { withAuth } from '../../components/withAuth'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { useToast } from "../../components/ui/use-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import Image from 'next/image'

const API_BASE_URL = process.env.API_BASE_URL
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

interface Video {
  id: number
  title: string
  thumbnail_url: string
  video_url: string
  views: number
  active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

function VideosAdmin() {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const fetchVideos = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch videos')
      }
      const data = await response.json()
      setVideos(data.filter((video: Video) => !video.deleted_at))
    } catch (error) {
      console.error('Error fetching videos:', error)
      toast({
        title: "Error",
        description: "Failed to fetch videos. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const thumbnail = formData.get('thumbnail') as File
    const video = formData.get('video') as File

    if (thumbnail && thumbnail.size > MAX_FILE_SIZE) {
      toast({
        title: "Error",
        description: "Thumbnail must be smaller than 100MB",
        variant: "destructive",
      })
      return
    }

    if (video && video.size > MAX_FILE_SIZE) {
      toast({
        title: "Error",
        description: "Video must be smaller than 100MB",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const url = editingVideo 
        ? `${API_BASE_URL}/videos/${editingVideo.id}`
        : `${API_BASE_URL}/videos`

      const response = await fetch(url, {
        method: editingVideo ? 'PUT' : 'POST',
        body: formData,
        credentials: 'include'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save video')
      }

      toast({
        title: "Success",
        description: editingVideo ? "Video updated successfully." : "Video added successfully.",
      })

      form.reset()
      setEditingVideo(null)
      fetchVideos()
    } catch (error) {
      console.error('Error saving video:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save video",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete video')
      }

      toast({
        title: "Success",
        description: "Video deleted successfully.",
      })
      fetchVideos()
    } catch (error) {
      console.error('Error deleting video:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete video",
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
      <h1 className="text-2xl font-bold mb-6">Video Management</h1>
      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <Input
          type="text"
          name="title"
          placeholder="Video Title"
          defaultValue={editingVideo?.title || ''}
          required
          disabled={isSubmitting}
        />
        <div className="space-y-2">
          <Input
            type="file"
            name="thumbnail"
            accept="image/*"
            required={!editingVideo}
            disabled={isSubmitting}
          />
          <p className="text-sm text-gray-500">Max size: 100MB</p>
        </div>
        <div className="space-y-2">
          <Input
            type="file"
            name="video"
            accept="video/*"
            required={!editingVideo}
            disabled={isSubmitting}
          />
          <p className="text-sm text-gray-500">Max size: 100MB</p>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {editingVideo ? 'Updating...' : 'Saving...'}
            </>
          ) : (
            editingVideo ? 'Update Video' : 'Add Video'
          )}
        </Button>
        {editingVideo && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setEditingVideo(null)}
            disabled={isSubmitting}
          >
            Cancel Edit
          </Button>
        )}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id}>
            <CardHeader>
              <CardTitle>{video.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video w-full mb-4">
                {video.thumbnail_url && (
                  <Image
                    src={video.thumbnail_url.startsWith('http') 
                      ? video.thumbnail_url 
                      : `${API_BASE_URL}${video.thumbnail_url}`}
                    alt={video.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-md object-cover"
                  />
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{video.views} views</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setEditingVideo(video)}
                disabled={isSubmitting}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDelete(video.id)}
                disabled={isSubmitting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default withAuth(VideosAdmin)
