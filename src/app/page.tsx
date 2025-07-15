'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { BookmarkList } from '@/components/BookmarkList'
import { AddBookmarkForm } from '@/components/AddBookmarkForm'
import { Header } from '@/components/Header'
import { TagFilter } from '@/components/TagFilter'

export interface Bookmark {
  id: string
  url: string
  title: string
  favicon: string | null
  summary: string | null
  tags: string
  createdAt: string
  updatedAt: string
}

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [allTags, setAllTags] = useState<string[]>([])
  const router = useRouter()

  const fetchBookmarks = useCallback(async () => {
    try {
      const response = await fetch('/api/bookmarks')
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth')
          return
        }
        throw new Error('Failed to fetch bookmarks')
      }

      const data = await response.json()
      setBookmarks(data.bookmarks)
      
      // Extract all unique tags
      const tags: string[] = data.bookmarks.reduce((acc: string[], bookmark: Bookmark) => {
        try {
          const bookmarkTags = JSON.parse(bookmark.tags || '[]') as string[]
          return [...acc, ...bookmarkTags]
        } catch {
          return acc
        }
      }, [])
      
      setAllTags([...new Set(tags)])
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchBookmarks()
  }, [fetchBookmarks])

  useEffect(() => {
    if (selectedTag) {
      const filtered = bookmarks.filter(bookmark => {
        try {
          const tags = JSON.parse(bookmark.tags || '[]') as string[]
          return tags.includes(selectedTag)
        } catch {
          return false
        }
      })
      setFilteredBookmarks(filtered)
    } else {
      setFilteredBookmarks(bookmarks)
    }
  }, [bookmarks, selectedTag])

  const handleBookmarkAdded = () => {
    fetchBookmarks()
  }

  const handleBookmarkDeleted = () => {
    fetchBookmarks()
  }

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag)
  }

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)'
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading your bookmarks...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)'
      }}
    >
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <AddBookmarkForm onBookmarkAdded={handleBookmarkAdded} />
        </div>

        {allTags.length > 0 && (
          <div className="mb-6">
            <TagFilter 
              tags={allTags}
              selectedTag={selectedTag}
              onTagSelect={handleTagSelect}
            />
          </div>
        )}

        <BookmarkList 
          bookmarks={filteredBookmarks}
          onBookmarkDeleted={handleBookmarkDeleted}
        />
      </main>
    </div>
  )
}
