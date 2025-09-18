const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://askyacham_user:secure_password_2024@localhost:5432/askyacham'
});

async function setupDatabase() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT 'user_' || substr(md5(random()::text), 1, 16),
        email TEXT UNIQUE NOT NULL,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        phone TEXT,
        "profileImage" TEXT,
        role TEXT NOT NULL DEFAULT 'CANDIDATE',
        "isVerified" BOOLEAN DEFAULT FALSE,
        "isActive" BOOLEAN DEFAULT TRUE,
        "passwordHash" TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "lastLoginAt" TIMESTAMP WITH TIME ZONE
      );
    `);

    console.log('Users table created successfully');

    // Create index on email for faster lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

setupDatabase().catch(console.error);
