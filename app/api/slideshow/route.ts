import { NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import pool from '../../lib/db'
import { existsSync } from 'fs'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

interface OrderResult extends RowDataPacket {
  maxOrder: number;
}

interface SlideshowImage extends RowDataPacket {
  id: number;
  image_url: string;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM slideshow WHERE active = 1 ORDER BY display_order ASC, created_at DESC'
    )
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch slideshow images' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'slideshow')
    await mkdir(uploadDir, { recursive: true })

    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Save image file
    const timestamp = Date.now()
    const filename = `${timestamp}-${image.name.replaceAll(' ', '_')}`
    const relativePath = `/uploads/slideshow/${filename}`
    
    await writeFile(
      path.join(process.cwd(), 'public', relativePath),
      Buffer.from(await image.arrayBuffer())
    )

    // Get max display order with proper typing
    const [orderResult] = await pool.query<OrderResult[]>(
      'SELECT COALESCE(MAX(display_order), -1) as maxOrder FROM slideshow'
    )
    const nextOrder = (orderResult[0].maxOrder + 1)

    // Save to database with proper typing
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO slideshow (
        image_url, 
        display_order, 
        active
      ) VALUES (?, ?, 1)`,
      [relativePath, nextOrder]
    )

    const [newImage] = await pool.query<SlideshowImage[]>(
      'SELECT * FROM slideshow WHERE id = ?',
      [result.insertId]
    )

    return NextResponse.json(newImage[0], { status: 201 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Failed to save image' },
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

    // Get image info
    const [rows]: any = await pool.query(
      'SELECT * FROM slideshow WHERE id = ?',
      [id]
    )

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Delete file
    const absolutePath = path.join(process.cwd(), 'public', rows[0].image_url)
    if (existsSync(absolutePath)) {
      await unlink(absolutePath)
    }

    // Delete from database
    await pool.query('DELETE FROM slideshow WHERE id = ?', [id])

    return NextResponse.json({ message: 'Image deleted successfully' })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
