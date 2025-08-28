// Input sanitization utilities for XSS protection

import DOMPurify from 'dompurify'

// Server-side sanitization (for Node.js environment)
function serverSanitize(dirty: string): string {
  // Basic HTML entity encoding for server-side
  return dirty
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Client-side sanitization using DOMPurify
function clientSanitize(dirty: string): string {
  if (typeof window === 'undefined') {
    return serverSanitize(dirty)
  }
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // No HTML tags allowed for text inputs
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  })
}

// Safe HTML sanitization (for rich text content - future use)
function sanitizeHTML(dirty: string): string {
  if (typeof window === 'undefined') {
    return serverSanitize(dirty)
  }
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target'],
    ALLOWED_URI_REGEXP: /^https?:\/\//, // Only allow HTTP(S) links
  })
}

// Sanitize user input data
export function sanitizeUserInput(input: any): any {
  if (typeof input === 'string') {
    return clientSanitize(input.trim())
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {}
    
    for (const [key, value] of Object.entries(input)) {
      if (typeof value === 'string') {
        sanitized[key] = clientSanitize(value.trim())
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeUserInput(value)
      } else {
        sanitized[key] = value
      }
    }
    
    return sanitized
  }
  
  return input
}

// Validation patterns for common inputs
export const VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[\+]?[0-9\s\-\(\)]{7,20}$/,
  postalCode: /^[a-zA-Z0-9\s\-]{3,10}$/,
  name: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\.'-]{1,100}$/,
  address: /^[a-zA-Z0-9À-ÿ\u00f1\u00d1\s\.\,\'\-\#]{1,200}$/,
  city: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\.\,\'-]{1,100}$/,
  // Allow only alphanumeric characters, spaces, and common punctuation
  general: /^[a-zA-Z0-9À-ÿ\u00f1\u00d1\s\.\,\!\?\'\-]{1,500}$/
}

// Validate and sanitize specific field types
export function validateAndSanitize(value: string, type: keyof typeof VALIDATION_PATTERNS): { isValid: boolean; sanitized: string; error?: string } {
  const sanitized = clientSanitize(value)
  const pattern = VALIDATION_PATTERNS[type]
  
  if (!pattern.test(sanitized)) {
    return {
      isValid: false,
      sanitized,
      error: `Invalid ${type} format`
    }
  }
  
  return {
    isValid: true,
    sanitized
  }
}

// Escape special characters for SQL (additional protection alongside prepared statements)
export function escapeSQLString(str: string): string {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
    switch (char) {
      case '\0': return '\\0'
      case '\x08': return '\\b'
      case '\x09': return '\\t'
      case '\x1a': return '\\z'
      case '\n': return '\\n'
      case '\r': return '\\r'
      case '"':
      case "'":
      case '\\':
      case '%': return '\\' + char
      default: return char
    }
  })
}

// Remove potentially dangerous characters
export function removeSpecialChars(str: string): string {
  return str.replace(/[<>\"'%;()&+]/g, '')
}

// For rich text content (comments, reviews, etc.)
export function sanitizeRichText(html: string): string {
  return sanitizeHTML(html)
}

export default {
  sanitizeUserInput,
  validateAndSanitize,
  sanitizeRichText,
  removeSpecialChars,
  VALIDATION_PATTERNS
}