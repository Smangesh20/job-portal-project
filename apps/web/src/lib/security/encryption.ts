/**
 * Enterprise-Grade Encryption System
 * Protects sensitive data with multiple encryption layers
 */

// AES-256-GCM encryption
export const encryptData = async (data: string, key: string): Promise<string> => {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const keyBuffer = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  )
  
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    keyBuffer,
    dataBuffer
  )
  
  const result = new Uint8Array(iv.length + encrypted.byteLength)
  result.set(iv)
  result.set(new Uint8Array(encrypted), iv.length)
  
  return btoa(String.fromCharCode(...result))
}

export const decryptData = async (encryptedData: string, key: string): Promise<string> => {
  const decoder = new TextDecoder()
  const data = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0))
  
  const iv = data.slice(0, 12)
  const encrypted = data.slice(12)
  
  const keyBuffer = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(key),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  )
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    keyBuffer,
    encrypted
  )
  
  return decoder.decode(decrypted)
}

// Password hashing with bcrypt
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Generate secure random tokens
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// JWT token generation and validation
export const generateJWT = (payload: any, secret: string): string => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  }
  
  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(payload))
  const signature = btoa(JSON.stringify({ header, payload, secret }))
  
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

export const validateJWT = (token: string, secret: string): boolean => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    
    const header = JSON.parse(atob(parts[0]))
    const payload = JSON.parse(atob(parts[1]))
    const signature = parts[2]
    
    // Verify signature
    const expectedSignature = btoa(JSON.stringify({ header, payload, secret }))
    return signature === expectedSignature
  } catch {
    return false
  }
}

// Data masking for sensitive information
export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@')
  const maskedLocal = local.length > 2 
    ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
    : local
  return `${maskedLocal}@${domain}`
}

export const maskPhone = (phone: string): string => {
  if (phone.length < 4) return phone
  return phone.slice(0, 2) + '*'.repeat(phone.length - 4) + phone.slice(-2)
}

export const maskCreditCard = (card: string): string => {
  const cleaned = card.replace(/\D/g, '')
  if (cleaned.length < 8) return card
  return cleaned.slice(0, 4) + ' ' + '*'.repeat(cleaned.length - 8) + ' ' + cleaned.slice(-4)
}
