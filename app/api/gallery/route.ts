import { NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import pool from '../../lib/db'
import { existsSync } from 'fs'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

interface GalleryImage extends RowDataPacket {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'gallery')

// Helper functions
const isValidImageType = (type: string) => {
  return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(type)
}

const getFileExtension = (filename: string) => {
  const ext = path.extname(filename).toLowerCase()
  if (!ext || !isValidImageType(`image/${ext.slice(1)}`)) {
    return '.jpg'
  }
  return ext
}

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM gallery WHERE deleted_at IS NULL ORDER BY id DESC')
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true })

    const formData = await request.formData()
    const title = formData.get('title') as string
    const image = formData.get('image') as File

    if (!title || !image) {
      return NextResponse.json(
        { error: 'Title and image are required' },
        { status: 400 }
      )
    }

    // Validate image type
    if (!isValidImageType(image.type)) {
      return NextResponse.json(
        { error: 'Invalid image type. Supported formats: JPG, PNG, GIF, WebP' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await image.arrayBuffer())
    const ext = getFileExtension(image.name)
    const filename = `${Date.now()}-${image.name.replace(/\.[^/.]+$/, '').replaceAll(' ', '_')}${ext}`
    const relativePath = `/uploads/gallery/${filename}`
    const absolutePath = path.join(process.cwd(), 'public', relativePath)

    await writeFile(absolutePath, buffer)

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO gallery (title, image_url, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
      [title, relativePath]
    )

    const [newImage] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM gallery WHERE id = ?',
      [result.insertId]
    )

    return NextResponse.json(newImage[0], { status: 201 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Failed to save gallery image' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      )
    }

    // Check if image exists
    const [rows]: any = await pool.query(
      'SELECT * FROM gallery WHERE id = ? AND deleted_at IS NULL',
      [id]
    )

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    const image = rows[0]
    const absolutePath = path.join(process.cwd(), 'public', image.image_url)

    // Soft delete in database
    await pool.query(
      'UPDATE gallery SET deleted_at = NOW(), updated_at = NOW() WHERE id = ?',
      [id]
    )

    // Remove file if exists
    if (existsSync(absolutePath)) {
      try {
        await unlink(absolutePath)
      } catch (fileError) {
        console.error('File deletion error:', fileError)
      }
    }

    return NextResponse.json(
      { message: 'Image deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const image = formData.get('image') as File | null
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      )
    }

    // Check if image exists
    const [existing] = await pool.query<GalleryImage[]>(
      'SELECT * FROM gallery WHERE id = ? AND deleted_at IS NULL',
      [id]
    )

    if (!Array.isArray(existing) || existing.length === 0) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    let imagePath = existing[0].image_url

    // Handle new image upload if provided
    if (image) {
      if (!isValidImageType(image.type)) {
        return NextResponse.json(
          { error: 'Invalid image type. Supported formats: JPG, PNG, GIF, WebP' },
          { status: 400 }
        )
      }

      const buffer = Buffer.from(await image.arrayBuffer())
      const ext = getFileExtension(image.name)
      const filename = `${Date.now()}-${image.name.replace(/\.[^/.]+$/, '').replaceAll(' ', '_')}${ext}`
      imagePath = `/uploads/gallery/${filename}`
      const absolutePath = path.join(process.cwd(), 'public', imagePath)

      // Ensure upload directory exists
      await mkdir(UPLOAD_DIR, { recursive: true })
      await writeFile(absolutePath, buffer)

      // Delete old image
      const oldPath = path.join(process.cwd(), 'public', existing[0].image_url)
      if (existsSync(oldPath)) {
        await unlink(oldPath).catch(console.error)
      }
    }

    // Update database
    await pool.query(
      'UPDATE gallery SET title = ?, image_url = ?, updated_at = NOW() WHERE id = ?',
      [title, imagePath, id]
    )

    const [updated] = await pool.query<GalleryImage[]>(
      'SELECT * FROM gallery WHERE id = ?',
      [id]
    )

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    )
  }
}

