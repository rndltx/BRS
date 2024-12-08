import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import pool from '../../lib/db'

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM gallery ORDER BY id DESC')
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
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gallery')
    await mkdir(uploadDir, { recursive: true })

    const formData = await request.formData()
    const title = formData.get('title') as string
    const image = formData.get('image') as File

    if (!title || !image) {
      return NextResponse.json(
        { error: 'Title and image are required' },
        { status: 400 }
      )
    }

    // Save image file
    const buffer = Buffer.from(await image.arrayBuffer())
    const filename = Date.now() + '-' + image.name.replaceAll(' ', '_')
    const relativePath = `/uploads/gallery/${filename}`
    const absolutePath = path.join(process.cwd(), 'public', relativePath)

    await writeFile(absolutePath, buffer)

    // Save to database
    const [result] = await pool.query(
      'INSERT INTO gallery (title, image_url) VALUES (?, ?)',
      [title, relativePath]
    )

    const [newImage] = await pool.query(
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

