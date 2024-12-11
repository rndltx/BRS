import { NextResponse } from 'next/server'
import path from 'path'
import pool from '../../lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import { FtpClient } from '../../lib/ftp'

// Add size limits
const MAX_VIDEO_SIZE = 25 * 1024 * 1024 // 25MB for Vercel
const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024 // 2MB
const CHUNK_SIZE = 2 * 1024 * 1024 // 2MB chunks

// Update FTP client
const ftpClient = new FtpClient({
  host: process.env.FTP_HOST!,
  user: process.env.FTP_USER!,
  password: process.env.FTP_PASSWORD!,
  secure: true,
  port: 21
})

// Add size validation helper
const validateFileSize = (file: File, maxSize: number, type: string) => {
  if (file.size > maxSize) {
    throw new Error(`${type} size must be less than ${maxSize / (1024 * 1024)}MB`)
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

// Track chunks with proper initialization
const chunks = new Map<string, { buffers: Buffer[], totalChunks: number }>();

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

// route.ts - Update POST handler
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const chunkIndex = parseInt(formData.get('chunkIndex') as string)
    const totalChunks = parseInt(formData.get('totalChunks') as string)
    const fileId = formData.get('fileId') as string
    const chunk = formData.get('chunk') as File
    const isLastChunk = formData.get('isLastChunk') === 'true'

    // Validate inputs
    if (!fileId || !chunk || isNaN(chunkIndex) || isNaN(totalChunks)) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Initialize chunk tracking if needed
    if (!chunks.has(fileId)) {
      chunks.set(fileId, {
        buffers: Array(totalChunks),
        totalChunks
      })
    }

    const chunkData = chunks.get(fileId)
    if (!chunkData) {
      return NextResponse.json({ 
        error: 'Invalid file ID' 
      }, { status: 400 })
    }

    // Store chunk
    const chunkBuffer = Buffer.from(await chunk.arrayBuffer())
    chunkData.buffers[chunkIndex] = chunkBuffer

    // Process complete file if this is the last chunk
    if (isLastChunk) {
      const { buffers } = chunkData

      // Verify all chunks are present
      if (buffers.some(chunk => !chunk)) {
        chunks.delete(fileId)
        return NextResponse.json({ 
          error: 'Missing chunks' 
        }, { status: 400 })
      }

      const title = formData.get('title') as string
      const thumbnail = formData.get('thumbnail') as File

      if (!title || !thumbnail) {
        chunks.delete(fileId)
        return NextResponse.json({ 
          error: 'Missing title or thumbnail' 
        }, { status: 400 })
      }

      try {
        const timestamp = Date.now()
        const videoPath = `/uploads/videos/${timestamp}-${fileId}.mp4`
        const thumbnailPath = `/uploads/thumbnails/${timestamp}-thumb.jpg`
        const completeBuffer = Buffer.concat(buffers)

        await Promise.all([
          ftpClient.uploadFromBuffer(completeBuffer, `/public_html${videoPath}`),
          ftpClient.uploadFromBuffer(
            Buffer.from(await thumbnail.arrayBuffer()),
            `/public_html${thumbnailPath}`
          )
        ])

        const [result] = await pool.query<ResultSetHeader>(
          `INSERT INTO videos (title, thumbnail_url, video_url, views, active)
           VALUES (?, ?, ?, 0, 1)`,
          [title, thumbnailPath, videoPath]
        )

        chunks.delete(fileId)

        return NextResponse.json({
          success: true,
          videoId: result.insertId
        })
      } catch (error) {
        chunks.delete(fileId)
        console.error('Upload error:', error)
        return NextResponse.json({ 
          error: 'Failed to save video' 
        }, { status: 500 })
      }
    }

    // Return progress
    return NextResponse.json({
      success: true,
      progress: Math.round((chunkIndex + 1) / totalChunks * 100)
    })

  } catch (error) {
    console.error('Request error:', error)
    return NextResponse.json({ 
      error: 'Upload failed' 
    }, { status: 500 })
  }
}
