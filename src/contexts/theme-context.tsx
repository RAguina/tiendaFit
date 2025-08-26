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

  useEffect(() => {
    // Initialize theme on client side only
    const initializeTheme = () => {
      try {
        // Check localStorage for saved theme
        const savedTheme = localStorage.getItem('theme') as Theme
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setTheme(savedTheme)
          document.documentElement.classList.toggle('dark', savedTheme === 'dark')
        } else {
          // Check system preference
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          const systemTheme = systemPrefersDark ? 'dark' : 'light'
          setTheme(systemTheme)
          document.documentElement.classList.toggle('dark', systemTheme === 'dark')
          localStorage.setItem('theme', systemTheme)
        }
      } catch (error) {
        console.warn('Error initializing theme:', error)
        // Fallback to light theme
        setTheme('light')
        document.documentElement.classList.remove('dark')
      } finally {
        setIsLoading(false)
      }
    }

    initializeTheme()
  }, [])

  useEffect(() => {
    if (isLoading) return
    
    // Save to localStorage and update document class when theme changes
    try {
      localStorage.setItem('theme', theme)
      document.documentElement.classList.toggle('dark', theme === 'dark')
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