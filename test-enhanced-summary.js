// Test the enhanced summary extraction
const { generateEnhancedSummary } = require('./src/lib/enhanced-metadata.ts')

async function testEnhancedSummary() {
  const testUrl = process.argv[2] || 'https://fmhy.net/'
  
  console.log('🔍 Testing Enhanced Summary for:', testUrl)
  console.log('=' .repeat(60))
  
  try {
    const result = await generateEnhancedSummary(testUrl)
    
    console.log('📝 Short Summary:')
    console.log('-' .repeat(30))
    console.log(result.summary)
    console.log('\n📏 Summary Stats:')
    console.log('   Length:', result.summary.length, 'characters')
    console.log('   Words:', result.summary.split(' ').length)
    
    console.log('\n📖 Full Content Preview:')
    console.log('-' .repeat(30))
    console.log(result.fullContent.substring(0, 500) + '...')
    console.log('\n📊 Full Content Stats:')
    console.log('   Length:', result.fullContent.length, 'characters')
    
    console.log('\n✅ Test completed!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testEnhancedSummary()
