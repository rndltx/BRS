'use client'

import { useState, useEffect, useCallback } from 'react'
import { withAuth } from '../../components/withAuth'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { useToast } from "../../components/ui/use-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Plus, Edit, Trash2 } from 'lucide-react'

const DOMAIN = 'https://rizsign.my.id'

// Update page.tsx interface
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
  const { toast } = useToast()

  // Update progress tracking
  const [uploadProgress, setUploadProgress] = useState(0)

  const fetchVideos = useCallback(async () => {
    try {
      const response = await fetch('/api/videos')
      if (!response.ok) {
        throw new Error('Failed to fetch videos')
      }
      const data = await response.json()
      setVideos(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching videos:', error)
      toast({
        title: "Error",
        description: "Failed to fetch videos. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  // Updated uploadVideo function - simpler direct upload
  async function uploadVideo(file: File, title: string, thumbnail: File) {
    // Validate file sizes
    const MAX_VIDEO_SIZE = 25 * 1024 * 1024 // 25MB
    const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024 // 2MB

    if (file.size > MAX_VIDEO_SIZE) {
      throw new Error(`Video must be smaller than ${MAX_VIDEO_SIZE / (1024 * 1024)}MB`)
    }

    if (thumbnail.size > MAX_THUMBNAIL_SIZE) {
      throw new Error(`Thumbnail must be smaller than ${MAX_THUMBNAIL_SIZE / (1024 * 1024)}MB`)
    }

    // Validate file types
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg']
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedVideoTypes.includes(file.type)) {
      throw new Error('Invalid video type. Only MP4, WebM and OGG videos are allowed.')
    }
    if (!allowedImageTypes.includes(thumbnail.type)) {
      throw new Error('Invalid thumbnail type. Only JPEG, PNG and WebP images are allowed.')
    }

    // Create FormData
    const formData = new FormData()
    formData.append('title', title)
    formData.append('video', file)
    formData.append('thumbnail', thumbnail)

    const response = await fetch('/api/videos', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || `Upload failed with status ${response.status}`)
    }

    return response.json()
  }

  // Updated handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setUploadProgress(0)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const title = formData.get('title') as string
    const video = formData.get('video') as File
    const thumbnail = formData.get('thumbnail') as File

    try {
      if (editingVideo) {
        // Handle edit case
        const response = await fetch(`/api/videos?id=${editingVideo.id}`, {
          method: 'PUT',
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to update video')
        }
      } else {
        // Show initial progress
        setUploadProgress(10)
        
        // Upload video
        const result = await uploadVideo(video, title, thumbnail)
        
        // Show completion
        setUploadProgress(100)
        console.log('Upload completed, video ID:', result.videoId)
      }

      toast({
        title: "Success",
        description: editingVideo ? "Video updated successfully." : "Video added successfully.",
      })

      form.reset()
      setEditingVideo(null)
      setUploadProgress(0)
      fetchVideos()
    } catch (error) {
      console.error('Error saving video:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save video",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
    }
  }

  // Update handleDelete in page.tsx
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/videos?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete video')
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
      
      {/* Add file size warning */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          Note: Maximum file sizes - Video: 25MB, Thumbnail: 2MB
          <br />
          Supported formats - Video: MP4, WebM, OGG | Thumbnail: JPEG, PNG, WebP
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <Input
          type="text"
          name="title"
          placeholder="Video Title"
          defaultValue={editingVideo?.title || ''}
          required
        />
        <Input
          type="file"
          name="thumbnail"
          accept="image/*"
          required={!editingVideo}
        />
        <Input
          type="file"
          name="video"
          accept="video/*"
          required={!editingVideo}
        />

        {/* Add progress bar */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        <Button type="submit" disabled={isLoading}>
          {editingVideo ? 'Update Video' : 'Add Video'}
        </Button>
        {editingVideo && (
          <Button type="button" variant="outline" onClick={() => setEditingVideo(null)}>
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
                  <img
                    src={`${DOMAIN}${video.thumbnail_url}`}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full rounded-md object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{video.views} views</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setEditingVideo(video)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(video.id)}>
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

