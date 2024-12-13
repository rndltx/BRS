// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import pool from '../../../lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { RowDataPacket } from 'mysql2'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

interface AdminUser extends RowDataPacket {
  id: number;
  username: string;
  password: string;
  email: string;
  last_login: Date;
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Get user from database
    const [rows] = await pool.query<AdminUser[]>(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    )

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const user = rows[0]

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        username: user.username 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Update last login
    await pool.query(
      'UPDATE admin_users SET last_login = NOW() WHERE id = ?',
      [user.id]
    )

    return NextResponse.json({
      success: true,
      token,
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}