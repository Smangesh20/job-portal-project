// BULLETPROOF WELCOME MESSAGE SYSTEM - ALWAYS SHOWS USER NAME

export interface UserData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  profileImage?: string;
  avatar?: string;
}

// BULLETPROOF: Get user name from ANY possible source
export function getBulletproofUserName(user: UserData | null | undefined): string {
  console.log('🔧 BULLETPROOF: Getting user name from all sources...')
  
  // 1. Try auth context user first
  if (user) {
    console.log('🔧 BULLETPROOF: Auth context user found:', user)
    
    // Try firstName + lastName
    if (user.firstName && user.lastName) {
      const fullName = `${user.firstName} ${user.lastName}`
      console.log('🔧 BULLETPROOF: ✅ Found full name in auth context:', fullName)
      return fullName
    }
    
    // Try firstName only
    if (user.firstName) {
      console.log('🔧 BULLETPROOF: ✅ Found first name in auth context:', user.firstName)
      return user.firstName
    }
    
    // Try name field
    if (user.name) {
      console.log('🔧 BULLETPROOF: ✅ Found name field in auth context:', user.name)
      return user.name
    }
    
    // Try email
    if (user.email) {
      const emailName = user.email.split('@')[0]
      const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
      console.log('🔧 BULLETPROOF: ✅ Found email name in auth context:', capitalizedName)
      return capitalizedName
    }
  }
  
  // 2. Try localStorage userData
  if (typeof window !== 'undefined') {
    try {
      const userData = localStorage.getItem('userData')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        console.log('🔧 BULLETPROOF: localStorage userData found:', parsedUser)
        
        // Try firstName + lastName
        if (parsedUser.firstName && parsedUser.lastName) {
          const fullName = `${parsedUser.firstName} ${parsedUser.lastName}`
          console.log('🔧 BULLETPROOF: ✅ Found full name in localStorage:', fullName)
          return fullName
        }
        
        // Try firstName only
        if (parsedUser.firstName) {
          console.log('🔧 BULLETPROOF: ✅ Found first name in localStorage:', parsedUser.firstName)
          return parsedUser.firstName
        }
        
        // Try name field
        if (parsedUser.name) {
          console.log('🔧 BULLETPROOF: ✅ Found name field in localStorage:', parsedUser.name)
          return parsedUser.name
        }
        
        // Try email
        if (parsedUser.email) {
          const emailName = parsedUser.email.split('@')[0]
          const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
          console.log('🔧 BULLETPROOF: ✅ Found email name in localStorage:', capitalizedName)
          return capitalizedName
        }
      }
    } catch (e) {
      console.log('🔧 BULLETPROOF: Error parsing localStorage userData:', e)
    }
    
    // 3. Try localStorage userEmail
    try {
      const userEmail = localStorage.getItem('userEmail')
      if (userEmail) {
        const emailName = userEmail.split('@')[0]
        const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
        console.log('🔧 BULLETPROOF: ✅ Found email name in localStorage userEmail:', capitalizedName)
        return capitalizedName
      }
    } catch (e) {
      console.log('🔧 BULLETPROOF: Error getting userEmail from localStorage:', e)
    }
    
    // 4. Try localStorage customDisplayName
    try {
      const customName = localStorage.getItem('customDisplayName')
      if (customName) {
        console.log('🔧 BULLETPROOF: ✅ Found custom display name:', customName)
        return customName
      }
    } catch (e) {
      console.log('🔧 BULLETPROOF: Error getting customDisplayName from localStorage:', e)
    }
  }
  
  // 5. Final fallback - check if user is logged in
  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      console.log('🔧 BULLETPROOF: User is logged in but no name found, using generic')
      return 'User'
    }
  }
  
  console.log('🔧 BULLETPROOF: ❌ No name found anywhere, using Guest')
  return 'Guest'
}

// BULLETPROOF: Get personalized welcome message
export function getBulletproofWelcomeMessage(user: UserData | null | undefined): string {
  const userName = getBulletproofUserName(user)
  
  console.log('🔧 BULLETPROOF: Creating welcome message for:', userName)
  
  // If we have a proper name (not just "User" or "Guest"), use it
  if (userName && userName !== 'User' && userName !== 'Guest') {
    // Check if it's a full name (has space)
    if (userName.includes(' ')) {
      const firstName = userName.split(' ')[0]
      const message = `Welcome back, ${firstName}!`
      console.log('🔧 BULLETPROOF: ✅ Using first name for welcome:', message)
      return message
    }
    const message = `Welcome back, ${userName}!`
    console.log('🔧 BULLETPROOF: ✅ Using full name for welcome:', message)
    return message
  }
  
  // Fallback to a more generic but still professional message
  console.log('🔧 BULLETPROOF: Using generic welcome message')
  return `Welcome back!`
}

// BULLETPROOF: Force set user name in localStorage
export function setBulletproofUserName(name: string): void {
  console.log('🔧 BULLETPROOF: Setting user name:', name)
  
  if (typeof window === 'undefined') return
  
  try {
    // Get current userData or create new
    const userData = localStorage.getItem('userData')
    let user: any = {}
    
    if (userData) {
      try {
        user = JSON.parse(userData)
      } catch (e) {
        console.log('🔧 BULLETPROOF: Error parsing userData, creating new user object')
      }
    }
    
    // Set the name in multiple fields for maximum compatibility
    user.firstName = name.trim()
    user.lastName = name.trim()
    user.name = name.trim()
    
    // Save back to localStorage
    localStorage.setItem('userData', JSON.stringify(user))
    localStorage.setItem('customDisplayName', name.trim())
    
    console.log('🔧 BULLETPROOF: ✅ Name set successfully in localStorage:', user)
  } catch (error) {
    console.error('🔧 BULLETPROOF: Error setting user name:', error)
  }
}

// BULLETPROOF: Get user initials
export function getBulletproofUserInitials(user: UserData | null | undefined): string {
  const userName = getBulletproofUserName(user)
  
  if (!userName || userName === 'User' || userName === 'Guest') {
    return 'U'
  }
  
  // Try to get initials from full name
  if (userName.includes(' ')) {
    const names = userName.split(' ')
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase()
    }
  }
  
  // Single name
  return userName.charAt(0).toUpperCase()
}




















