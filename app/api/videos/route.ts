import { NextResponse } from 'next/server'
import path from 'path'
import pool from '../../lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import { FtpClient } from '../../lib/ftp'

// Add size limits
const MAX_VIDEO_SIZE = 500 * 1024 * 1024 // 500MB
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024 // 5MB
const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB per chunk

// Update FTP client
const ftpClient = new FtpClient({
  host: 'rizsign.my.id',
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
    const formData = await request.formData();
    const chunkIndex = parseInt(formData.get('chunkIndex') as string);
    const totalChunks = parseInt(formData.get('totalChunks') as string);
    const fileId = formData.get('fileId') as string;
    const chunk = formData.get('chunk') as File;
    const isLastChunk = chunkIndex === totalChunks - 1;

    // Handle chunk storage
    if (!chunks.has(fileId)) {
      chunks.set(fileId, []);
    }

    const chunkBuffer = Buffer.from(await chunk.arrayBuffer());
    chunks.get(fileId)![chunkIndex] = chunkBuffer;

    // If this is the last chunk, process the complete file
    if (isLastChunk) {
      const completeBuffer = Buffer.concat(chunks.get(fileId)!);
      const title = formData.get('title') as string;
      const thumbnail = formData.get('thumbnail') as File;

      // Upload complete video
      const timestamp = Date.now();
      const videoFilename = `${timestamp}-${fileId}.mp4`;
      const videoPath = `/uploads/videos/${videoFilename}`;

      await ftpClient.uploadFromBuffer(completeBuffer, `/public_html${videoPath}`);

      // Handle thumbnail
      const thumbnailBuffer = Buffer.from(await thumbnail.arrayBuffer());
      const thumbnailFilename = `${timestamp}-thumbnail.jpg`;
      const thumbnailPath = `/uploads/thumbnails/${thumbnailFilename}`;
      
      await ftpClient.uploadFromBuffer(thumbnailBuffer, `/public_html${thumbnailPath}`);

      // Save to database
      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO videos (
          title, thumbnail_url, video_url, views, active, created_at, updated_at
        ) VALUES (?, ?, ?, 0, 1, NOW(), NOW())`,
        [title, thumbnailPath, videoPath]
      );

      // Cleanup chunks
      chunks.delete(fileId);

      return NextResponse.json({ 
        success: true,
        message: 'Video uploaded successfully',
        videoId: result.insertId
      });
    }

    // Return progress for non-final chunks
    return NextResponse.json({ 
      success: true,
      progress: (chunkIndex + 1) / totalChunks * 100 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
