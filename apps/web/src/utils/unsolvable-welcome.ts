// UNSOLVABLE WELCOME MESSAGE SYSTEM - SO ROBUST IT NEVER FAILS
// This is the most bulletproof welcome message system ever created

export interface UserData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  profileImage?: string;
  avatar?: string;
}

// UNSOLVABLE: Get user name from ANY possible source - MULTIPLE FALLBACKS
export function getUnsolvableUserName(user: UserData | null | undefined): string {
  console.log('🔧 UNSOLVABLE: Getting user name from all sources...')
  
  // 1. Try auth context user first
  if (user) {
    console.log('🔧 UNSOLVABLE: Auth context user found:', user)
    
    // Try firstName + lastName
    if (user.firstName && user.lastName) {
      const fullName = `${user.firstName} ${user.lastName}`
      console.log('🔧 UNSOLVABLE: ✅ Found full name in auth context:', fullName)
      return fullName
    }
    
    // Try firstName only
    if (user.firstName) {
      console.log('🔧 UNSOLVABLE: ✅ Found first name in auth context:', user.firstName)
      return user.firstName
    }
    
    // Try name field
    if (user.name) {
      console.log('🔧 UNSOLVABLE: ✅ Found name field in auth context:', user.name)
      return user.name
    }
    
    // Try email
    if (user.email) {
      const emailName = user.email.split('@')[0]
      const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
      console.log('🔧 UNSOLVABLE: ✅ Found email name in auth context:', capitalizedName)
      return capitalizedName
    }
  }
  
  // 2. Try localStorage userData
  if (typeof window !== 'undefined') {
    try {
      const userData = localStorage.getItem('userData')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        console.log('🔧 UNSOLVABLE: localStorage userData found:', parsedUser)
        
        // Try firstName + lastName
        if (parsedUser.firstName && parsedUser.lastName) {
          const fullName = `${parsedUser.firstName} ${parsedUser.lastName}`
          console.log('🔧 UNSOLVABLE: ✅ Found full name in localStorage:', fullName)
          return fullName
        }
        
        // Try firstName only
        if (parsedUser.firstName) {
          console.log('🔧 UNSOLVABLE: ✅ Found first name in localStorage:', parsedUser.firstName)
          return parsedUser.firstName
        }
        
        // Try name field
        if (parsedUser.name) {
          console.log('🔧 UNSOLVABLE: ✅ Found name field in localStorage:', parsedUser.name)
          return parsedUser.name
        }
        
        // Try email
        if (parsedUser.email) {
          const emailName = parsedUser.email.split('@')[0]
          const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
          console.log('🔧 UNSOLVABLE: ✅ Found email name in localStorage:', capitalizedName)
          return capitalizedName
        }
      }
    } catch (e) {
      console.log('🔧 UNSOLVABLE: Error parsing localStorage userData:', e)
    }
    
    // 3. Try localStorage userEmail
    try {
      const userEmail = localStorage.getItem('userEmail')
      if (userEmail) {
        const emailName = userEmail.split('@')[0]
        const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
        console.log('🔧 UNSOLVABLE: ✅ Found email name in localStorage userEmail:', capitalizedName)
        return capitalizedName
      }
    } catch (e) {
      console.log('🔧 UNSOLVABLE: Error getting userEmail from localStorage:', e)
    }
    
    // 4. Try localStorage customDisplayName
    try {
      const customName = localStorage.getItem('customDisplayName')
      if (customName) {
        console.log('🔧 UNSOLVABLE: ✅ Found custom display name:', customName)
        return customName
      }
    } catch (e) {
      console.log('🔧 UNSOLVABLE: Error getting customDisplayName from localStorage:', e)
    }
    
    // 5. Try localStorage userFirstName
    try {
      const userFirstName = localStorage.getItem('userFirstName')
      if (userFirstName) {
        console.log('🔧 UNSOLVABLE: ✅ Found userFirstName:', userFirstName)
        return userFirstName
      }
    } catch (e) {
      console.log('🔧 UNSOLVABLE: Error getting userFirstName from localStorage:', e)
    }
    
    // 6. Try localStorage userLastName
    try {
      const userLastName = localStorage.getItem('userLastName')
      if (userLastName) {
        console.log('🔧 UNSOLVABLE: ✅ Found userLastName:', userLastName)
        return userLastName
      }
    } catch (e) {
      console.log('🔧 UNSOLVABLE: Error getting userLastName from localStorage:', e)
    }
    
    // 7. Try localStorage userName
    try {
      const userName = localStorage.getItem('userName')
      if (userName) {
        console.log('🔧 UNSOLVABLE: ✅ Found userName:', userName)
        return userName
      }
    } catch (e) {
      console.log('🔧 UNSOLVABLE: Error getting userName from localStorage:', e)
    }
  }
  
  // 8. Final fallback - check if user is logged in
  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      console.log('🔧 UNSOLVABLE: User is logged in but no name found, using generic')
      return 'User'
    }
  }
  
  console.log('🔧 UNSOLVABLE: ❌ No name found anywhere, using Guest')
  return 'Guest'
}

// UNSOLVABLE: Get personalized welcome message - MULTIPLE FALLBACKS
export function getUnsolvableWelcomeMessage(user: UserData | null | undefined): string {
  const userName = getUnsolvableUserName(user)
  
  console.log('🔧 UNSOLVABLE: Creating welcome message for:', userName)
  
  // If we have a proper name (not just "User" or "Guest"), use it
  if (userName && userName !== 'User' && userName !== 'Guest') {
    // Check if it's a full name (has space)
    if (userName.includes(' ')) {
      const firstName = userName.split(' ')[0]
      const message = `Welcome back, ${firstName}!`
      console.log('🔧 UNSOLVABLE: ✅ Using first name for welcome:', message)
      return message
    }
    const message = `Welcome back, ${userName}!`
    console.log('🔧 UNSOLVABLE: ✅ Using full name for welcome:', message)
    return message
  }
  
  // Fallback to a more generic but still professional message
  console.log('🔧 UNSOLVABLE: Using generic welcome message')
  return `Welcome back!`
}

// UNSOLVABLE: Force set user name in localStorage - MULTIPLE STORAGE LOCATIONS
export function setUnsolvableUserName(name: string): void {
  console.log('🔧 UNSOLVABLE: Setting user name:', name)
  
  if (typeof window === 'undefined') return
  
  try {
    // Get current userData or create new
    const userData = localStorage.getItem('userData')
    let user: any = {}
    
    if (userData) {
      try {
        user = JSON.parse(userData)
      } catch (e) {
        console.log('🔧 UNSOLVABLE: Error parsing userData, creating new user object')
      }
    }
    
    // Set the name in multiple fields for maximum compatibility
    user.firstName = name.trim()
    user.lastName = name.trim()
    user.name = name.trim()
    
    // Save back to localStorage in multiple locations
    localStorage.setItem('userData', JSON.stringify(user))
    localStorage.setItem('customDisplayName', name.trim())
    localStorage.setItem('userFirstName', name.trim())
    localStorage.setItem('userLastName', name.trim())
    localStorage.setItem('userName', name.trim())
    
    console.log('🔧 UNSOLVABLE: ✅ Name set successfully in localStorage:', user)
  } catch (error) {
    console.error('🔧 UNSOLVABLE: Error setting user name:', error)
  }
}

// UNSOLVABLE: Get user initials - MULTIPLE FALLBACKS
export function getUnsolvableUserInitials(user: UserData | null | undefined): string {
  const userName = getUnsolvableUserName(user)
  
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

// UNSOLVABLE: Auto-detect and set user name from registration data - MULTIPLE SOURCES
export function autoDetectAndSetUnsolvableUserName(): string {
  console.log('🔧 UNSOLVABLE: Auto-detecting user name...')
  
  if (typeof window === 'undefined') return 'User'
  
  try {
    // Check if user is logged in
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      console.log('🔧 UNSOLVABLE: No access token, user not logged in')
      return 'Guest'
    }
    
    // Get user data from localStorage
    const userData = localStorage.getItem('userData')
    if (userData) {
      const user = JSON.parse(userData)
      console.log('🔧 UNSOLVABLE: Found user data:', user)
      
      // Try to get name from registration data
      if (user.firstName && user.lastName) {
        const fullName = `${user.firstName} ${user.lastName}`
        console.log('🔧 UNSOLVABLE: ✅ Auto-detected full name:', fullName)
        return fullName
      }
      
      if (user.firstName) {
        console.log('🔧 UNSOLVABLE: ✅ Auto-detected first name:', user.firstName)
        return user.firstName
      }
      
      if (user.name) {
        console.log('🔧 UNSOLVABLE: ✅ Auto-detected name field:', user.name)
        return user.name
      }
      
      if (user.email) {
        const emailName = user.email.split('@')[0]
        const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
        console.log('🔧 UNSOLVABLE: ✅ Auto-detected email name:', capitalizedName)
        return capitalizedName
      }
    }
    
    // Try other localStorage sources
    const customName = localStorage.getItem('customDisplayName')
    if (customName) {
      console.log('🔧 UNSOLVABLE: ✅ Auto-detected custom name:', customName)
      return customName
    }
    
    const userFirstName = localStorage.getItem('userFirstName')
    if (userFirstName) {
      console.log('🔧 UNSOLVABLE: ✅ Auto-detected userFirstName:', userFirstName)
      return userFirstName
    }
    
    const userLastName = localStorage.getItem('userLastName')
    if (userLastName) {
      console.log('🔧 UNSOLVABLE: ✅ Auto-detected userLastName:', userLastName)
      return userLastName
    }
    
    const userName = localStorage.getItem('userName')
    if (userName) {
      console.log('🔧 UNSOLVABLE: ✅ Auto-detected userName:', userName)
      return userName
    }
    
    console.log('🔧 UNSOLVABLE: ❌ No name found in auto-detection')
    return 'User'
  } catch (e) {
    console.log('🔧 UNSOLVABLE: Error in auto-detection:', e)
    return 'User'
  }
}

// UNSOLVABLE: Force refresh welcome message
export function forceRefreshUnsolvableWelcome(): void {
  console.log('🔧 UNSOLVABLE: Force refreshing welcome message...')
  
  if (typeof window !== 'undefined') {
    // Force a page reload to refresh the welcome message
    window.location.reload()
  }
}

// UNSOLVABLE: Get all possible user names for debugging
export function getAllUnsolvableUserNames(user: UserData | null | undefined): string[] {
  const names: string[] = []
  
  if (user) {
    if (user.firstName) names.push(`Auth firstName: ${user.firstName}`)
    if (user.lastName) names.push(`Auth lastName: ${user.lastName}`)
    if (user.name) names.push(`Auth name: ${user.name}`)
    if (user.email) names.push(`Auth email: ${user.email}`)
  }
  
  if (typeof window !== 'undefined') {
    try {
      const userData = localStorage.getItem('userData')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        if (parsedUser.firstName) names.push(`localStorage firstName: ${parsedUser.firstName}`)
        if (parsedUser.lastName) names.push(`localStorage lastName: ${parsedUser.lastName}`)
        if (parsedUser.name) names.push(`localStorage name: ${parsedUser.name}`)
        if (parsedUser.email) names.push(`localStorage email: ${parsedUser.email}`)
      }
      
      const customName = localStorage.getItem('customDisplayName')
      if (customName) names.push(`customDisplayName: ${customName}`)
      
      const userFirstName = localStorage.getItem('userFirstName')
      if (userFirstName) names.push(`userFirstName: ${userFirstName}`)
      
      const userLastName = localStorage.getItem('userLastName')
      if (userLastName) names.push(`userLastName: ${userLastName}`)
      
      const userName = localStorage.getItem('userName')
      if (userName) names.push(`userName: ${userName}`)
    } catch (e) {
      names.push(`Error: ${e}`)
    }
  }
  
  return names
}



