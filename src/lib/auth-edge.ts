// Edge Runtime compatible JWT functions using Web Crypto API
import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback-secret'
const secret = new TextEncoder().encode(JWT_SECRET)

export async function generateTokenEdge(userId: string): Promise<string> {
  console.log('[auth-edge.ts] Generating token for userId:', userId)
  
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
  
  console.log('[auth-edge.ts] Token generated:', token.substring(0, 30) + '...')
  return token
}

export async function verifyTokenEdge(token: string): Promise<{ userId: string } | null> {
  try {
    console.log('[auth-edge.ts] Verifying token:', token.substring(0, 30) + '...')
    
    const { payload } = await jwtVerify(token, secret)
    console.log('[auth-edge.ts] Token decoded:', payload)
    
    return { userId: payload.userId as string }
  } catch (err) {
    console.error('[auth-edge.ts] Token verification failed:', err)
    return null
  }
}
