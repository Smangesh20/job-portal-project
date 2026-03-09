# Database Connection Manager

## Overview

The Connection Manager provides robust database connection handling with automatic retry logic, connection pooling, and health monitoring for MongoDB connections.

## Features

- **Automatic Retry with Exponential Backoff**: Automatically retries failed connections with increasing delays
- **Connection Pooling**: Configures optimal connection pool settings for performance
- **Health Monitoring**: Periodic health checks to ensure database availability
- **Graceful Reconnection**: Automatically reconnects on connection loss
- **Comprehensive Logging**: Detailed logging of connection events and errors

## Usage

### Basic Connection

```javascript
const connectionManager = require('./db/connectionManager');

// Connect to database
await connectionManager.connect();

// Or with custom URI
await connectionManager.connect('mongodb://localhost:27017/mydb');
```

### With Custom Options

```javascript
await connectionManager.connect('mongodb://localhost:27017/mydb', {
  maxPoolSize: 20,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 10000
});
```

### Health Check

```javascript
const health = await connectionManager.healthCheck();
console.log('Database health:', health);
// {
//   connected: true,
//   readyState: 1,
//   readyStateText: 'connected',
//   host: 'localhost',
//   port: 27017,
//   name: 'mydb',
//   timestamp: '2024-01-15T10:30:00.000Z'
// }
```

### Get Connection Status

```javascript
const status = connectionManager.getStatus();
console.log('Connection status:', status);
// {
//   connected: true,
//   readyState: 1,
//   readyStateText: 'connected',
//   retryCount: 0,
//   maxRetries: 5,
//   host: 'localhost',
//   port: 27017,
//   name: 'mydb'
// }
```

### Graceful Shutdown

```javascript
// Disconnect when shutting down
await connectionManager.disconnect();
```

## Configuration

### Retry Settings

- **maxRetries**: Maximum number of connection attempts (default: 5)
- **baseRetryDelay**: Initial retry delay in milliseconds (default: 1000ms)
- **maxRetryDelay**: Maximum retry delay in milliseconds (default: 30000ms)

### Connection Pool Settings

- **maxPoolSize**: Maximum connections in pool (default: 10)
- **minPoolSize**: Minimum connections to maintain (default: 2)

### Timeout Settings

- **serverSelectionTimeoutMS**: Server selection timeout (default: 5000ms)
- **socketTimeoutMS**: Socket operation timeout (default: 45000ms)
- **connectTimeoutMS**: Initial connection timeout (default: 10000ms)

### Health Check

- **heartbeatFrequencyMS**: Server health check frequency (default: 10000ms)
- Health checks run every 30 seconds automatically

## Exponential Backoff

The connection manager uses exponential backoff with jitter for retry delays:

```
Attempt 1: ~1 second
Attempt 2: ~2 seconds
Attempt 3: ~4 seconds
Attempt 4: ~8 seconds
Attempt 5: ~16 seconds
```

Jitter (random factor) is added to prevent thundering herd problems.

## Connection Events

The manager listens to and logs the following Mongoose connection events:

- **connected**: Initial connection established
- **disconnected**: Connection lost
- **reconnected**: Connection re-established after loss
- **error**: Connection error occurred
- **close**: Connection closed

## Integration with Server

### server.js Example

```javascript
const express = require('express');
const connectionManager = require('./db/connectionManager');

const app = express();

// Connect to database before starting server
async function startServer() {
  try {
    // Connect with retry logic
    await connectionManager.connect();
    
    // Start Express server
    const port = process.env.PORT || 4444;
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await connectionManager.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await connectionManager.disconnect();
  process.exit(0);
});

startServer();
```

## Health Check Endpoint

```javascript
// Add health check endpoint to your routes
app.get('/health/database', async (req, res) => {
  const health = await connectionManager.healthCheck();
  
  if (health.connected) {
    res.status(200).json(health);
  } else {
    res.status(503).json(health);
  }
});
```

## Error Handling

The connection manager integrates with the database error translator:

```javascript
const { translateDatabaseError } = require('./middleware/databaseErrorTranslator');

try {
  await connectionManager.connect();
} catch (error) {
  const translatedError = translateDatabaseError(error);
  console.error('Connection failed:', translatedError.message);
}
```

## Logging

All connection events are logged with appropriate levels:

- **info**: Successful connections, reconnections, status changes
- **warn**: Disconnections, retry attempts
- **error**: Connection failures, health check failures
- **debug**: Detailed health check results, pool stats

## Best Practices

1. **Single Instance**: Use the exported singleton instance throughout your application
2. **Graceful Shutdown**: Always disconnect on process termination
3. **Health Monitoring**: Expose health check endpoint for monitoring systems
4. **Error Handling**: Always handle connection errors appropriately
5. **Configuration**: Adjust pool and timeout settings based on your workload

## Troubleshooting

### Connection Keeps Failing

- Check MongoDB server is running and accessible
- Verify connection URI is correct
- Check network connectivity and firewall rules
- Review logs for specific error messages

### Slow Connections

- Increase `serverSelectionTimeoutMS` for slow networks
- Adjust `connectTimeoutMS` if initial connection is slow
- Check MongoDB server performance

### Pool Exhaustion

- Increase `maxPoolSize` if you have high concurrency
- Check for connection leaks in your application
- Monitor pool stats through health checks

## Requirements Validation

This implementation validates:

- **Requirement 5.1**: Connection retry with exponential backoff ✓
- **Requirement 5.4**: Database timeout handling ✓
- Connection pooling configuration ✓
- Health check monitoring ✓
- Graceful reconnection ✓
