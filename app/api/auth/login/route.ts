// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import pool from '../../../lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { RowDataPacket } from 'mysql2'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// CORS configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://brs.rizsign.my.id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
}

interface AdminUser extends RowDataPacket {
  id: number;
  username: string;
  password: string;
  email: string;
  last_login: Date;
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
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
        { status: 401, headers: corsHeaders }
      )
    }

    const user = rows[0]

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401, headers: corsHeaders }
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

    // Create response with cookie
    const response = NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      },
      { headers: corsHeaders }
    )

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/',
      domain: 'rizsign.my.id'
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500, headers: corsHeaders }
    )
  }
}