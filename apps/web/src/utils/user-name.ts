export interface UserData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  profileImage?: string;
  avatar?: string;
}

export function getUserDisplayName(user: UserData | null | undefined): string {
  if (!user) return 'User';
  
  // Try firstName + lastName first
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  
  // Try firstName only
  if (user.firstName) {
    return user.firstName;
  }
  
  // Try name field
  if (user.name) {
    return user.name;
  }
  
  // Try email-derived name
  if (user.email) {
    const emailName = user.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  }
  
  return 'User';
}

export function getUserInitials(user: UserData | null | undefined): string {
  if (!user) return 'U';
  
  // Try firstName + lastName
  if (user.firstName && user.lastName) {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }
  
  // Try firstName only
  if (user.firstName) {
    return user.firstName.charAt(0).toUpperCase();
  }
  
  // Try name field
  if (user.name) {
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return user.name.charAt(0).toUpperCase();
  }
  
  // Try email
  if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }
  
  return 'U';
}

export function getWelcomeBackMessage(user: UserData | null | undefined): string {
  const displayName = getUserDisplayName(user);
  
  // If we have a proper name (not just "User"), use it
  if (displayName && displayName !== 'User' && displayName !== 'Guest') {
    return `Welcome back, ${displayName}!`;
  }
  
  // Fallback to a more generic but still professional message
  return `Welcome back!`;
}

export function getPersonalizedWelcomeMessage(user: UserData | null | undefined): string {
  const displayName = getUserDisplayName(user);
  
  // Try to get the best possible name
  if (displayName && displayName !== 'User' && displayName !== 'Guest') {
    // Check if it's a full name (has space)
    if (displayName.includes(' ')) {
      const firstName = displayName.split(' ')[0];
      return `Welcome back, ${firstName}!`;
    }
    return `Welcome back, ${displayName}!`;
  }
  
  // Try to get name from localStorage as fallback
  if (typeof window !== 'undefined') {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.firstName) {
          return `Welcome back, ${parsedUser.firstName}!`;
        }
        if (parsedUser.name) {
          return `Welcome back, ${parsedUser.name}!`;
        }
        if (parsedUser.email) {
          const emailName = parsedUser.email.split('@')[0];
          const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
          return `Welcome back, ${capitalizedName}!`;
        }
      }
    } catch (e) {
      console.log('Error parsing userData for welcome message:', e);
    }
  }
  
  // Final fallback
  return `Welcome back!`;
}