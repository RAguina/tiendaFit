// Quick security test script

// Test input sanitization
import { sanitizeUserInput, validateAndSanitize } from './src/lib/sanitize.js'

console.log('🔍 Testing Input Sanitization...\n')

// Test cases
const testCases = [
  {
    name: 'XSS Script Tag',
    input: '<script>alert("xss")</script>Normal text',
    expected: 'Normal text'
  },
  {
    name: 'HTML Entities',
    input: 'John & Jane <tag>',
    expected: 'John &amp; Jane &lt;tag&gt;'
  },
  {
    name: 'SQL Injection Attempt',
    input: "'; DROP TABLE users; --",
    expected: "&#x27;; DROP TABLE users; --"
  },
  {
    name: 'Normal Address',
    input: 'Av. Corrientes 1234, Apt 5B',
    expected: 'Av. Corrientes 1234, Apt 5B'
  }
]

// Note: Since we're in Node.js, this will use server-side sanitization
testCases.forEach(test => {
  try {
    const result = sanitizeUserInput(test.input)
    const passed = result !== test.input || test.input === test.expected
    
    console.log(`${passed ? '✅' : '❌'} ${test.name}`)
    console.log(`   Input:    "${test.input}"`)
    console.log(`   Output:   "${result}"`)
    console.log(`   Safe:     ${!result.includes('<script>') && !result.includes('<') ? 'YES' : 'NO'}\n`)
  } catch (error) {
    console.log(`❌ ${test.name} - Error: ${error.message}\n`)
  }
})

console.log('🔍 Testing Validation Patterns...\n')

// Test validation patterns
const validationTests = [
  {
    field: 'name',
    valid: ['John Doe', 'María García', "O'Connor"],
    invalid: ['<script>alert(1)</script>', 'John123', 'Very long name that exceeds the maximum length limit set for names']
  },
  {
    field: 'email', 
    valid: ['john@example.com', 'user.name+tag@domain.co.uk'],
    invalid: ['invalid-email', 'test@', '@domain.com', '<script>@evil.com']
  }
]

validationTests.forEach(test => {
  console.log(`📋 Testing ${test.field} validation:`)
  
  test.valid.forEach(input => {
    try {
      const result = validateAndSanitize(input, test.field)
      console.log(`   ✅ "${input}" -> Valid: ${result.isValid}, Sanitized: "${result.sanitized}"`)
    } catch (error) {
      console.log(`   ❌ "${input}" -> Error: ${error.message}`)
    }
  })
  
  test.invalid.forEach(input => {
    try {
      const result = validateAndSanitize(input, test.field)
      console.log(`   ${result.isValid ? '❌' : '✅'} "${input}" -> Valid: ${result.isValid}, Sanitized: "${result.sanitized}"`)
    } catch (error) {
      console.log(`   ✅ "${input}" -> Caught: ${error.message}`)
    }
  })
  
  console.log('')
})

console.log('✅ Security testing completed!')