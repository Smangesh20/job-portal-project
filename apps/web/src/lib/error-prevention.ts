/**
 * Error Prevention System
 * Eliminates common errors and edge cases
 */

// Safe JSON operations
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

export const safeJsonStringify = (obj: any, fallback: string = '{}'): string => {
  try {
    return JSON.stringify(obj)
  } catch {
    return fallback
  }
}

// Safe localStorage operations
export const safeLocalStorage = {
  getItem: (key: string, fallback: any = null): any => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : fallback
    } catch {
      return fallback
    }
  },
  
  setItem: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  }
}

// Safe fetch with retry
export const safeFetch = async (url: string, options: RequestInit = {}): Promise<Response | null> => {
  try {
    const response = await fetch(url, options)
    return response.ok ? response : null
  } catch {
    return null
  }
}

// Safe number operations
export const safeNumber = {
  parse: (value: any, fallback: number = 0): number => {
    const parsed = Number(value)
    return isNaN(parsed) ? fallback : parsed
  },
  
  clamp: (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max)
  }
}

// Initialize error prevention
export const initializeErrorPrevention = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error)
    })
    
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
    })
  }
}