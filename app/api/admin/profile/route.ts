// app/api/admin/profile/route.ts
import { NextResponse } from 'next/server'
import pool from '../../../lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, email, phone_number FROM admin_users WHERE id = ?',
      [1] // Replace with actual admin ID from session
    )
    
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { currentPassword, newPassword, ...profile } = data

    // Update profile information
    await pool.query(
      `UPDATE admin_users 
       SET username = ?, email = ?, phone_number = ?
       WHERE id = ?`,
      [profile.username, profile.email, profile.phone_number, 1] // Replace with actual admin ID
    )

    // Update password if provided
    if (newPassword) {
      const [user] = await pool.query(
        'SELECT password FROM admin_users WHERE id = ?',
        [1] // Replace with actual admin ID
      )

      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user[0].password
      )

      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        )
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await pool.query(
        'UPDATE admin_users SET password = ? WHERE id = ?',
        [hashedPassword, 1] // Replace with actual admin ID
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}