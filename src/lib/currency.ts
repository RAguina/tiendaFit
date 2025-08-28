// Currency conversion system with real-time rates

export type Currency = 'ARS' | 'USD' | 'EUR'

export interface ExchangeRates {
  base: string
  rates: {
    [key in Currency]: number
  }
  last_updated: string
}

// Cache for exchange rates (5 minutes TTL)
let ratesCache: { data: ExchangeRates | null; timestamp: number } = {
  data: null,
  timestamp: 0
}

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds
const API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest'

export async function fetchExchangeRates(baseCurrency: Currency = 'USD'): Promise<ExchangeRates> {
  const now = Date.now()
  
  // Return cached data if still valid
  if (ratesCache.data && now - ratesCache.timestamp < CACHE_TTL) {
    return ratesCache.data
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${baseCurrency}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    const rates: ExchangeRates = {
      base: data.base,
      rates: {
        ARS: data.rates.ARS || 1,
        USD: data.rates.USD || 1,
        EUR: data.rates.EUR || 1
      },
      last_updated: data.date || new Date().toISOString()
    }
    
    // Update cache
    ratesCache = {
      data: rates,
      timestamp: now
    }
    
    return rates
  } catch (error) {
    console.error('Error fetching exchange rates:', error)
    
    // Return fallback rates if API fails
    return getFallbackRates()
  }
}

function getFallbackRates(): ExchangeRates {
  // Fallback rates (approximate values, should be updated periodically)
  return {
    base: 'USD',
    rates: {
      USD: 1,
      ARS: 800, // Approximate USD to ARS rate
      EUR: 0.85 // Approximate USD to EUR rate
    },
    last_updated: new Date().toISOString()
  }
}

export function convertPrice(amount: number, fromCurrency: Currency, toCurrency: Currency, rates: ExchangeRates): number {
  if (fromCurrency === toCurrency) {
    return amount
  }
  
  // Convert to base currency (USD) first, then to target currency
  const baseAmount = fromCurrency === rates.base ? amount : amount / rates.rates[fromCurrency]
  const convertedAmount = toCurrency === rates.base ? baseAmount : baseAmount * rates.rates[toCurrency]
  
  return convertedAmount
}

export function formatPrice(amount: number, currency: Currency): string {
  const formatters: { [key in Currency]: Intl.NumberFormat } = {
    ARS: new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }),
    USD: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }),
    EUR: new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }
  
  return formatters[currency].format(amount)
}

export function getCurrencySymbol(currency: Currency): string {
  const symbols: { [key in Currency]: string } = {
    ARS: '$',
    USD: '$',
    EUR: '€'
  }
  
  return symbols[currency]
}

export function getCurrencyName(currency: Currency): string {
  const names: { [key in Currency]: string } = {
    ARS: 'Peso Argentino',
    USD: 'Dólar Estadounidense',
    EUR: 'Euro'
  }
  
  return names[currency]
}

// Client-side hook for easier usage in React components
export function useCurrencyRates() {
  return {
    fetchExchangeRates,
    convertPrice,
    formatPrice,
    getCurrencySymbol,
    getCurrencyName
  }
}