// app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server'
import pool from '../../../lib/db'
import { RowDataPacket } from 'mysql2'

interface CountResult extends RowDataPacket {
  count: number
}

export async function GET() {
  try {
    const [products] = await pool.query<CountResult[]>(
      'SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL AND active = 1'
    )
    
    const [gallery] = await pool.query<CountResult[]>(
      'SELECT COUNT(*) as count FROM gallery WHERE deleted_at IS NULL'
    )
    
    const [videos] = await pool.query<CountResult[]>(
      'SELECT COUNT(*) as count FROM videos WHERE deleted_at IS NULL AND active = 1'
    )

    const [slideshow] = await pool.query<CountResult[]>(
      'SELECT COUNT(*) as count FROM slideshow WHERE active = 1'
    )

    return NextResponse.json({
      products: products[0].count,
      gallery: gallery[0].count,
      videos: videos[0].count,
      slideshow: slideshow[0].count
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}