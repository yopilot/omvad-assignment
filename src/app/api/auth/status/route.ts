import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    return NextResponse.json({ 
      authenticated: false, 
      message: 'No token found',
      cookies: request.cookies.getAll()
    })
  }

  const user = verifyToken(token)
  
  if (!user) {
    return NextResponse.json({ 
      authenticated: false, 
      message: 'Invalid token',
      token: token.substring(0, 20) + '...'
    })
  }

  return NextResponse.json({ 
    authenticated: true, 
    user: { id: user.userId },
    message: 'User is authenticated'
  })
}
