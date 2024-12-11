'use client'

import { useState, useEffect, useCallback } from 'react'
import { withAuth } from '../../components/withAuth'
import { Button } from '../../components/ui/button'
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { useToast } from "../../components/ui/use-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Plus, Edit, Trash2 } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setProducts(data.filter((product: Product) => !product.deleted_at))
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      const url = editingProduct 
        ? `${API_BASE_URL}/products/${editingProduct.id}` 
        : `${API_BASE_URL}/products`
      
      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: formData,
        credentials: 'include'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save product')
      }

      toast({
        title: "Success",
        description: `Product ${editingProduct ? 'updated' : 'added'} successfully.`,
      })

      setEditingProduct(null)
      form.reset()
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to save product',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete product')
      }

      toast({
        title: "Success",
        description: "Product deleted successfully.",
      })

      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete product",
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
      <h1 className="text-2xl font-bold mb-6">Products Management</h1>
      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <Input
          type="text"
          name="name"
          placeholder="Product Name"
          defaultValue={editingProduct?.name || ''}
          required
        />
        <Textarea
          name="description"
          placeholder="Product Description"
          defaultValue={editingProduct?.description || ''}
          required
        />
        <Input
          type="file"
          name="image"
          accept="image/*"
          required={!editingProduct}
        />
        <Button type="submit" disabled={isLoading}>
          {editingProduct ? 'Update Product' : 'Add Product'}
        </Button>
        {editingProduct && (
          <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
            Cancel Edit
          </Button>
        )}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video w-full mb-4">
                {product.image_url && (
                  <img
                    src={product.image_url.startsWith('http') 
                      ? product.image_url 
                      : `${API_BASE_URL}${product.image_url}`}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full rounded-md object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {product.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setEditingProduct(product)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(product.id)}>
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

export default withAuth(ProductsAdmin)
