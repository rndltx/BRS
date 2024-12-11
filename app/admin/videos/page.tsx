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

  // Client-side upload function
  async function uploadLargeVideo(file: File, title: string, thumbnail: File) {
    const chunkSize = 5 * 1024 * 1024; // 5MB chunks
    const fileId = Math.random().toString(36).substring(7);
    const totalChunks = Math.ceil(file.size / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
      const formData = new FormData();
      
      formData.append('chunk', chunk);
      formData.append('chunkIndex', i.toString());
      formData.append('totalChunks', totalChunks.toString());
      formData.append('fileId', fileId);

      // Add title and thumbnail on last chunk
      if (i === totalChunks - 1) {
        formData.append('title', title);
        formData.append('thumbnail', thumbnail);
      }

      const response = await fetch('/api/videos', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      // Update progress UI
      updateProgress(data.progress);
    }
  }

  // Update handleSubmit in page.tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // If editing, add ID to formData and use PUT method
    if (editingVideo) {
      formData.append('id', editingVideo.id.toString());
    }

    try {
      const response = await fetch('/api/videos', {
        method: editingVideo ? 'PUT' : 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(editingVideo ? 'Failed to update video' : 'Failed to save video');
      }

      toast({
        title: "Success",
        description: editingVideo ? "Video updated successfully." : "Video added successfully.",
      });

      form.reset();
      setEditingVideo(null);
      fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save video",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

