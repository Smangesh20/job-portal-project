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
  return `Welcome back, ${displayName}!`;
}