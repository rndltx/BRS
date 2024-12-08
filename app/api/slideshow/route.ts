import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import pool from '../../lib/db'

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM slideshow ORDER BY created_at DESC')
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
    // Create uploads directory if it doesn't exist
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
    const buffer = Buffer.from(await image.arrayBuffer())
    const filename = Date.now() + '-' + image.name.replaceAll(' ', '_')
    const relativePath = `/uploads/slideshow/${filename}`
    const absolutePath = path.join(process.cwd(), 'public', relativePath)

    await writeFile(absolutePath, buffer)

    // Save to database
    const [result] = await pool.query(
      'INSERT INTO slideshow (image_url) VALUES (?)',
      [relativePath]
    )

    const [newImage] = await pool.query(
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get image path before deletion
    const [image] = await pool.query(
      'SELECT image_url FROM slideshow WHERE id = ?',
      [params.id]
    )

    if (image[0]) {
      // Delete file
      const absolutePath = path.join(process.cwd(), 'public', image[0].image_url)
      try {
        await fs.unlink(absolutePath)
      } catch (error) {
        console.error('Error deleting file:', error)
      }
    }

    // Delete from database
    await pool.query('DELETE FROM slideshow WHERE id = ?', [params.id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}

