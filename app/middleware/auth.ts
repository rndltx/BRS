// middleware/auth.ts
import { NextResponse, NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://brs.rizsign.my.id',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
}

export async function middleware(request: NextRequest) {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return NextResponse.json({}, { headers: corsHeaders })
  }

  // Get token from Authorization header or cookie
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') || 
                request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json(
      { error: 'No token provided' },
      { 
        status: 401,
        headers: corsHeaders
      }
    )
  }

  try {
    await jwtVerify(
      token, 
      new TextEncoder().encode(process.env.JWT_SECRET)
    )

    const response = NextResponse.next()
    
    // Add CORS headers to all responses
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { 
        status: 401,
        headers: corsHeaders
      }
    )
  }
}

export const config = {
  matcher: [
    '/api/admin/:path*',
    '/api/dashboard/:path*',
    '/api/settings/:path*'
  ]
}