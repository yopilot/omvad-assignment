import { parse } from 'node-html-parser'

export interface PageMetadata {
  title: string
  favicon: string
  description?: string
}

export async function fetchPageMetadata(url: string): Promise<PageMetadata> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }
    
    const html = await response.text()
    const root = parse(html)
    
    // Extract title
    let title = root.querySelector('title')?.innerText || 
                root.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
                root.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ||
                'Untitled'
    
    title = title.trim()
    
    // Extract description
    const description = root.querySelector('meta[name="description"]')?.getAttribute('content') ||
                       root.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                       root.querySelector('meta[name="twitter:description"]')?.getAttribute('content')
    
    // Extract favicon
    const domain = new URL(url).origin
    let favicon = root.querySelector('link[rel="icon"]')?.getAttribute('href') ||
                  root.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ||
                  root.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href') ||
                  '/favicon.ico'
    
    // Make favicon URL absolute
    if (favicon.startsWith('//')) {
      favicon = `https:${favicon}`
    } else if (favicon.startsWith('/')) {
      favicon = `${domain}${favicon}`
    } else if (!favicon.startsWith('http')) {
      favicon = `${domain}/${favicon}`
    }
    
    return {
      title,
      favicon,
      description
    }
  } catch (error) {
    console.error('Error fetching metadata:', error)
    const domain = new URL(url).hostname
    return {
      title: domain,
      favicon: `${new URL(url).origin}/favicon.ico`
    }
  }
}

export async function generateSummary(url: string): Promise<string> {
  try {
    console.log('[generateSummary] Attempting to summarize URL:', url)
    
    // Ensure URL has protocol
    let normalizedUrl = url
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      normalizedUrl = `https://${url}`
    }
    
    console.log('[generateSummary] Normalized URL:', normalizedUrl)
    
    // Use the correct Jina AI Reader format with URL encoding
    const encodedUrl = encodeURIComponent(normalizedUrl)
    const jinaUrl = `https://r.jina.ai/${encodedUrl}`
    console.log('[generateSummary] Jina AI URL:', jinaUrl)
    
    const response = await fetch(jinaUrl, {
      headers: {
        'Accept': 'text/plain',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    console.log('[generateSummary] Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details')
      console.error('[generateSummary] API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      })
      throw new Error(`Jina AI API failed: ${response.status} ${response.statusText}`)
    }
    
    const fullContent = await response.text()
    console.log('[generateSummary] Raw content length:', fullContent.length)
    
    // Use enhanced summary extraction
    const shortSummary = extractSmartSummary(fullContent)
    
    console.log('[generateSummary] Enhanced summary length:', shortSummary.length)
    console.log('[generateSummary] Enhanced summary preview:', shortSummary.substring(0, 100) + '...')
    
    return shortSummary.length > 20 ? shortSummary : 'Summary temporarily unavailable.'
      
  } catch (error) {
    console.error('[generateSummary] Error generating summary:', {
      url,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    return 'Summary temporarily unavailable.'
  }
}

function extractSmartSummary(fullContent: string): string {
  // Strategy 1: Look for description or intro paragraphs first
  const descriptionPattern = /(?:Description|About|Overview|Summary):\s*([^\n]+(?:\n[^\n]+)*?)(?:\n\n|$)/i
  const descriptionMatch = fullContent.match(descriptionPattern)
  
  if (descriptionMatch && descriptionMatch[1] && descriptionMatch[1].trim().length > 50) {
    return cleanSummaryText(descriptionMatch[1])
  }
  
  // Strategy 2: Extract first meaningful paragraph after title
  const lines = fullContent.split('\n')
  let meaningfulContent = []
  let foundTitle = false
  let skipMetadata = true
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // Skip metadata lines
    if (skipMetadata && (
      trimmedLine.startsWith('Title:') || 
      trimmedLine.startsWith('URL Source:') || 
      trimmedLine.startsWith('Published Time:') ||
      trimmedLine.startsWith('Warning:') ||
      trimmedLine.startsWith('Markdown Content:') ||
      trimmedLine === ''
    )) {
      if (trimmedLine.startsWith('Title:')) foundTitle = true
      continue
    }
    
    skipMetadata = false
    
    // Skip navigation, headers, and UI elements
    if (
      trimmedLine.startsWith('Skip to content') ||
      trimmedLine.startsWith('Toggle navigation') ||
      trimmedLine.startsWith('Search') ||
      trimmedLine.match(/^[=\-]+$/) || // Header underlines
      trimmedLine.match(/^#{1,6}\s/) || // Markdown headers
      trimmedLine.match(/^\[.*\]\(.*\)$/) || // Standalone links
      trimmedLine.match(/^!\[.*\]\(.*\)$/) || // Images
      trimmedLine.length < 20 || // Too short to be meaningful
      trimmedLine.split(' ').length < 4 // Less than 4 words
    ) {
      continue
    }
    
    meaningfulContent.push(trimmedLine)
    
    // Stop after we have enough content for a good summary
    const joinedContent = meaningfulContent.join(' ')
    if (joinedContent.length > 200) {
      break
    }
  }
  
  // Strategy 3: If we still don't have good content, extract first few sentences
  if (meaningfulContent.length === 0) {
    const contentMatch = fullContent.match(/Markdown Content:\s*([\s\S]*?)(?:\n\n|\n---|\nURL Source:|$)/)
    if (contentMatch && contentMatch[1]) {
      const sentences = contentMatch[1].split(/[.!?]+/).filter(s => s.trim().length > 30)
      meaningfulContent = sentences.slice(0, 2)
    }
  }
  
  const summary = meaningfulContent.join(' ').trim()
  return cleanSummaryText(summary)
}

function cleanSummaryText(text: string): string {
  return text
    // Remove markdown formatting
    .replace(/\*\*/g, '') // Bold
    .replace(/\*/g, '') // Italic
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Links to text
    .replace(/#{1,6}\s*/g, '') // Headers
    .replace(/`([^`]+)`/g, '$1') // Inline code
    
    // Clean up whitespace and special characters
    .replace(/\n{2,}/g, ' ') // Multiple newlines
    .replace(/\s{2,}/g, ' ') // Multiple spaces
    .replace(/[\r\n]/g, ' ') // Line breaks
    
    // Remove common UI elements
    .replace(/Skip to content/gi, '')
    .replace(/Toggle navigation/gi, '')
    .replace(/Search [A-Z]/gi, '')
    .replace(/Navigation Menu/gi, '')
    .replace(/Main Navigation/gi, '')
    
    // Remove image placeholders
    .replace(/!Image \d+:?\s*/g, '')
    .replace(/\[Image \d+[^\]]*\]/g, '')
    
    // Remove multiple consecutive punctuation
    .replace(/[.]{2,}/g, '.')
    .replace(/[-]{3,}/g, '')
    .replace(/[=]{3,}/g, '')
    
    // Trim and limit length
    .trim()
    .slice(0, 200) // Keep it short and sweet
    .replace(/\s+$/, '') // Remove trailing whitespace
    + (text.length > 200 ? '...' : '')
}
