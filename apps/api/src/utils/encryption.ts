import crypto from 'crypto'
import { promisify } from 'util'

// Encryption configuration
const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32 // 256 bits
const IV_LENGTH = 16 // 128 bits
const TAG_LENGTH = 16 // 128 bits
const SALT_LENGTH = 64 // 512 bits
const ITERATIONS = 100000 // PBKDF2 iterations

// Get encryption key from environment or generate one
const getEncryptionKey = (): Buffer => {
  const keyString = process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production'
  
  if (keyString === 'default-encryption-key-change-in-production') {
    console.warn('⚠️  Using default encryption key! Change ENCRYPTION_KEY in production!')
  }
  
  return crypto.scryptSync(keyString, 'salt', KEY_LENGTH)
}

// Generate random salt
const generateSalt = (): Buffer => {
  return crypto.randomBytes(SALT_LENGTH)
}

// Generate random IV
const generateIV = (): Buffer => {
  return crypto.randomBytes(IV_LENGTH)
}

// Derive key from password using PBKDF2
const deriveKey = async (password: string, salt: Buffer): Promise<Buffer> => {
  const scrypt = promisify(crypto.scrypt)
  return scrypt(password, salt, KEY_LENGTH) as Promise<Buffer>
}

// Encryption utilities
export const encryption = {
  /**
   * Encrypt data using AES-256-GCM
   */
  encrypt: (data: string, key?: Buffer): string => {
    try {
      const encryptionKey = key || getEncryptionKey()
      const iv = generateIV()
      const cipher = crypto.createCipher(ALGORITHM, encryptionKey)
      cipher.setAAD(Buffer.from('AskYaCham', 'utf8'))
      
      let encrypted = cipher.update(data, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      
      const authTag = cipher.getAuthTag()
      
      // Combine IV + authTag + encrypted data
      const combined = Buffer.concat([
        iv,
        authTag,
        Buffer.from(encrypted, 'hex')
      ])
      
      return combined.toString('base64')
    } catch (error) {
      console.error('Encryption error:', error)
      throw new Error('Failed to encrypt data')
    }
  },

  /**
   * Decrypt data using AES-256-GCM
   */
  decrypt: (encryptedData: string, key?: Buffer): string => {
    try {
      const encryptionKey = key || getEncryptionKey()
      const combined = Buffer.from(encryptedData, 'base64')
      
      // Extract IV, authTag, and encrypted data
      const iv = combined.subarray(0, IV_LENGTH)
      const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH)
      const encrypted = combined.subarray(IV_LENGTH + TAG_LENGTH)
      
      const decipher = crypto.createDecipher(ALGORITHM, encryptionKey)
      decipher.setAAD(Buffer.from('AskYaCham', 'utf8'))
      decipher.setAuthTag(authTag)
      
      let decrypted = decipher.update(encrypted, undefined, 'utf8')
      decrypted += decipher.final('utf8')
      
      return decrypted
    } catch (error) {
      console.error('Decryption error:', error)
      throw new Error('Failed to decrypt data')
    }
  },

  /**
   * Encrypt with password using PBKDF2 key derivation
   */
  encryptWithPassword: async (data: string, password: string): Promise<string> => {
    try {
      const salt = generateSalt()
      const key = await deriveKey(password, salt)
      const iv = generateIV()
      
      const cipher = crypto.createCipher(ALGORITHM, key)
      cipher.setAAD(Buffer.from('AskYaCham', 'utf8'))
      
      let encrypted = cipher.update(data, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      
      const authTag = cipher.getAuthTag()
      
      // Combine salt + IV + authTag + encrypted data
      const combined = Buffer.concat([
        salt,
        iv,
        authTag,
        Buffer.from(encrypted, 'hex')
      ])
      
      return combined.toString('base64')
    } catch (error) {
      console.error('Password encryption error:', error)
      throw new Error('Failed to encrypt data with password')
    }
  },

  /**
   * Decrypt with password using PBKDF2 key derivation
   */
  decryptWithPassword: async (encryptedData: string, password: string): Promise<string> => {
    try {
      const combined = Buffer.from(encryptedData, 'base64')
      
      // Extract components
      const salt = combined.subarray(0, SALT_LENGTH)
      const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
      const authTag = combined.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH)
      const encrypted = combined.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH)
      
      const key = await deriveKey(password, salt)
      
      const decipher = crypto.createDecipher(ALGORITHM, key)
      decipher.setAAD(Buffer.from('AskYaCham', 'utf8'))
      decipher.setAuthTag(authTag)
      
      let decrypted = decipher.update(encrypted, undefined, 'utf8')
      decrypted += decipher.final('utf8')
      
      return decrypted
    } catch (error) {
      console.error('Password decryption error:', error)
      throw new Error('Failed to decrypt data with password')
    }
  },

  /**
   * Hash data using SHA-256
   */
  hash: (data: string, salt?: string): string => {
    const saltToUse = salt || crypto.randomBytes(16).toString('hex')
    const hash = crypto.createHash('sha256')
    hash.update(data + saltToUse)
    return saltToUse + ':' + hash.digest('hex')
  },

  /**
   * Verify hash
   */
  verifyHash: (data: string, hash: string): boolean => {
    const [salt, hashValue] = hash.split(':')
    const newHash = encryption.hash(data, salt)
    return newHash === hash
  },

  /**
   * Generate secure random token
   */
  generateToken: (length: number = 32): string => {
    return crypto.randomBytes(length).toString('hex')
  },

  /**
   * Generate secure random password
   */
  generatePassword: (length: number = 16): string => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    
    return password
  },

  /**
   * Generate API key
   */
  generateApiKey: (): string => {
    const prefix = 'akc_' // Ask Ya Cham prefix
    const randomPart = crypto.randomBytes(24).toString('base64url')
    return prefix + randomPart
  },

  /**
   * Generate session token
   */
  generateSessionToken: (): string => {
    const prefix = 'sess_'
    const randomPart = crypto.randomBytes(32).toString('base64url')
    return prefix + randomPart
  },

  /**
   * Generate refresh token
   */
  generateRefreshToken: (): string => {
    const prefix = 'refresh_'
    const randomPart = crypto.randomBytes(32).toString('base64url')
    return prefix + randomPart
  },

  /**
   * Generate verification token
   */
  generateVerificationToken: (): string => {
    const prefix = 'verify_'
    const randomPart = crypto.randomBytes(24).toString('base64url')
    return prefix + randomPart
  },

  /**
   * Generate password reset token
   */
  generatePasswordResetToken: (): string => {
    const prefix = 'reset_'
    const randomPart = crypto.randomBytes(24).toString('base64url')
    return prefix + randomPart
  },

  /**
   * Generate 2FA secret
   */
  generate2FASecret: (): string => {
    return crypto.randomBytes(20).toString('base64')
  },

  /**
   * Generate TOTP code
   */
  generateTOTP: (secret: string, timeStep: number = 30): string => {
    const time = Math.floor(Date.now() / 1000 / timeStep)
    const key = Buffer.from(secret, 'base64')
    
    const hmac = crypto.createHmac('sha1', key)
    hmac.update(Buffer.from(time.toString(16).padStart(16, '0'), 'hex'))
    const digest = hmac.digest()
    
    const offset = digest[digest.length - 1] & 0xf
    const code = ((digest[offset] & 0x7f) << 24) |
                ((digest[offset + 1] & 0xff) << 16) |
                ((digest[offset + 2] & 0xff) << 8) |
                (digest[offset + 3] & 0xff)
    
    return (code % 1000000).toString().padStart(6, '0')
  },

  /**
   * Verify TOTP code
   */
  verifyTOTP: (secret: string, token: string, window: number = 1): boolean => {
    const timeStep = 30
    const time = Math.floor(Date.now() / 1000 / timeStep)
    
    for (let i = -window; i <= window; i++) {
      const expectedToken = encryption.generateTOTP(secret, timeStep)
      if (expectedToken === token) {
        return true
      }
    }
    
    return false
  },

  /**
   * Encrypt sensitive user data
   */
  encryptUserData: (data: any): string => {
    const sensitiveFields = ['ssn', 'bankAccount', 'creditCard', 'personalNotes']
    const encryptedData = { ...data }
    
    for (const field of sensitiveFields) {
      if (encryptedData[field]) {
        encryptedData[field] = encryption.encrypt(encryptedData[field])
      }
    }
    
    return JSON.stringify(encryptedData)
  },

  /**
   * Decrypt sensitive user data
   */
  decryptUserData: (encryptedData: string): any => {
    const data = JSON.parse(encryptedData)
    const sensitiveFields = ['ssn', 'bankAccount', 'creditCard', 'personalNotes']
    
    for (const field of sensitiveFields) {
      if (data[field]) {
        try {
          data[field] = encryption.decrypt(data[field])
        } catch (error) {
          console.error(`Failed to decrypt field ${field}:`, error)
        }
      }
    }
    
    return data
  },

  /**
   * Create HMAC signature
   */
  createHMAC: (data: string, secret: string, algorithm: string = 'sha256'): string => {
    return crypto.createHmac(algorithm, secret).update(data).digest('hex')
  },

  /**
   * Verify HMAC signature
   */
  verifyHMAC: (data: string, signature: string, secret: string, algorithm: string = 'sha256'): boolean => {
    const expectedSignature = encryption.createHMAC(data, secret, algorithm)
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  },

  /**
   * Encrypt file data
   */
  encryptFile: (buffer: Buffer, key?: Buffer): Buffer => {
    const encryptionKey = key || getEncryptionKey()
    const iv = generateIV()
    const cipher = crypto.createCipher(ALGORITHM, encryptionKey)
    cipher.setAAD(Buffer.from('AskYaCham', 'utf8'))
    
    const encrypted = Buffer.concat([
      cipher.update(buffer),
      cipher.final()
    ])
    
    const authTag = cipher.getAuthTag()
    
    return Buffer.concat([iv, authTag, encrypted])
  },

  /**
   * Decrypt file data
   */
  decryptFile: (encryptedBuffer: Buffer, key?: Buffer): Buffer => {
    const encryptionKey = key || getEncryptionKey()
    
    const iv = encryptedBuffer.subarray(0, IV_LENGTH)
    const authTag = encryptedBuffer.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH)
    const encrypted = encryptedBuffer.subarray(IV_LENGTH + TAG_LENGTH)
    
    const decipher = crypto.createDecipher(ALGORITHM, encryptionKey)
    decipher.setAAD(Buffer.from('AskYaCham', 'utf8'))
    decipher.setAuthTag(authTag)
    
    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ])
  }
}

// Password utilities
export const passwordUtils = {
  /**
   * Hash password with salt
   */
  hashPassword: async (password: string): Promise<string> => {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = await promisify(crypto.scrypt)(password, salt, 64) as Buffer
    return salt + ':' + hash.toString('hex')
  },

  /**
   * Verify password
   */
  verifyPassword: async (password: string, hash: string): Promise<boolean> => {
    const [salt, hashValue] = hash.split(':')
    const hashBuffer = Buffer.from(hashValue, 'hex')
    const derivedKey = await promisify(crypto.scrypt)(password, salt, 64) as Buffer
    
    return crypto.timingSafeEqual(hashBuffer, derivedKey)
  },

  /**
   * Check password strength
   */
  checkPasswordStrength: (password: string): { score: number; feedback: string[] } => {
    let score = 0
    const feedback: string[] = []
    
    // Length check
    if (password.length >= 8) score += 1
    else feedback.push('Password should be at least 8 characters long')
    
    if (password.length >= 12) score += 1
    else feedback.push('Consider using 12+ characters for better security')
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 1
    else feedback.push('Add lowercase letters')
    
    if (/[A-Z]/.test(password)) score += 1
    else feedback.push('Add uppercase letters')
    
    if (/[0-9]/.test(password)) score += 1
    else feedback.push('Add numbers')
    
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    else feedback.push('Add special characters')
    
    // Common patterns
    if (!/(.)\1{2,}/.test(password)) score += 1
    else feedback.push('Avoid repeating characters')
    
    if (!/(123|abc|qwe|password|admin)/i.test(password)) score += 1
    else feedback.push('Avoid common patterns and words')
    
    return { score, feedback }
  }
}

// Export all utilities
export { encryption, passwordUtils }
