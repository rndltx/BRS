import { NextResponse } from 'next/server'
import pool from '../../lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

interface VisionMission extends RowDataPacket {
  id: number;
  vision: string;
  mission: string;
  created_at: string;
  updated_at: string;
}

export async function GET() {
  try {
    const [rows] = await pool.query<VisionMission[]>(
      'SELECT * FROM vision_mission ORDER BY id DESC LIMIT 1'
    )
    
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({
        vision: "",
        mission: ""
      })
    }
    
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vision & mission' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { vision, mission } = data as VisionMission

    if (!vision?.trim() || !mission?.trim()) {
      return NextResponse.json(
        { error: 'Vision and mission are required' },
        { status: 400 }
      )
    }

    // Get latest record
    const [existing] = await pool.query<VisionMission[]>(
      'SELECT * FROM vision_mission ORDER BY id DESC LIMIT 1'
    )

    if (Array.isArray(existing) && existing.length > 0) {
      // Update existing record
      await pool.query<ResultSetHeader>(
        `UPDATE vision_mission 
         SET vision = ?, 
             mission = ?,
             updated_at = NOW()
         WHERE id = ?`,
        [vision.trim(), mission.trim(), existing[0].id]
      )
    } else {
      // Insert new record
      await pool.query<ResultSetHeader>(
        `INSERT INTO vision_mission (vision, mission, created_at, updated_at)
         VALUES (?, ?, NOW(), NOW())`,
        [vision.trim(), mission.trim()]
      )
    }

    // Return updated/new record
    const [result] = await pool.query<VisionMission[]>(
      'SELECT * FROM vision_mission ORDER BY id DESC LIMIT 1'
    )

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to update vision & mission' },
      { status: 500 }
    )
  }
}