const http = require('http');
const url = require('url');
const querystring = require('querystring');

// Simple database simulation (same as in the API)
class SimpleDatabase {
  constructor() {
    this.users = new Map();
    this.loadFromStorage();
  }

  loadFromStorage() {
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

  saveToStorage() {
    try {
      const users = Array.from(this.users.values());
      localStorage.setItem('askyacham_users', JSON.stringify(users));
      console.log(`Saved ${users.length} users to localStorage`);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  generateId() {
    return 'user_' + Math.random().toString(36).substr(2, 16);
  }

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

  async findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findUserById(id) {
    return this.users.get(id) || null;
  }

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

  async getAllUsers() {
    return Array.from(this.users.values());
  }

  async deleteUser(id) {
    const deleted = this.users.delete(id);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  clearAll() {
    this.users.clear();
    this.saveToStorage();
  }
}

const database = new SimpleDatabase();

// Simple password hashing (for demo purposes)
function hashPassword(password) {
  return 'hashed_' + password;
}

function verifyPassword(password, hash) {
  return hash === 'hashed_' + password;
}

// CORS headers
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

// Parse JSON body
function parseJSONBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const data = body ? JSON.parse(body) : {};
      callback(null, data);
    } catch (error) {
      callback(error, null);
    }
  });
}

// Send JSON response
function sendJSON(res, statusCode, data) {
  setCORSHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Health check endpoint
function handleHealth(req, res) {
  sendJSON(res, 200, {
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      environment: 'development',
      database: 'connected'
    }
  });
}

// Register endpoint
async function handleRegister(req, res) {
  parseJSONBody(req, async (err, data) => {
    if (err) {
      return sendJSON(res, 400, {
        success: false,
        error: { code: 'INVALID_JSON', message: 'Invalid JSON data' }
      });
    }

    const { email, password, firstName, lastName, role = 'CANDIDATE' } = data;

    if (!email || !password || !firstName || !lastName) {
      return sendJSON(res, 400, {
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Email, password, first name, and last name are required'
        }
      });
    }

    try {
      // Check if user already exists
      const existingUser = await database.findUserByEmail(email);
      if (existingUser) {
        return sendJSON(res, 409, {
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'User with this email already exists'
          }
        });
      }

      // Create user
      const user = await database.createUser({
        email,
        passwordHash: hashPassword(password),
        firstName,
        lastName,
        role: role.toUpperCase(),
        isVerified: false,
        isActive: true
      });

      console.log('User registered:', user.id, user.email);

      sendJSON(res, 201, {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isVerified: user.isVerified,
            isActive: user.isActive,
            createdAt: user.createdAt
          }
        },
        message: 'User registered successfully'
      });
    } catch (error) {
      console.error('Registration error:', error);
      sendJSON(res, 500, {
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: 'Failed to register user'
        }
      });
    }
  });
}

// Login endpoint
async function handleLogin(req, res) {
  parseJSONBody(req, async (err, data) => {
    if (err) {
      return sendJSON(res, 400, {
        success: false,
        error: { code: 'INVALID_JSON', message: 'Invalid JSON data' }
      });
    }

    const { email, password } = data;

    if (!email || !password) {
      return sendJSON(res, 400, {
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Email and password are required'
        }
      });
    }

    try {
      const user = await database.findUserByEmail(email);
      if (!user) {
        return sendJSON(res, 401, {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password'
          }
        });
      }

      if (!user.isActive) {
        return sendJSON(res, 403, {
          success: false,
          error: {
            code: 'ACCOUNT_DEACTIVATED',
            message: 'Account is deactivated'
          }
        });
      }

      if (!verifyPassword(password, user.passwordHash)) {
        return sendJSON(res, 401, {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password'
          }
        });
      }

      // Update last login
      await database.updateUser(user.id, { lastLoginAt: new Date().toISOString() });

      console.log('User logged in:', user.id, user.email);

      sendJSON(res, 200, {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isVerified: user.isVerified,
            isActive: user.isActive,
            lastLoginAt: new Date().toISOString()
          }
        },
        message: 'Login successful'
      });
    } catch (error) {
      console.error('Login error:', error);
      sendJSON(res, 500, {
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: 'Failed to login'
        }
      });
    }
  });
}

// Get profile endpoint
async function handleGetProfile(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathParts = parsedUrl.pathname.split('/');
  const userId = pathParts[pathParts.length - 1];

  try {
    const user = await database.findUserById(userId);
    if (!user) {
      return sendJSON(res, 404, {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    sendJSON(res, 200, {
      success: true,
      data: { user },
      message: 'User profile retrieved successfully'
    });
  } catch (error) {
    console.error('Profile retrieval error:', error);
    sendJSON(res, 500, {
      success: false,
      error: {
        code: 'PROFILE_RETRIEVAL_FAILED',
        message: 'Failed to retrieve user profile'
      }
    });
  }
}

// Update profile endpoint
async function handleUpdateProfile(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathParts = parsedUrl.pathname.split('/');
  const userId = pathParts[pathParts.length - 1];

  parseJSONBody(req, async (err, data) => {
    if (err) {
      return sendJSON(res, 400, {
        success: false,
        error: { code: 'INVALID_JSON', message: 'Invalid JSON data' }
      });
    }

    const { firstName, lastName, email } = data;

    try {
      const updateData = {};
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (email) updateData.email = email;

      const user = await database.updateUser(userId, updateData);
      if (!user) {
        return sendJSON(res, 404, {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          }
        });
      }

      console.log('User profile updated:', user.id, user.email);

      sendJSON(res, 200, {
        success: true,
        data: { user },
        message: 'User profile updated successfully'
      });
    } catch (error) {
      console.error('Profile update error:', error);
      sendJSON(res, 500, {
        success: false,
        error: {
          code: 'PROFILE_UPDATE_FAILED',
          message: 'Failed to update user profile'
        }
      });
    }
  });
}

// Get all users endpoint
async function handleGetAllUsers(req, res) {
  try {
    const users = await database.getAllUsers();
    sendJSON(res, 200, {
      success: true,
      data: { users },
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    console.error('Get users error:', error);
    sendJSON(res, 500, {
      success: false,
      error: {
        code: 'GET_USERS_FAILED',
        message: 'Failed to retrieve users'
      }
    });
  }
}

// Main server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`${method} ${path}`);

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    setCORSHeaders(res);
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    // Health check
    if (path === '/health' && method === 'GET') {
      return handleHealth(req, res);
    }

    // API routes
    if (path === '/api/auth/register' && method === 'POST') {
      return await handleRegister(req, res);
    }

    if (path === '/api/auth/login' && method === 'POST') {
      return await handleLogin(req, res);
    }

    if (path.startsWith('/api/auth/profile/') && method === 'GET') {
      return await handleGetProfile(req, res);
    }

    if (path.startsWith('/api/auth/profile/') && method === 'PUT') {
      return await handleUpdateProfile(req, res);
    }

    if (path === '/api/users' && method === 'GET') {
      return await handleGetAllUsers(req, res);
    }

    // 404 handler
    sendJSON(res, 404, {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${method} ${path} not found`
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    sendJSON(res, 500, {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An internal server error occurred'
      }
    });
  }
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

server.listen(PORT, HOST, () => {
  console.log(`🚀 Ask Ya Cham API Server started`);
  console.log(`📍 Server running at http://${HOST}:${PORT}`);
  console.log(`🔗 Health check: http://${HOST}:${PORT}/health`);
  console.log(`📊 Database: Simple in-memory with localStorage persistence`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = server;
