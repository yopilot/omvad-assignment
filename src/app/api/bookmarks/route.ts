import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { fetchPageMetadata, generateSummary } from '@/lib/metadata'
import { isValidUrl } from '@/lib/utils'
import { z } from 'zod'

const createBookmarkSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  tags: z.array(z.string()).optional().default([])
})

async function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null

  const decoded = verifyToken(token)
  if (!decoded) return null

  return prisma.user.findUnique({
    where: { id: decoded.userId }
  })
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const tag = searchParams.get('tag')

    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: user.id,
        ...(tag && { tags: { contains: tag } })
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ bookmarks })
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { url, tags } = createBookmarkSchema.parse(body)

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Please enter a valid URL' },
        { status: 400 }
      )
    }

    // Check if bookmark already exists for this user
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        url,
        userId: user.id
      }
    })

    if (existingBookmark) {
      return NextResponse.json(
        { error: 'Bookmark already exists' },
        { status: 400 }
      )
    }

    // Fetch metadata and generate summary in parallel
    const [metadata, summary] = await Promise.all([
      fetchPageMetadata(url),
      generateSummary(url)
    ])

    // Create bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        url,
        title: metadata.title,
        favicon: metadata.favicon,
        summary,
        tags: JSON.stringify(tags),
        userId: user.id
      }
    })

    return NextResponse.json(
      { bookmark, message: 'Bookmark created successfully' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating bookmark:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
