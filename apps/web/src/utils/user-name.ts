/**
 * Utility functions for extracting and formatting user names
 * This ensures consistent name display across the application
 */

export interface UserData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  profileImage?: string;
  avatar?: string;
}

/**
 * Extracts and formats a user's display name from various data sources
 * Priority: firstName + lastName > firstName > name > email-derived name
 */
export function getUserDisplayName(userData?: UserData | null): string {
  if (!userData) {
    return 'User';
  }

  // Try firstName + lastName combination first
  if (userData.firstName && userData.lastName) {
    return `${userData.firstName} ${userData.lastName}`.trim();
  }

  // Try firstName only
  if (userData.firstName) {
    return userData.firstName.trim();
  }

  // Try name field
  if (userData.name) {
    return userData.name.trim();
  }

  // Try to derive name from email
  if (userData.email) {
    const emailName = userData.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  }

  // Fallback
  return 'User';
}

/**
 * Extracts user's first name only
 */
export function getUserFirstName(userData?: UserData | null): string {
  if (!userData) {
    return 'User';
  }

  if (userData.firstName) {
    return userData.firstName.trim();
  }

  if (userData.name) {
    return userData.name.split(' ')[0].trim();
  }

  if (userData.email) {
    const emailName = userData.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  }

  return 'User';
}

/**
 * Gets user initials for avatar display
 */
export function getUserInitials(userData?: UserData | null): string {
  if (!userData) {
    return 'U';
  }

  if (userData.firstName && userData.lastName) {
    return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();
  }

  if (userData.firstName) {
    return userData.firstName.charAt(0).toUpperCase();
  }

  if (userData.name) {
    const names = userData.name.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return names[0].charAt(0).toUpperCase();
  }

  if (userData.email) {
    return userData.email.charAt(0).toUpperCase();
  }

  return 'U';
}

/**
 * Creates a personalized welcome message
 */
export function getWelcomeMessage(userData?: UserData | null, timeOfDay?: 'morning' | 'afternoon' | 'evening'): string {
  const name = getUserDisplayName(userData);
  
  if (!timeOfDay) {
    const hour = new Date().getHours();
    if (hour < 12) timeOfDay = 'morning';
    else if (hour < 17) timeOfDay = 'afternoon';
    else timeOfDay = 'evening';
  }

  const greetings = {
    morning: 'Good morning',
    afternoon: 'Good afternoon', 
    evening: 'Good evening'
  };

  return `${greetings[timeOfDay]}, ${name}!`;
}

/**
 * Gets a simple welcome back message
 */
export function getWelcomeBackMessage(userData?: UserData | null): string {
  const name = getUserDisplayName(userData);
  return `Welcome back, ${name}!`;
}
