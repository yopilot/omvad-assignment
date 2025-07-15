import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.json({ message: 'Test cookie set' })
  
  response.cookies.set('test-cookie', 'test-value', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60,
    path: '/'
  })
  
  return response
}
