import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const allCookies = request.cookies.getAll()
  const authToken = request.cookies.get('auth-token')
  
  return NextResponse.json({
    allCookies: allCookies,
    authToken: authToken,
    headers: Object.fromEntries(request.headers.entries()),
    timestamp: new Date().toISOString()
  })
}
