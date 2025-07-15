// Test Jina AI API response for any website
// Usage: node test-jina-response.js [URL]
// Example: node test-jina-response.js https://github.com

async function testJinaResponse(url) {
  try {
    console.log('🔍 Testing Jina AI response for:', url)
    console.log('=' .repeat(60))
    
    // Ensure URL has protocol
    let normalizedUrl = url
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      normalizedUrl = `https://${url}`
      console.log('🔧 Normalized URL:', normalizedUrl)
    }
    
    // Encode URL and create Jina API endpoint
    const encodedUrl = encodeURIComponent(normalizedUrl)
    const jinaUrl = `https://r.jina.ai/${encodedUrl}`
    
    console.log('📡 Jina API URL:', jinaUrl)
    console.log('⏳ Fetching content...')
    
    const startTime = Date.now()
    const response = await fetch(jinaUrl, {
      headers: {
        'Accept': 'text/plain',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    const fetchTime = Date.now() - startTime
    
    console.log(`⚡ Response received in ${fetchTime}ms`)
    console.log('📊 Response Status:', response.status, response.statusText)
    console.log('📋 Response Headers:')
    for (const [key, value] of response.headers.entries()) {
      console.log(`   ${key}: ${value}`)
    }
    
    console.log('\n' + '=' .repeat(60))
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details')
      console.error('❌ API Error Details:')
      console.error('   Status:', response.status)
      console.error('   Status Text:', response.statusText)
      console.error('   Error Response:', errorText)
      return
    }
    
    const fullContent = await response.text()
    console.log('📄 Raw Content Length:', fullContent.length, 'characters')
    console.log('\n📝 Full Raw Response:')
    console.log('-' .repeat(40))
    console.log(fullContent)
    console.log('-' .repeat(40))
    
    // Parse and extract meaningful content using enhanced logic
    console.log('\n🧹 Enhanced Processing:')
    console.log('-' .repeat(40))
    
    const enhancedSummary = extractSmartSummary(fullContent)
    
    console.log('📝 Enhanced Summary:')
    console.log(enhancedSummary)
    console.log('\n📏 Enhanced Summary Stats:')
    console.log('   Length:', enhancedSummary.length, 'characters')
    console.log('   Words:', enhancedSummary.split(' ').length)
    
    console.log('\n💾 Enhanced Summary (as stored in app):')
    console.log('-' .repeat(40))
    console.log(enhancedSummary)
    console.log('-' .repeat(40))
    console.log('✅ Test completed successfully!')
    
  } catch (error) {
    console.error('❌ Error testing Jina API:', error)
    if (error.code === 'ENOTFOUND') {
      console.error('💡 This might be a network connectivity issue.')
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Connection was refused. Check your internet connection.')
    }
  }
}

function extractSmartSummary(fullContent) {
  // Strategy 1: Look for description or intro paragraphs first
  const descriptionPattern = /(?:Description|About|Overview|Summary):\s*([^\n]+(?:\n[^\n]+)*?)(?:\n\n|$)/i
  const descriptionMatch = fullContent.match(descriptionPattern)
  
  if (descriptionMatch && descriptionMatch[1] && descriptionMatch[1].trim().length > 50) {
    return cleanSummaryText(descriptionMatch[1])
  }
  
  // Strategy 2: Extract first meaningful paragraph after title
  const lines = fullContent.split('\n')
  let meaningfulContent = []
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

function cleanSummaryText(text) {
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

// Get URL from command line arguments or use default
const testUrl = process.argv[2] || 'https://fmhy.net/'

console.log('🚀 Jina AI Response Tester')
console.log('📅 Date:', new Date().toLocaleString())

testJinaResponse(testUrl)
