import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import pool from '../../lib/db'

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM videos ORDER BY created_at DESC')
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Create upload directories
    const uploadDir = {
      thumbnails: path.join(process.cwd(), 'public', 'uploads', 'thumbnails'),
      videos: path.join(process.cwd(), 'public', 'uploads', 'videos')
    }
    
    await mkdir(uploadDir.thumbnails, { recursive: true })
    await mkdir(uploadDir.videos, { recursive: true })

    const formData = await request.formData()
    const title = formData.get('title') as string
    const thumbnail = formData.get('thumbnail') as File
    const video = formData.get('video') as File

    if (!title || !thumbnail || !video) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Save files
    const timestamp = Date.now()
    const thumbnailFilename = `${timestamp}-${thumbnail.name.replaceAll(' ', '_')}`
    const videoFilename = `${timestamp}-${video.name.replaceAll(' ', '_')}`

    const thumbnailPath = `/uploads/thumbnails/${thumbnailFilename}`
    const videoPath = `/uploads/videos/${videoFilename}`

    await writeFile(
      path.join(process.cwd(), 'public', thumbnailPath), 
      Buffer.from(await thumbnail.arrayBuffer())
    )
    await writeFile(
      path.join(process.cwd(), 'public', videoPath),
      Buffer.from(await video.arrayBuffer())
    )

    // Save to database
    const [result] = await pool.query(
      'INSERT INTO videos (title, thumbnail_url, video_url) VALUES (?, ?, ?)',
      [title, thumbnailPath, videoPath]
    )

    const [newVideo] = await pool.query(
      'SELECT * FROM videos WHERE id = ?',
      [result.insertId]
    )

    return NextResponse.json(newVideo[0], { status: 201 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Failed to save video' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get file paths before deletion
    const [video] = await pool.query(
      'SELECT thumbnail_url, video_url FROM videos WHERE id = ?',
      [params.id]
    )

    if (video[0]) {
      // Delete files
      const paths = [video[0].thumbnail_url, video[0].video_url]
      for (const filePath of paths) {
        try {
          await fs.unlink(path.join(process.cwd(), 'public', filePath))
        } catch (error) {
          console.error('Error deleting file:', error)
        }
      }
    }

    // Delete from database
    await pool.query('DELETE FROM videos WHERE id = ?', [params.id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    )
  }
}

