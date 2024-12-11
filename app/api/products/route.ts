import { NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import pool from '../../lib/db'
import { existsSync } from 'fs'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import { FtpClient } from '../../lib/ftp'

interface Product extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  image_url: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'products')

// Helper to validate image URLs and file types
const isValidImageType = (type: string) => {
  return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(type)
}

const getFileExtension = (filename: string) => {
  const ext = path.extname(filename).toLowerCase()
  return ext || '.jpg' // Default to .jpg if no extension
}

const ftpClient = new FtpClient({
  host: process.env.FTP_HOST!,
  user: process.env.FTP_USER!,
  password: process.env.FTP_PASSWORD!,
  secure: process.env.FTP_SECURE === 'true'
})

export async function GET() {
  try {
    const [rows] = await pool.query<Product[]>(
      'SELECT * FROM products WHERE deleted_at IS NULL ORDER BY id DESC'
    )
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' }, 
      { status: 500 }
    )
  }
}

// Update POST handler's file upload section
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const image = formData.get('image') as File
    
    if (!name || !description || !image) {
      return NextResponse.json(
        { error: 'Name, description and image are required' },
        { status: 400 }
      )
    }

    if (!isValidImageType(image.type)) {
      return NextResponse.json(
        { error: 'Invalid image type. Supported formats: JPG, PNG, GIF, WebP' },
        { status: 400 }
      )
    }

    const ext = getFileExtension(image.name)
    const filename = `${Date.now()}-${image.name.replace(/\.[^/.]+$/, '')}${ext}`
    const relativePath = `/uploads/products/${filename}`
    const fullRemotePath = `/public_html${relativePath}`

    // Upload to FTP
    try {
      const buffer = Buffer.from(await image.arrayBuffer())
      await ftpClient.uploadFromBuffer(buffer, fullRemotePath)
    } catch (ftpError) {
      console.error('FTP upload error:', ftpError)
      throw ftpError
    }

    // Save to database
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO products (
        name, description, image_url, active, created_at, updated_at
      ) VALUES (?, ?, ?, 1, NOW(), NOW())`,
      [name, description, relativePath]
    )

    const [newProduct] = await pool.query<Product[]>(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    )

    return NextResponse.json(newProduct[0], { status: 201 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Failed to save product' },
      { status: 500 }
    )
  }
}

// Update PUT handler's file upload section
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const image = formData.get('image') as File | null

    // Check if product exists with proper typing
    const [existing] = await pool.query<Product[]>(
      'SELECT * FROM products WHERE id = ? AND deleted_at IS NULL',
      [id]
    )

    if (!Array.isArray(existing) || existing.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    let imagePath = existing[0].image_url

    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer())
      const ext = getFileExtension(image.name)
      const filename = `${Date.now()}-${image.name.replace(/\.[^/.]+$/, '').replaceAll(' ', '_')}${ext}`
      imagePath = `/uploads/products/${filename}`
      const fullRemotePath = `/public_html${imagePath}`

      // Upload new image to FTP
      try {
        await ftpClient.uploadFromBuffer(buffer, fullRemotePath)
      } catch (ftpError) {
        console.error('FTP upload error:', ftpError)
        throw ftpError
      }

      // Delete old image from FTP
      try {
        await ftpClient.deleteFile(`/public_html${existing[0].image_url}`)
      } catch (ftpError) {
        console.error('FTP deletion error:', ftpError)
      }
    }

    // Update database with proper typing
    await pool.query<ResultSetHeader>(
      'UPDATE products SET name = ?, description = ?, image_url = ?, updated_at = NOW() WHERE id = ?',
      [name, description, imagePath, id]
    )

    const [updated] = await pool.query<Product[]>(
      'SELECT * FROM products WHERE id = ?', 
      [id]
    )

    return NextResponse.json(updated[0])

  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// Update DELETE handler
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Check if product exists
    const [rows]: any = await pool.query(
      'SELECT * FROM products WHERE id = ? AND deleted_at IS NULL',
      [id]
    )

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Delete from FTP first
    try {
      await ftpClient.deleteFile(`/public_html${rows[0].image_url}`)
    } catch (ftpError) {
      console.error('FTP deletion error:', ftpError)
    }

    // Soft delete in database
    await pool.query(
      'UPDATE products SET deleted_at = NOW(), updated_at = NOW() WHERE id = ?',
      [id]
    )

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
