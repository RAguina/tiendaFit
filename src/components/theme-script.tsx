'use client'

import { useEffect } from 'react'

export default function ThemeScript() {
  useEffect(() => {
    // Apply theme immediately when component mounts
    const applyInitialTheme = () => {
      try {
        // Check if localStorage is available
        if (typeof Storage === 'undefined') {
          // Fallback to system preference
          applySystemTheme()
          return
        }

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
        // Fallback to system theme if localStorage fails
        applySystemTheme()
      }
    }

    const applySystemTheme = () => {
      try {
        const root = document.documentElement
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark')
          root.style.colorScheme = 'dark'
        } else {
          root.classList.remove('dark')
          root.style.colorScheme = 'light'
        }
      } catch (error) {
        // Ultimate fallback to light theme
        document.documentElement.classList.remove('dark')
        document.documentElement.style.colorScheme = 'light'
      }
    }

    applyInitialTheme()
  }, [])

  return null
}