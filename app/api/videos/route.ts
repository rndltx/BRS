import { NextResponse } from 'next/server'
import path from 'path'
import pool from '../../lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import { FtpClient } from '../../lib/ftp'

// Reduce size limits for Vercel
const MAX_VIDEO_SIZE = 25 * 1024 * 1024 // 25MB for Vercel
const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024 // 2MB
const CHUNK_SIZE = 2 * 1024 * 1024 // 2MB per chunk

const ftpClient = new FtpClient({
  host: process.env.FTP_HOST!,
  user: process.env.FTP_USER!,
  password: process.env.FTP_PASSWORD!,
  secure: true,
  port: 21
})

// Add better validation
const validateFile = (file: File, maxSize: number, allowedTypes: string[]) => {
  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
  }
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`)
  }
}

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

// Add chunk handling
interface ChunkData {
  chunkIndex: number;
  totalChunks: number;
  fileId: string;
  chunk: Buffer;
}

const chunks = new Map<string, Buffer[]>();

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
    const video = formData.get('video') as File
    const thumbnail = formData.get('thumbnail') as File

    // Validate inputs
    if (!title || !video || !thumbnail) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate files
    try {
      validateFile(video, MAX_VIDEO_SIZE, ['video/mp4', 'video/webm', 'video/ogg'])
      validateFile(thumbnail, MAX_THUMBNAIL_SIZE, ['image/jpeg', 'image/png'])
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error: error instanceof Error ? error.message : 'Invalid file' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Upload files
    try {
      const timestamp = Date.now()
      const videoPath = `/uploads/videos/${timestamp}-${video.name}`
      const thumbnailPath = `/uploads/thumbnails/${timestamp}-${thumbnail.name}`

      await Promise.all([
        ftpClient.uploadFromBuffer(
          Buffer.from(await video.arrayBuffer()),
          `/public_html${videoPath}`
        ),
        ftpClient.uploadFromBuffer(
          Buffer.from(await thumbnail.arrayBuffer()),
          `/public_html${thumbnailPath}`
        )
      ])

      // Save to database
      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO videos (
          title, thumbnail_url, video_url, views, active
        ) VALUES (?, ?, ?, 0, 1)`,
        [title, thumbnailPath, videoPath]
      )

      return new NextResponse(
        JSON.stringify({
          success: true,
          videoId: result.insertId
        }),
        { 
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    } catch (error) {
      console.error('Upload error:', error)
      return new NextResponse(
        JSON.stringify({ error: 'Failed to upload files' }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Request error:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
