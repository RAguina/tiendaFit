"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Currency, ExchangeRates, fetchExchangeRates, convertPrice as convertPriceUtil, formatPrice as formatPriceUtil } from '@/lib/currency'

interface CurrencyContextType {
  currency: Currency
  rates: ExchangeRates | null
  loading: boolean
  error: string | null
  setCurrency: (currency: Currency) => void
  convertPrice: (amount: number, fromCurrency: Currency) => number
  formatPrice: (amount: number, fromCurrency?: Currency) => string
  refreshRates: () => Promise<void>
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

interface CurrencyProviderProps {
  children: ReactNode
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>('ARS') // Default to ARS
  const [rates, setRates] = useState<ExchangeRates | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshRates = async () => {
    try {
      setLoading(true)
      setError(null)
      const newRates = await fetchExchangeRates()
      setRates(newRates)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener tasas de cambio')
      console.error('Error refreshing currency rates:', err)
    } finally {
      setLoading(false)
    }
  }

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-currency', newCurrency)
    }
  }

  const convertPrice = (amount: number, fromCurrency: Currency): number => {
    if (!rates) return amount
    return convertPriceUtil(amount, fromCurrency, currency, rates)
  }

  const formatPrice = (amount: number, fromCurrency: Currency = 'ARS'): string => {
    const convertedAmount = convertPrice(amount, fromCurrency)
    return formatPriceUtil(convertedAmount, currency)
  }

  // Load preferred currency from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('preferred-currency') as Currency
      if (savedCurrency && ['ARS', 'USD', 'EUR'].includes(savedCurrency)) {
        setCurrencyState(savedCurrency)
      }
    }
  }, [])

  // Fetch rates on mount and when currency changes
  useEffect(() => {
    refreshRates()
  }, [])

  // Auto-refresh rates every 5 minutes
  useEffect(() => {
    const interval = setInterval(refreshRates, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const value: CurrencyContextType = {
    currency,
    rates,
    loading,
    error,
    setCurrency,
    convertPrice,
    formatPrice,
    refreshRates
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}