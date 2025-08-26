'use client'

import { useTheme } from '@/contexts/theme-context'
import { useEffect, useState } from 'react'

export default function DebugTheme() {
  const { theme, isLoading } = useTheme()
  const [htmlClass, setHtmlClass] = useState('')
  const [localStorageTheme, setLocalStorageTheme] = useState('')

  useEffect(() => {
    // Check actual DOM state
    const updateDebugInfo = () => {
      setHtmlClass(document.documentElement.className)
      setLocalStorageTheme(localStorage.getItem('theme') || 'null')
    }

    updateDebugInfo()
    const interval = setInterval(updateDebugInfo, 1000)

    return () => clearInterval(interval)
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50">
      <div>Theme Context: {theme}</div>
      <div>Loading: {isLoading.toString()}</div>
      <div>HTML Class: "{htmlClass}"</div>
      <div>localStorage: {localStorageTheme}</div>
      <div>System Prefers Dark: {typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches.toString() : 'unknown'}</div>
    </div>
  )
}