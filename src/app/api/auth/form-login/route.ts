import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { comparePassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      const response = NextResponse.redirect(new URL('/auth?error=missing-fields', request.url))
      return response
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      const response = NextResponse.redirect(new URL('/auth?error=invalid-credentials', request.url))
      return response
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      const response = NextResponse.redirect(new URL('/auth?error=invalid-credentials', request.url))
      return response
    }

    // Generate JWT token
    const token = generateToken(user.id)
    console.log('Generated token for user:', user.id)

    // Create redirect response with cookie
    const response = NextResponse.redirect(new URL('/', request.url))
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: false, // Set to false for development
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    console.log('Cookie set for user:', user.email)
    console.log('Redirecting to home page')
    return response
  } catch (error) {
    console.error('Login error:', error)
    const response = NextResponse.redirect(new URL('/auth?error=server-error', request.url))
    return response
  }
}
