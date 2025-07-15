'use client'

import { Bookmark } from '@/app/page'
import { BookmarkCard } from './BookmarkCard'

interface BookmarkListProps {
  bookmarks: Bookmark[]
  onBookmarkDeleted: () => void
}

export function BookmarkList({ bookmarks, onBookmarkDeleted }: BookmarkListProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 3v4M3 5h4m6-1v10l4-4m-4 4l-4-4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-lg">No bookmarks yet</h3>
          <p className="text-white/70 leading-relaxed">
            Start by adding your first bookmark above. Paste any URL to automatically extract 
            the title, favicon, and generate an AI-powered summary.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white drop-shadow-lg">
          Your Bookmarks ({bookmarks.length})
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onDeleted={onBookmarkDeleted}
          />
        ))}
      </div>
    </div>
  )
}
