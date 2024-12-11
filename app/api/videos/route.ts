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
  const chunks = new Map<string, Buffer[]>()
  
  try {
    const formData = await request.formData()
    const chunkIndex = parseInt(formData.get('chunkIndex') as string)
    const totalChunks = parseInt(formData.get('totalChunks') as string)
    const fileId = formData.get('fileId') as string
    const chunk = formData.get('chunk') as File
    const isLastChunk = chunkIndex === totalChunks - 1

    // Validate chunk
    if (!chunk || !fileId) {
      throw new Error('Missing required fields')
    }

    // Initialize chunk array
    if (!chunks.has(fileId)) {
      chunks.set(fileId, [])
    }

    // Store chunk
    const chunkBuffer = Buffer.from(await chunk.arrayBuffer())
    chunks.get(fileId)![chunkIndex] = chunkBuffer

    // Process complete file on last chunk
    if (isLastChunk) {
      const completeBuffer = Buffer.concat(chunks.get(fileId)!)
      const title = formData.get('title') as string
      const thumbnail = formData.get('thumbnail') as File

      // Validate files
      if (!title || !thumbnail) {
        throw new Error('Missing title or thumbnail')
      }

      validateFile(thumbnail, MAX_THUMBNAIL_SIZE, ['image/jpeg', 'image/png'])

      // Upload files
      try {
        const timestamp = Date.now()
        const videoPath = `/uploads/videos/${timestamp}-${fileId}.mp4`
        const thumbnailPath = `/uploads/thumbnails/${timestamp}-thumb.jpg`

        await Promise.all([
          ftpClient.uploadFromBuffer(completeBuffer, `/public_html${videoPath}`),
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

        return NextResponse.json({
          success: true,
          videoId: result.insertId
        })
      } finally {
        // Cleanup
        chunks.delete(fileId)
      }
    }

    // Return progress
    return NextResponse.json({
      success: true,
      progress: Math.round((chunkIndex + 1) / totalChunks * 100)
    })

  } catch (error) {
    console.error('Upload error:', error)
    
    // Cleanup on error
    if (chunks.size > 0) {
      chunks.clear()
    }

    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Upload failed'
    }, { status: 500 })
  }
}
