// Test the fixed Jina AI API call
async function testJinaAPI() {
  try {
    const testUrl = 'https://example.com'
    console.log('Testing URL:', testUrl)
    
    // Use the correct format as per documentation
    const encodedUrl = encodeURIComponent(testUrl)
    const jinaUrl = `https://r.jina.ai/${encodedUrl}`
    console.log('Jina AI URL:', jinaUrl)
    
    const response = await fetch(jinaUrl, {
      headers: {
        'Accept': 'text/plain',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details')
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      })
      return
    }
    
    const content = await response.text()
    console.log('Content length:', content.length)
    console.log('Content preview:', content.substring(0, 500))
    
  } catch (error) {
    console.error('Error:', error)
  }
}

testJinaAPI()
