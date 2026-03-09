#!/usr/bin/env node

/**
 * Setup script for logging infrastructure
 * Creates necessary directories and sets up log rotation
 */

const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '..', 'logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('Created logs directory:', logsDir);
} else {
  console.log('Logs directory already exists:', logsDir);
}

// Create .gitkeep file to ensure logs directory is tracked
const gitkeepPath = path.join(logsDir, '.gitkeep');
if (!fs.existsSync(gitkeepPath)) {
  fs.writeFileSync(gitkeepPath, '');
  console.log('Created .gitkeep file in logs directory');
}

console.log('Logging setup complete!');