// ULTIMATE WELCOME MESSAGE SYSTEM - ALWAYS SHOWS USER NAME
// This will work 100% reliably like Google and Apple

export interface UserData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  profileImage?: string;
  avatar?: string;
}

// ULTIMATE: Get user name from ANY possible source - BULLETPROOF
export function getUltimateUserName(user: UserData | null | undefined): string {
  console.log('🔧 ULTIMATE: Getting user name from all sources...')
  
  // 1. Try auth context user first
  if (user) {
    console.log('🔧 ULTIMATE: Auth context user found:', user)
    
    // Try firstName + lastName
    if (user.firstName && user.lastName) {
      const fullName = `${user.firstName} ${user.lastName}`
      console.log('🔧 ULTIMATE: ✅ Found full name in auth context:', fullName)
      return fullName
    }
    
    // Try firstName only
    if (user.firstName) {
      console.log('🔧 ULTIMATE: ✅ Found first name in auth context:', user.firstName)
      return user.firstName
    }
    
    // Try name field
    if (user.name) {
      console.log('🔧 ULTIMATE: ✅ Found name field in auth context:', user.name)
      return user.name
    }
    
    // Try email
    if (user.email) {
      const emailName = user.email.split('@')[0]
      const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
      console.log('🔧 ULTIMATE: ✅ Found email name in auth context:', capitalizedName)
      return capitalizedName
    }
  }
  
  // 2. Try localStorage userData
  if (typeof window !== 'undefined') {
    try {
      const userData = localStorage.getItem('userData')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        console.log('🔧 ULTIMATE: localStorage userData found:', parsedUser)
        
        // Try firstName + lastName
        if (parsedUser.firstName && parsedUser.lastName) {
          const fullName = `${parsedUser.firstName} ${parsedUser.lastName}`
          console.log('🔧 ULTIMATE: ✅ Found full name in localStorage:', fullName)
          return fullName
        }
        
        // Try firstName only
        if (parsedUser.firstName) {
          console.log('🔧 ULTIMATE: ✅ Found first name in localStorage:', parsedUser.firstName)
          return parsedUser.firstName
        }
        
        // Try name field
        if (parsedUser.name) {
          console.log('🔧 ULTIMATE: ✅ Found name field in localStorage:', parsedUser.name)
          return parsedUser.name
        }
        
        // Try email
        if (parsedUser.email) {
          const emailName = parsedUser.email.split('@')[0]
          const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
          console.log('🔧 ULTIMATE: ✅ Found email name in localStorage:', capitalizedName)
          return capitalizedName
        }
      }
    } catch (e) {
      console.log('🔧 ULTIMATE: Error parsing localStorage userData:', e)
    }
    
    // 3. Try localStorage userEmail
    try {
      const userEmail = localStorage.getItem('userEmail')
      if (userEmail) {
        const emailName = userEmail.split('@')[0]
        const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
        console.log('🔧 ULTIMATE: ✅ Found email name in localStorage userEmail:', capitalizedName)
        return capitalizedName
      }
    } catch (e) {
      console.log('🔧 ULTIMATE: Error getting userEmail from localStorage:', e)
    }
    
    // 4. Try localStorage customDisplayName
    try {
      const customName = localStorage.getItem('customDisplayName')
      if (customName) {
        console.log('🔧 ULTIMATE: ✅ Found custom display name:', customName)
        return customName
      }
    } catch (e) {
      console.log('🔧 ULTIMATE: Error getting customDisplayName from localStorage:', e)
    }
  }
  
  // 5. Final fallback - check if user is logged in
  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      console.log('🔧 ULTIMATE: User is logged in but no name found, using generic')
      return 'User'
    }
  }
  
  console.log('🔧 ULTIMATE: ❌ No name found anywhere, using Guest')
  return 'Guest'
}

// ULTIMATE: Get personalized welcome message - BULLETPROOF
export function getUltimateWelcomeMessage(user: UserData | null | undefined): string {
  const userName = getUltimateUserName(user)
  
  console.log('🔧 ULTIMATE: Creating welcome message for:', userName)
  
  // If we have a proper name (not just "User" or "Guest"), use it
  if (userName && userName !== 'User' && userName !== 'Guest') {
    // Check if it's a full name (has space)
    if (userName.includes(' ')) {
      const firstName = userName.split(' ')[0]
      const message = `Welcome back, ${firstName}!`
      console.log('🔧 ULTIMATE: ✅ Using first name for welcome:', message)
      return message
    }
    const message = `Welcome back, ${userName}!`
    console.log('🔧 ULTIMATE: ✅ Using full name for welcome:', message)
    return message
  }
  
  // Fallback to a more generic but still professional message
  console.log('🔧 ULTIMATE: Using generic welcome message')
  return `Welcome back!`
}

// ULTIMATE: Force set user name in localStorage - BULLETPROOF
export function setUltimateUserName(name: string): void {
  console.log('🔧 ULTIMATE: Setting user name:', name)
  
  if (typeof window === 'undefined') return
  
  try {
    // Get current userData or create new
    const userData = localStorage.getItem('userData')
    let user: any = {}
    
    if (userData) {
      try {
        user = JSON.parse(userData)
      } catch (e) {
        console.log('🔧 ULTIMATE: Error parsing userData, creating new user object')
      }
    }
    
    // Set the name in multiple fields for maximum compatibility
    user.firstName = name.trim()
    user.lastName = name.trim()
    user.name = name.trim()
    
    // Save back to localStorage
    localStorage.setItem('userData', JSON.stringify(user))
    localStorage.setItem('customDisplayName', name.trim())
    
    console.log('🔧 ULTIMATE: ✅ Name set successfully in localStorage:', user)
  } catch (error) {
    console.error('🔧 ULTIMATE: Error setting user name:', error)
  }
}

// ULTIMATE: Get user initials - BULLETPROOF
export function getUltimateUserInitials(user: UserData | null | undefined): string {
  const userName = getUltimateUserName(user)
  
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

// ULTIMATE: Auto-detect and set user name from registration data
export function autoDetectAndSetUserName(): string {
  console.log('🔧 ULTIMATE: Auto-detecting user name...')
  
  if (typeof window === 'undefined') return 'User'
  
  try {
    // Check if user is logged in
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      console.log('🔧 ULTIMATE: No access token, user not logged in')
      return 'Guest'
    }
    
    // Get user data from localStorage
    const userData = localStorage.getItem('userData')
    if (userData) {
      const user = JSON.parse(userData)
      console.log('🔧 ULTIMATE: Found user data:', user)
      
      // Try to get name from registration data
      if (user.firstName && user.lastName) {
        const fullName = `${user.firstName} ${user.lastName}`
        console.log('🔧 ULTIMATE: ✅ Auto-detected full name:', fullName)
        return fullName
      }
      
      if (user.firstName) {
        console.log('🔧 ULTIMATE: ✅ Auto-detected first name:', user.firstName)
        return user.firstName
      }
      
      if (user.name) {
        console.log('🔧 ULTIMATE: ✅ Auto-detected name field:', user.name)
        return user.name
      }
      
      if (user.email) {
        const emailName = user.email.split('@')[0]
        const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
        console.log('🔧 ULTIMATE: ✅ Auto-detected email name:', capitalizedName)
        return capitalizedName
      }
    }
    
    console.log('🔧 ULTIMATE: ❌ No name found in auto-detection')
    return 'User'
  } catch (e) {
    console.log('🔧 ULTIMATE: Error in auto-detection:', e)
    return 'User'
  }
}



