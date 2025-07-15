'use client'

import { cn } from '@/lib/utils'

interface TagFilterProps {
  tags: string[]
  selectedTag: string | null
  onTagSelect: (tag: string | null) => void
}

export function TagFilter({ tags, selectedTag, onTagSelect }: TagFilterProps) {
  return (
    <div className="rounded-xl shadow-xl border border-white/20 p-4 backdrop-blur-md" style={{
      background: 'rgba(255, 255, 255, 0.1)'
    }}>
      <h3 className="text-sm font-medium text-white mb-3 drop-shadow-lg">Filter by tags</h3>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onTagSelect(null)}
          className={cn(
            'px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 backdrop-blur-sm border',
            selectedTag === null
              ? 'bg-white/30 text-white border-white/50 shadow-lg'
              : 'bg-white/10 text-white/80 hover:bg-white/20 border-white/30'
          )}
        >
          All
        </button>
        
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={cn(
              'px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 backdrop-blur-sm border',
              selectedTag === tag
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-lg'
                : 'bg-white/10 text-white/80 hover:bg-white/20 border-white/30'
            )}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}
