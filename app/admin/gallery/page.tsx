'use client'

import { useState, useEffect, useCallback } from 'react'
import { withAuth } from '../../components/withAuth'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { useToast } from "../../components/ui/use-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Plus, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'

// Update interface
interface GalleryImage {
  id: number;
  title: string;
  image_url: string;
}

// Update component with proper types
function GalleryAdmin() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const { toast } = useToast()

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch('/api/gallery')
      if (!response.ok) {
        throw new Error('Failed to fetch gallery images')
      }
      const data = await response.json()
      setImages(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching gallery images:', error)
      toast({
        title: "Error",
        description: "Failed to fetch gallery images. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      const url = editingImage ? `/api/gallery/${editingImage.id}` : '/api/gallery'
      const method = editingImage ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to save image')
      }

      toast({
        title: "Success",
        description: `Image ${editingImage ? 'updated' : 'added'} successfully.`,
      })

      setEditingImage(null)
      form.reset()
      fetchImages()
    } catch (error) {
      console.error('Error saving image:', error)
      toast({
        title: "Error",
        description: `Failed to ${editingImage ? 'update' : 'add'} image. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/gallery/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete image')
        }

        toast({
          title: "Success",
          description: "Image deleted successfully.",
        })

        fetchImages()
      } catch (error) {
        console.error('Error deleting image:', error)
        toast({
          title: "Error",
          description: "Failed to delete image. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gallery Management</h1>
      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <Input
          type="text"
          name="title"
          placeholder="Image Title"
          defaultValue={editingImage?.title || ''}
          required
        />
        <Input
          type="file"
          name="image"
          accept="image/*"
          required={!editingImage}
        />
        <Button type="submit" disabled={isLoading}>
          {editingImage ? 'Update Image' : 'Add Image'}
        </Button>
        {editingImage && (
          <Button type="button" variant="outline" onClick={() => setEditingImage(null)}>
            Cancel Edit
          </Button>
        )}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id}>
            <CardHeader>
              <CardTitle>{image.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-48 mb-4">
                {image.image_url && (
                  <Image
                    src={image.image_url}
                    alt={image.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-md object-cover"
                  />
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setEditingImage(image)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(image.id)}>
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

export default withAuth(GalleryAdmin)

