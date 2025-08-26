'use client'

import { useEffect } from 'react'

export default function ThemeScript() {
  useEffect(() => {
    // Apply theme immediately when component mounts
    const applyInitialTheme = () => {
      try {
        const theme = localStorage.getItem('theme')
        const root = document.documentElement
        
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          root.classList.add('dark')
          root.style.colorScheme = 'dark'
        } else {
          root.classList.remove('dark')
          root.style.colorScheme = 'light'
        }
      } catch (error) {
        // Fallback to light theme
        document.documentElement.classList.remove('dark')
        document.documentElement.style.colorScheme = 'light'
      }
    }

    applyInitialTheme()
  }, [])

  return null
}