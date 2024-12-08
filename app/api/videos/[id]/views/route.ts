// app/api/videos/[id]/views/route.ts
import { NextResponse } from 'next/server'
import pool from '../../../../lib/db'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await pool.query(
      'UPDATE videos SET views = views + 1 WHERE id = ?',
      [params.id]
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to update view count' },
      { status: 500 }
    )
  }
}