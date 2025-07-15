'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Loader2 } from 'lucide-react'

const addBookmarkSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  tags: z.string().optional()
})

type AddBookmarkFormData = z.infer<typeof addBookmarkSchema>

interface AddBookmarkFormProps {
  onBookmarkAdded: () => void
}

export function AddBookmarkForm({ onBookmarkAdded }: AddBookmarkFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AddBookmarkFormData>({
    resolver: zodResolver(addBookmarkSchema)
  })

  const onSubmit = async (data: AddBookmarkFormData) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // Parse tags from comma-separated string
      const tags = data.tags 
        ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : []

      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: data.url,
          tags
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save bookmark')
      }

      setSuccess('Bookmark saved successfully!')
      reset()
      onBookmarkAdded()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-xl shadow-xl border border-white/20 p-6 backdrop-blur-md" style={{
      background: 'rgba(255, 255, 255, 0.1)'
    }}>
      <h2 className="text-lg font-semibold text-white mb-4 drop-shadow-lg">Add New Bookmark</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-white">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-white">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="url" className="sr-only">
              URL
            </label>
            <input
              {...register('url')}
              type="url"
              placeholder="Paste any URL here..."
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-colors duration-200"
            />
            {errors.url && (
              <p className="mt-1 text-sm text-red-300">{errors.url.message}</p>
            )}
          </div>

          <div className="w-48">
            <label htmlFor="tags" className="sr-only">
              Tags
            </label>
            <input
              {...register('tags')}
              type="text"
              placeholder="Tags (comma-separated)"
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-colors duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors duration-200"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Save
              </>
            )}
          </button>
        </div>
      </form>

      <p className="mt-2 text-sm text-white/80">
        Paste any URL to automatically extract the title, favicon, and generate an AI summary.
      </p>
    </div>
  )
}
