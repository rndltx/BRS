import { NextResponse } from 'next/server'
import pool from '../../lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

interface DbSettings extends RowDataPacket {
  id: number;
  site_name: string;
  contact_email: string;
  phone_number: string;
  address: string;
  theme: 'light' | 'dark' | 'system';
}

interface Settings {
  siteName: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  theme: 'light' | 'dark' | 'system';
}

export async function GET() {
  try {
    const [rows] = await pool.query<DbSettings[]>('SELECT * FROM settings ORDER BY id DESC LIMIT 1')
    
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({
        siteName: 'CV. Berkat Rahmat Sejahtera',
        contactEmail: 'info@cvbrs.com',
        phoneNumber: '+62 123 456 7890',
        address: 'Jakarta, Indonesia',
        theme: 'light'
      })
    }
    
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const settings: Settings = await request.json()

    if (!settings.siteName || !settings.contactEmail) {
      return NextResponse.json(
        { error: 'Site name and contact email are required' },
        { status: 400 }
      )
    }

    const [existing] = await pool.query<DbSettings[]>('SELECT id FROM settings LIMIT 1')

    if (Array.isArray(existing) && existing.length > 0) {
      await pool.query<ResultSetHeader>(
        `UPDATE settings SET 
         site_name = ?,
         contact_email = ?,
         phone_number = ?,
         address = ?,
         theme = ?
         WHERE id = ?`,
        [
          settings.siteName,
          settings.contactEmail,
          settings.phoneNumber,
          settings.address,
          settings.theme,
          existing[0].id
        ]
      )
    } else {
      await pool.query<ResultSetHeader>(
        `INSERT INTO settings 
         (site_name, contact_email, phone_number, address, theme)
         VALUES (?, ?, ?, ?, ?)`,
        [
          settings.siteName,
          settings.contactEmail,
          settings.phoneNumber,
          settings.address,
          settings.theme
        ]
      )
    }

    const [updated] = await pool.query<DbSettings[]>('SELECT * FROM settings ORDER BY id DESC LIMIT 1')
    return NextResponse.json(updated[0])

  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
