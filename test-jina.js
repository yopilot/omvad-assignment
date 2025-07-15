// Test script to verify Jina AI integration
import { generateSummary } from './src/lib/metadata.js'

async function testJinaAI() {
  console.log('Testing Jina AI integration...')
  
  try {
    const testUrl = 'https://example.com'
    const summary = await generateSummary(testUrl)
    
    console.log('Success! Summary generated:')
    console.log(summary)
    
    if (summary === 'Summary temporarily unavailable.') {
      console.log('❌ Summary failed - still getting fallback message')
    } else {
      console.log('✅ Summary generated successfully!')
    }
  } catch (error) {
    console.error('❌ Error testing Jina AI:', error)
  }
}

testJinaAI()
