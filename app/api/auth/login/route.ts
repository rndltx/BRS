// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import pool from '../../../lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { RowDataPacket } from 'mysql2'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Update CORS headers
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

// Handle OPTIONS preflight request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders
  })
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    const [user] = await pool.query(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    )

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { 
          status: 401,
          headers: corsHeaders
        }
      )
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    )

    const response = NextResponse.json(
      { success: true, token },
      { headers: corsHeaders }
    )

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 86400,
      path: '/',
      domain: 'rizsign.my.id'
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { 
        status: 500,
        headers: corsHeaders
      }
    )
  }
}