// Simple in-memory database for account persistence
class SimpleDatabase {
  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.loadFromStorage();
  }

  // Load data from localStorage if available (browser environment)
  loadFromStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const storedUsers = localStorage.getItem('askyacham_users');
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          users.forEach(user => {
            this.users.set(user.id, user);
          });
          console.log(`Loaded ${users.length} users from localStorage`);
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
    }
  }

  // Save data to localStorage if available (browser environment)
  saveToStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const users = Array.from(this.users.values());
        localStorage.setItem('askyacham_users', JSON.stringify(users));
        console.log(`Saved ${users.length} users to localStorage`);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }

  // Generate unique ID
  generateId() {
    return 'user_' + Math.random().toString(36).substr(2, 16);
  }

  // Create user
  async createUser(userData) {
    const id = this.generateId();
    const user = {
      id,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: null
    };
    
    this.users.set(id, user);
    this.saveToStorage();
    
    return user;
  }

  // Find user by email
  async findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  // Find user by ID
  async findUserById(id) {
    return this.users.get(id) || null;
  }

  // Update user
  async updateUser(id, updateData) {
    const user = this.users.get(id);
    if (!user) {
      return null;
    }

    const updatedUser = {
      ...user,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    this.users.set(id, updatedUser);
    this.saveToStorage();
    
    return updatedUser;
  }

  // Get all users
  async getAllUsers() {
    return Array.from(this.users.values());
  }

  // Delete user
  async deleteUser(id) {
    const deleted = this.users.delete(id);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  // Create session
  async createSession(userId, sessionData) {
    const sessionId = 'session_' + Math.random().toString(36).substr(2, 16);
    const session = {
      id: sessionId,
      userId,
      ...sessionData,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };
    
    this.sessions.set(sessionId, session);
    return session;
  }

  // Find session
  async findSession(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  // Delete session
  async deleteSession(sessionId) {
    return this.sessions.delete(sessionId);
  }

  // Clean expired sessions
  async cleanExpiredSessions() {
    const now = new Date();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (new Date(session.expiresAt) < now) {
        this.sessions.delete(sessionId);
      }
    }
  }
}

// Create singleton instance
const database = new SimpleDatabase();

module.exports = database;
