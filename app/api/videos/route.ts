import { NextResponse } from 'next/server'
import path from 'path'
import pool from '../../lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import { FtpClient } from '../../lib/ftp'

interface Video extends RowDataPacket {
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

const ftpClient = new FtpClient({
  host: process.env.FTP_HOST!,
  user: process.env.FTP_USER!,
  password: process.env.FTP_PASSWORD!,
  secure: true,
  port: 21
})

export async function GET(request: Request) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM videos WHERE deleted_at IS NULL ORDER BY created_at DESC'
    )
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
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

    const timestamp = Date.now()
    const thumbnailFilename = `${timestamp}-${thumbnail.name.replaceAll(' ', '_')}`
    const videoFilename = `${timestamp}-${video.name.replaceAll(' ', '_')}`

    const thumbnailPath = `/uploads/thumbnails/${thumbnailFilename}`
    const videoPath = `/uploads/videos/${videoFilename}`

    // Upload thumbnail to FTP
    try {
      const thumbnailBuffer = Buffer.from(await thumbnail.arrayBuffer())
      await ftpClient.uploadFromBuffer(thumbnailBuffer, `/public_html${thumbnailPath}`)
    } catch (ftpError) {
      console.error('FTP thumbnail upload error:', ftpError)
      throw ftpError
    }

    // Upload video to FTP
    try {
      const videoBuffer = Buffer.from(await video.arrayBuffer())
      await ftpClient.uploadFromBuffer(videoBuffer, `/public_html${videoPath}`)
    } catch (ftpError) {
      console.error('FTP video upload error:', ftpError)
      throw ftpError
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO videos (
        title, thumbnail_url, video_url, views, active, created_at, updated_at
      ) VALUES (?, ?, ?, 0, 1, NOW(), NOW())`,
      [title, thumbnailPath, videoPath]
    )

    const [newVideo] = await pool.query<Video[]>(
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

export async function PUT(request: Request) {
  try {
    const formData = await request.formData()
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const thumbnail = formData.get('thumbnail') as File | null
    const video = formData.get('video') as File | null

    if (!id || !title) {
      return NextResponse.json(
        { error: 'ID and title are required' },
        { status: 400 }
      )
    }

    const [existing] = await pool.query<Video[]>(
      'SELECT * FROM videos WHERE id = ? AND deleted_at IS NULL',
      [id]
    )

    if (!Array.isArray(existing) || existing.length === 0) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    let thumbnailPath = existing[0].thumbnail_url
    let videoPath = existing[0].video_url

    if (thumbnail && thumbnail.size > 0) {
      const timestamp = Date.now()
      const thumbnailFilename = `${timestamp}-${thumbnail.name.replaceAll(' ', '_')}`
      thumbnailPath = `/uploads/thumbnails/${thumbnailFilename}`

      // Upload new thumbnail
      try {
        const thumbnailBuffer = Buffer.from(await thumbnail.arrayBuffer())
        await ftpClient.uploadFromBuffer(thumbnailBuffer, `/public_html${thumbnailPath}`)
        
        // Delete old thumbnail
        await ftpClient.deleteFile(`/public_html${existing[0].thumbnail_url}`)
      } catch (ftpError) {
        console.error('FTP thumbnail error:', ftpError)
      }
    }

    if (video && video.size > 0) {
      const timestamp = Date.now()
      const videoFilename = `${timestamp}-${video.name.replaceAll(' ', '_')}`
      videoPath = `/uploads/videos/${videoFilename}`

      // Upload new video
      try {
        const videoBuffer = Buffer.from(await video.arrayBuffer())
        await ftpClient.uploadFromBuffer(videoBuffer, `/public_html${videoPath}`)
        
        // Delete old video
        await ftpClient.deleteFile(`/public_html${existing[0].video_url}`)
      } catch (ftpError) {
        console.error('FTP video error:', ftpError)
      }
    }

    await pool.query<ResultSetHeader>(
      `UPDATE videos 
       SET title = ?, thumbnail_url = ?, video_url = ?, updated_at = NOW()
       WHERE id = ?`,
      [title, thumbnailPath, videoPath, id]
    )

    const [updated] = await pool.query<Video[]>(
      'SELECT * FROM videos WHERE id = ?',
      [id]
    )

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json(
      { error: 'Failed to update video' },
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
        { error: 'Video ID is required' },
        { status: 400 }
      )
    }

    const [rows] = await pool.query<Video[]>(
      'SELECT * FROM videos WHERE id = ? AND deleted_at IS NULL',
      [id]
    )

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    // Delete files from FTP
    try {
      await ftpClient.deleteFile(`/public_html${rows[0].thumbnail_url}`)
      await ftpClient.deleteFile(`/public_html${rows[0].video_url}`)
    } catch (ftpError) {
      console.error('FTP deletion error:', ftpError)
    }

    // Soft delete in database
    await pool.query(
      'UPDATE videos SET deleted_at = NOW(), updated_at = NOW() WHERE id = ?',
      [id]
    )

    return NextResponse.json({ message: 'Video deleted successfully' })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      )
    }

    // Update views count
    await pool.query<ResultSetHeader>(
      'UPDATE videos SET views = views + 1, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [id]
    )

    // Get updated video data
    const [updated] = await pool.query<Video[]>(
      'SELECT * FROM videos WHERE id = ?',
      [id]
    )

    if (!Array.isArray(updated) || updated.length === 0) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error('View update error:', error)
    return NextResponse.json(
      { error: 'Failed to update view count' },
      { status: 500 }
    )
  }
}
