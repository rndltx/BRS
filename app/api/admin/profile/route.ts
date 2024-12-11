// app/api/admin/profile/route.ts
import { NextResponse } from 'next/server'
import pool from '../../../lib/db'
import bcrypt from 'bcryptjs'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

interface AdminUser extends RowDataPacket {
  id: number
  username: string
  email: string
  phone_number: string
  password: string
}

// CORS configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://brs.rizsign.my.id',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET() {
  try {
    // Add CORS headers
    const response = NextResponse

    const [rows] = await pool.query<AdminUser[]>(
      'SELECT id, username, email, phone_number FROM admin_users WHERE id = ?',
      [1] // Replace with actual admin ID from session
    )
    
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    return NextResponse.json(rows[0], { headers: corsHeaders })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { currentPassword, newPassword, ...profile } = data

    // Update profile information
    await pool.query<ResultSetHeader>(
      `UPDATE admin_users 
       SET username = ?, email = ?, phone_number = ?
       WHERE id = ?`,
      [profile.username, profile.email, profile.phone_number, 1]
    )

    // Update password if provided
    if (newPassword) {
      const [rows] = await pool.query<AdminUser[]>(
        'SELECT password FROM admin_users WHERE id = ?',
        [1]
      )

      if (!rows.length) {
        return NextResponse.json(
          { error: 'Admin not found' },
          { status: 404, headers: corsHeaders }
        )
      }

      const isValidPassword = await bcrypt.compare(
        currentPassword,
        rows[0].password
      )

      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400, headers: corsHeaders }
        )
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await pool.query<ResultSetHeader>(
        'UPDATE admin_users SET password = ? WHERE id = ?',
        [hashedPassword, 1]
      )
    }

    return NextResponse.json(
      { message: 'Profile updated successfully' },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500, headers: corsHeaders }
    )
  }
}