import { NextResponse } from 'next/server'
import pool from '../../lib/db'

interface VisionMission {
  vision: string;
  mission: string;
}

export async function GET() {
  try {
    const [rows] = await pool.query<VisionMission[]>('SELECT vision, mission FROM vision_mission ORDER BY id DESC LIMIT 1')
    
    if (!rows || rows.length === 0) {
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
    const { vision, mission } = data

    if (!vision || !mission) {
      return NextResponse.json(
        { error: 'Vision and mission are required' },
        { status: 400 }
      )
    }

    await pool.query(
      `INSERT INTO vision_mission (vision, mission) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE 
       vision = VALUES(vision), 
       mission = VALUES(mission)`,
      [vision, mission]
    )

    // Fetch and return the updated data
    const [updated] = await pool.query<VisionMission[]>(
      'SELECT vision, mission FROM vision_mission ORDER BY id DESC LIMIT 1'
    )

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to update vision & mission' },
      { status: 500 }
    )
  }
}