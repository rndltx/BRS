import { NextResponse } from 'next/server'
import pool from '../../lib/db'

interface Settings {
  siteName: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  theme: 'light' | 'dark' | 'system';
}

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM settings ORDER BY id DESC LIMIT 1')
    
    if (!rows || rows.length === 0) {
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

    // Validate required fields
    if (!settings.siteName || !settings.contactEmail) {
      return NextResponse.json(
        { error: 'Site name and contact email are required' },
        { status: 400 }
      )
    }

    // Check if settings exist
    const [existing] = await pool.query('SELECT id FROM settings LIMIT 1')

    if (existing && existing.length > 0) {
      // Update existing settings
      await pool.query(
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
      // Insert new settings
      await pool.query(
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

    // Return updated settings
    const [updated] = await pool.query('SELECT * FROM settings ORDER BY id DESC LIMIT 1')
    return NextResponse.json(updated[0])

  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

