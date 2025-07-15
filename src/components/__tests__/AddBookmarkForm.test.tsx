import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AddBookmarkForm } from '@/components/AddBookmarkForm'

// Mock fetch
global.fetch = vi.fn()

describe('AddBookmarkForm', () => {
  const mockOnBookmarkAdded = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset fetch mock completely
    ;(global.fetch as any).mockReset()
  })

  it('renders the form correctly', () => {
    render(<AddBookmarkForm onBookmarkAdded={mockOnBookmarkAdded} />)
    
    expect(screen.getByText('Add New Bookmark')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Paste any URL here...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Tags (comma-separated)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('prevents form submission with invalid URL', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ bookmark: { id: '1' }, message: 'Success' })
    }
    ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

    render(<AddBookmarkForm onBookmarkAdded={mockOnBookmarkAdded} />)
    
    const urlInput = screen.getByPlaceholderText('Paste any URL here...')
    const submitButton = screen.getByRole('button', { name: /save/i })
    
    // Use an invalid URL that doesn't match URL pattern
    fireEvent.change(urlInput, { target: { value: 'invalid-url' } })
    fireEvent.click(submitButton)
    
    // Wait a moment and verify fetch was NOT called due to validation error
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled()
    }, { timeout: 1000 })
  })

  it('submits form with valid data', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ bookmark: { id: '1' }, message: 'Success' })
    }
    ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

    render(<AddBookmarkForm onBookmarkAdded={mockOnBookmarkAdded} />)
    
    const urlInput = screen.getByPlaceholderText('Paste any URL here...')
    const tagsInput = screen.getByPlaceholderText('Tags (comma-separated)')
    const submitButton = screen.getByRole('button', { name: /save/i })
    
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } })
    fireEvent.change(tagsInput, { target: { value: 'test, example' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: 'https://example.com',
          tags: ['test', 'example']
        })
      })
    })

    await waitFor(() => {
      expect(mockOnBookmarkAdded).toHaveBeenCalled()
      expect(screen.getByText('Bookmark saved successfully!')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ error: 'Bookmark already exists' })
    }
    ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

    render(<AddBookmarkForm onBookmarkAdded={mockOnBookmarkAdded} />)
    
    const urlInput = screen.getByPlaceholderText('Paste any URL here...')
    const submitButton = screen.getByRole('button', { name: /save/i })
    
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Bookmark already exists')).toBeInTheDocument()
    })
  })
})
