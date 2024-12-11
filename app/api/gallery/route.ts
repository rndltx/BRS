import { NextResponse } from 'next/server'
import path from 'path'
import pool from '../../lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import { FtpClient } from '../../lib/ftp'

// CORS configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://brs.rizsign.my.id',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
}

interface GalleryImage extends RowDataPacket {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

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

const ftpClient = new FtpClient({
  host: process.env.FTP_HOST!,
  user: process.env.FTP_USER!,
  password: process.env.FTP_PASSWORD!,
  secure: true,
  port: 21
})

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM gallery WHERE deleted_at IS NULL ORDER BY id DESC')
    return NextResponse.json(rows, { headers: corsHeaders })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const image = formData.get('image') as File

    if (!title || !image) {
      return NextResponse.json(
        { error: 'Title and image are required' },
        { status: 400, headers: corsHeaders }
      )
    }

    if (!isValidImageType(image.type)) {
      return NextResponse.json(
        { error: 'Invalid image type. Supported formats: JPG, PNG, GIF, WebP' },
        { status: 400, headers: corsHeaders }
      )
    }

    const buffer = Buffer.from(await image.arrayBuffer())
    const ext = getFileExtension(image.name)
    const filename = `${Date.now()}-${image.name.replace(/\.[^/.]+$/, '').replaceAll(' ', '_')}${ext}`
    const relativePath = `/uploads/gallery/${filename}`
    const fullRemotePath = `/public_html${relativePath}`

    // Upload to FTP
    try {
      await ftpClient.uploadFromBuffer(buffer, fullRemotePath)
    } catch (ftpError) {
      console.error('FTP upload error:', ftpError)
      throw ftpError
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO gallery (title, image_url, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
      [title, relativePath]
    )

    const [newImage] = await pool.query<GalleryImage[]>(
      'SELECT * FROM gallery WHERE id = ?',
      [result.insertId]
    )

    return NextResponse.json(newImage[0], { 
      status: 201,
      headers: corsHeaders 
    })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Failed to save gallery image' },
      { status: 500, headers: corsHeaders }
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
        { status: 400, headers: corsHeaders }
      )
    }

    const [existing] = await pool.query<GalleryImage[]>(
      'SELECT * FROM gallery WHERE id = ? AND deleted_at IS NULL',
      [id]
    )

    if (!Array.isArray(existing) || existing.length === 0) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    let imagePath = existing[0].image_url

    if (image) {
      if (!isValidImageType(image.type)) {
        return NextResponse.json(
          { error: 'Invalid image type. Supported formats: JPG, PNG, GIF, WebP' },
          { status: 400, headers: corsHeaders }
        )
      }

      const buffer = Buffer.from(await image.arrayBuffer())
      const ext = getFileExtension(image.name)
      const filename = `${Date.now()}-${image.name.replace(/\.[^/.]+$/, '').replaceAll(' ', '_')}${ext}`
      imagePath = `/uploads/gallery/${filename}`
      const fullRemotePath = `/public_html${imagePath}`

      // Upload new image
      try {
        await ftpClient.uploadFromBuffer(buffer, fullRemotePath)
      } catch (ftpError) {
        console.error('FTP upload error:', ftpError)
        throw ftpError
      }

      // Delete old image
      try {
        await ftpClient.deleteFile(`/public_html${existing[0].image_url}`)
      } catch (ftpError) {
        console.error('FTP deletion error:', ftpError)
      }
    }

    await pool.query(
      'UPDATE gallery SET title = ?, image_url = ?, updated_at = NOW() WHERE id = ?',
      [title, imagePath, id]
    )

    const [updated] = await pool.query<GalleryImage[]>(
      'SELECT * FROM gallery WHERE id = ?',
      [id]
    )

    return NextResponse.json(updated[0], { headers: corsHeaders })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500, headers: corsHeaders }
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
        { status: 400, headers: corsHeaders }
      )
    }

    const [rows] = await pool.query<GalleryImage[]>(
      'SELECT * FROM gallery WHERE id = ? AND deleted_at IS NULL',
      [id]
    )

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    // Delete from FTP
    try {
      await ftpClient.deleteFile(`/public_html${rows[0].image_url}`)
    } catch (ftpError) {
      console.error('FTP deletion error:', ftpError)
    }

    // Soft delete in database
    await pool.query(
      'UPDATE gallery SET deleted_at = NOW(), updated_at = NOW() WHERE id = ?',
      [id]
    )

    return NextResponse.json({ message: 'Image deleted successfully' }, { headers: corsHeaders })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500, headers: corsHeaders }
    )
  }
}
