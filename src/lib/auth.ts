import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Use NEXT_PUBLIC_JWT_SECRET so it is available in both API routes and middleware
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback-secret'
console.log('[auth.ts] JWT_SECRET used:', JWT_SECRET)

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Node.js runtime compatible functions (for API routes)
export function generateToken(userId: string): string {
  console.log('[auth.ts] Generating token for userId:', userId)
  console.log('[auth.ts] JWT_SECRET used for signing:', JWT_SECRET)
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
  console.log('[auth.ts] Token generated:', token.substring(0, 30) + '...')
  return token
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    console.log('[auth.ts] Verifying token:', token.substring(0, 30) + '...')
    console.log('[auth.ts] JWT_SECRET used for verify:', JWT_SECRET)
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    console.log('[auth.ts] Token decoded:', decoded)
    return decoded
  } catch (err) {
    console.error('[auth.ts] Token verification failed:', err)
    return null
  }
}
