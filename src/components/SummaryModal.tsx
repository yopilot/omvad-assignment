import { X, ExternalLink, Tag } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { extractDomain, formatDate } from '@/lib/utils'

interface SummaryModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  url: string
  fullContent: string
  favicon?: string
  tags?: string
  createdAt?: string
}

export default function SummaryModal({ 
  isOpen, 
  onClose, 
  title, 
  url, 
  fullContent, 
  favicon, 
  tags, 
  createdAt 
}: SummaryModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Parse tags safely
  let parsedTags: string[] = []
  try {
    parsedTags = JSON.parse(tags || '[]')
  } catch {
    // Ignore parsing errors
  }

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      {/* Blurred Backdrop */}
      <div 
        className="fixed inset-0 backdrop-blur-lg bg-black/50 transition-all duration-300"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onClose()
        }}
        style={{
          backdropFilter: 'blur(8px) saturate(180%)',
          zIndex: 9998
        }}
      />
      
      {/* Expanded Card Modal */}
      <div 
        className="relative w-full max-w-2xl mx-auto rounded-xl border border-purple-300/30 shadow-2xl transition-all duration-300 transform scale-100 animate-in zoom-in-95 flex flex-col max-h-[85vh]"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 69, 195, 0.95) 0%, rgba(219, 39, 119, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)',
          zIndex: 10000
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={(e) => {
            console.log('Close button clicked') // Debug log
            e.preventDefault()
            e.stopPropagation()
            onClose()
          }}
          className="absolute top-4 right-4 p-3 text-white hover:text-red-300 hover:bg-white/30 rounded-full transition-all duration-200 backdrop-blur-sm shadow-xl border border-white/20 hover:border-red-300/50"
          aria-label="Close modal"
          style={{ zIndex: 10001 }}
        >
          <X size={24} />
        </button>

        {/* Header Section */}
        <div className="p-6 pb-4 border-b border-white/20">
          {/* Header with favicon and domain */}
          <div className="flex items-center mb-4">
            {favicon ? (
              <img
                src={favicon}
                alt=""
                className="w-7 h-7 mr-3 flex-shrink-0 rounded-md shadow-sm bg-white/10 p-1"
              />
            ) : (
              <div className="w-7 h-7 mr-3 flex-shrink-0 bg-white/30 rounded-md shadow-sm"></div>
            )}
            <span className="text-sm text-white/90 font-medium">
              {extractDomain(url)}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight pr-12">
            {title}
          </h2>
        </div>

        {/* Content Section - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* Full Content */}
          <div className="text-white mb-6 leading-relaxed space-y-4">
            {fullContent ? (
              <div className="space-y-3">
                {fullContent.split('\n').map((paragraph, index) => {
                  const trimmed = paragraph.trim()
                  if (!trimmed) return <div key={index} className="h-2" />
                  
                  // Handle headers
                  if (trimmed.startsWith('# ')) {
                    return <h3 key={index} className="text-xl font-semibold text-white mt-6 mb-3 first:mt-0">{trimmed.slice(2)}</h3>
                  }
                  if (trimmed.startsWith('## ')) {
                    return <h4 key={index} className="text-lg font-medium text-white mt-4 mb-2 first:mt-0">{trimmed.slice(3)}</h4>
                  }
                  
                  return (
                    <p key={index} className="text-white/95 leading-relaxed text-sm">
                      {trimmed}
                    </p>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/70">No detailed content available.</p>
              </div>
            )}
          </div>

          {/* Tags */}
          {parsedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {parsedTags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30 backdrop-blur-sm shadow-sm"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div className="p-6 pt-4 border-t border-white/20 bg-black/10">
          <div className="flex items-center justify-between">
            {createdAt && (
              <span className="text-sm text-white/80 font-medium">
                Added {formatDate(createdAt)}
              </span>
            )}
            
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/50 rounded-lg transition-all duration-200 ml-auto backdrop-blur-sm shadow-lg"
            >
              Visit Website
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )

  // Render modal using portal to document.body to escape stacking context
  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null
}
