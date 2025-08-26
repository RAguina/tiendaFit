'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isLoading: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [isLoading, setIsLoading] = useState(true)

  const applyTheme = (themeToApply: Theme) => {
    if (typeof window === 'undefined') return
    
    const root = document.documentElement
    if (themeToApply === 'dark') {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
    }
  }

  useEffect(() => {
    // Initialize theme on client side only
    const initializeTheme = async () => {
      try {
        // Check localStorage for saved theme
        const savedTheme = localStorage.getItem('theme') as Theme
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setTheme(savedTheme)
          applyTheme(savedTheme)
        } else {
          // Check system preference
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          const systemTheme = systemPrefersDark ? 'dark' : 'light'
          setTheme(systemTheme)
          applyTheme(systemTheme)
          localStorage.setItem('theme', systemTheme)
        }
      } catch (error) {
        console.warn('Error initializing theme:', error)
        // Fallback to light theme
        setTheme('light')
        applyTheme('light')
      }
      
      // Set loading to false after a small delay to ensure everything is applied
      setTimeout(() => {
        setIsLoading(false)
      }, 100)
    }

    initializeTheme()
  }, [])

  useEffect(() => {
    if (isLoading) return
    
    // Save to localStorage and update document class when theme changes
    try {
      localStorage.setItem('theme', theme)
      applyTheme(theme)
    } catch (error) {
      console.warn('Error saving theme:', error)
    }
  }, [theme, isLoading])

  const toggleTheme = () => {
    if (isLoading) return
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  const handleSetTheme = (newTheme: Theme) => {
    if (isLoading) return
    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}