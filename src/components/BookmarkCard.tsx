'use client'

import { useState } from 'react'
import { Bookmark } from '@/app/page'
import { formatDate, truncateText, extractDomain } from '@/lib/utils'
import { ExternalLink, Trash2, Tag } from 'lucide-react'
import SummaryModal from './SummaryModal'
import Image from 'next/image'

interface BookmarkCardProps {
  bookmark: Bookmark
  onDeleted: () => void
}

export function BookmarkCard({ bookmark, onDeleted }: BookmarkCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [showSummaryModal, setShowSummaryModal] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this bookmark?')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/bookmarks/${bookmark.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete bookmark')
      }

      onDeleted()
    } catch (error) {
      console.error('Error deleting bookmark:', error)
      alert('Failed to delete bookmark. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Parse tags safely
  let tags: string[] = []
  try {
    tags = JSON.parse(bookmark.tags || '[]')
  } catch {
    // Ignore parsing errors
  }

  return (
    <div 
      onClick={() => setShowSummaryModal(true)}
      className="bookmark-card group cursor-pointer rounded-xl border border-white/20 backdrop-blur-md p-6 transition-all duration-200 hover:border-white/40 hover:shadow-lg hover:scale-[1.02]" 
      style={{
        background: 'rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="p-0">
        {/* Header with favicon and domain */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center min-w-0 flex-1">
            {bookmark.favicon && !imageError ? (
              <Image
                src={bookmark.favicon}
                alt=""
                width={20}
                height={20}
                className="w-5 h-5 mr-2 flex-shrink-0 rounded-sm"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-5 h-5 mr-2 flex-shrink-0 bg-white/20 rounded-sm"></div>
            )}
            <span className="text-sm text-white/70 truncate">
              {extractDomain(bookmark.url)}
            </span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation() // Prevent card click when deleting
              handleDelete()
            }}
            disabled={isDeleting}
            className="p-2 text-white/70 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200 backdrop-blur-sm disabled:opacity-50"
            title="Delete bookmark"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-white mb-2 line-clamp-2 leading-5 group-hover:text-purple-300 transition-colors duration-200">
          {bookmark.title}
        </h3>

        {/* Summary */}
        {bookmark.summary && (
          <p className="text-sm text-white/80 mb-3 leading-relaxed" style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {truncateText(bookmark.summary, 150)}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white/90 border border-white/20 backdrop-blur-sm"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-white/60">+{tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Footer with date and visit link */}
        <div className="flex items-center justify-between pt-3 border-t border-white/20">
          <span className="text-xs text-white/60">
            {formatDate(bookmark.createdAt)}
          </span>
          
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()} // Prevent card click when visiting link
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-colors duration-200"
          >
            Visit
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </div>
      
      {/* Summary Modal */}
      <SummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        title={bookmark.title}
        url={bookmark.url}
        fullContent={bookmark.summary || ''}
        favicon={bookmark.favicon || undefined}
        tags={bookmark.tags}
        createdAt={bookmark.createdAt}
      />
    </div>
  )
}
