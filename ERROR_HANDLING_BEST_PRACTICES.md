# 🛡️ Error Handling Best Practices

## Overview
This document outlines comprehensive error handling best practices to prevent common errors and ensure robust application behavior.

## 🎯 Core Principles

### 1. **Fail Fast, Fail Safe**
- Detect errors as early as possible
- Provide meaningful error messages
- Implement graceful degradation
- Never expose sensitive information

### 2. **Consistent Error Structure**
- Use standardized error formats
- Include error codes and types
- Provide context and debugging information
- Log errors appropriately

### 3. **User-Friendly Error Messages**
- Avoid technical jargon
- Provide actionable guidance
- Use appropriate error levels
- Implement proper internationalization

## 🔧 Implementation Guidelines

### 1. **Error Classification**

#### Error Levels
```typescript
enum ErrorLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}
```

#### Error Types
```typescript
enum ErrorType {
  // Client Errors (4xx)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT = 'RATE_LIMIT',
  
  // Server Errors (5xx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  TIMEOUT = 'TIMEOUT'
}
```

### 2. **Error Response Format**

#### Standard Error Response
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    type: string;
    message: string;
    details?: any;
    requestId?: string;
    timestamp: string;
    path?: string;
  };
}
```

#### Example Implementation
```typescript
export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public type: string;
  public details?: any;
  public requestId?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    type: string = 'SERVER_ERROR',
    details?: any,
    requestId?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.type = type;
    this.details = details;
    this.requestId = requestId;
    this.name = this.constructor.name;
    
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): ErrorResponse {
    return {
      success: false,
      error: {
        code: this.code,
        type: this.type,
        message: this.message,
        details: this.details,
        requestId: this.requestId,
        timestamp: new Date().toISOString()
      }
    };
  }
}
```

### 3. **Error Handling Patterns**

#### Try-Catch with Proper Error Handling
```typescript
async function processUserData(userId: string): Promise<User> {
  try {
    const user = await userService.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    }
    
    const processedUser = await processUser(user);
    return processedUser;
  } catch (error) {
    if (error instanceof AppError) {
      throw error; // Re-throw known errors
    }
    
    // Log unexpected errors
    logger.error('Unexpected error in processUserData', {
      userId,
      error: error.message,
      stack: error.stack
    });
    
    throw new InternalError('Failed to process user data');
  }
}
```

#### Async Error Handling
```typescript
// Use express-async-errors for automatic error handling
import 'express-async-errors';

// Or wrap async functions manually
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage
app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);
  res.json({ success: true, data: user });
}));
```

### 4. **Validation Error Handling**

#### Input Validation
```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z.number().min(18, 'Must be at least 18 years old')
});

export function validateUserInput(data: any): UserInput {
  try {
    return userSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid input data', {
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }))
      });
    }
    throw error;
  }
}
```

### 5. **Database Error Handling**

#### Database Connection Errors
```typescript
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed', {
      error: error.message,
      stack: error.stack
    });
    
    throw new DatabaseError('Failed to connect to database', {
      originalError: error.message
    });
  }
}
```

#### Query Error Handling
```typescript
export async function findUserById(id: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    return user;
  } catch (error) {
    logger.error('Database query failed', {
      operation: 'findUserById',
      userId: id,
      error: error.message
    });
    
    if (error.code === 'P2002') {
      throw new ConflictError('User already exists');
    }
    
    throw new DatabaseError('Failed to fetch user');
  }
}
```

### 6. **External Service Error Handling**

#### API Call Error Handling
```typescript
export async function callExternalAPI(url: string, data: any): Promise<any> {
  try {
    const response = await axios.post(url, data, {
      timeout: 5000,
      retries: 3
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        throw new ExternalServiceError('External API error', {
          status: error.response.status,
          data: error.response.data,
          url
        });
      } else if (error.request) {
        // Request was made but no response received
        throw new ExternalServiceError('External API timeout', {
          url,
          timeout: 5000
        });
      }
    }
    
    throw new ExternalServiceError('External API call failed', {
      url,
      originalError: error.message
    });
  }
}
```

### 7. **Error Logging**

#### Structured Logging
```typescript
import { logger } from './logger';

export function logError(error: Error, context?: any): void {
  const logData = {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    context,
    timestamp: new Date().toISOString(),
    level: 'error'
  };
  
  logger.error('Application error occurred', logData);
}
```

#### Error Tracking
```typescript
import { ErrorTracker } from './error-tracker';

export function trackError(error: Error, context?: any): void {
  const errorTracker = ErrorTracker.getInstance();
  errorTracker.trackError(error, context);
}
```

### 8. **Error Recovery Strategies**

#### Retry Logic
```typescript
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        break;
      }
      
      logger.warn(`Operation failed, retrying in ${delay}ms`, {
        attempt,
        maxRetries,
        error: error.message
      });
      
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  
  throw lastError!;
}
```

#### Circuit Breaker Pattern
```typescript
class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private threshold: number = 5,
    private timeout: number = 60000
  ) {}
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}
```

## 🚨 Common Error Scenarios

### 1. **Validation Errors**
- **Cause**: Invalid input data
- **Prevention**: Use Zod schemas for validation
- **Handling**: Return 400 with detailed error messages

### 2. **Authentication Errors**
- **Cause**: Invalid or expired tokens
- **Prevention**: Implement proper token validation
- **Handling**: Return 401 with clear authentication requirements

### 3. **Authorization Errors**
- **Cause**: Insufficient permissions
- **Prevention**: Implement role-based access control
- **Handling**: Return 403 with permission requirements

### 4. **Database Errors**
- **Cause**: Connection issues, query failures
- **Prevention**: Implement connection pooling, query optimization
- **Handling**: Return 500 with generic error message

### 5. **External Service Errors**
- **Cause**: Third-party service failures
- **Prevention**: Implement retry logic, circuit breakers
- **Handling**: Return 502 with service unavailable message

## 📊 Error Monitoring

### 1. **Error Metrics**
- Error rate by endpoint
- Error rate by error type
- Response time for error cases
- User impact assessment

### 2. **Alerting Rules**
- Error rate > 5% for 5 minutes
- Critical errors (500s) > 10 in 1 minute
- Database connection failures
- External service timeouts

### 3. **Error Dashboards**
- Real-time error monitoring
- Error trend analysis
- Top error sources
- User impact metrics

## 🔍 Debugging Guidelines

### 1. **Error Context**
- Include request ID in all errors
- Log relevant user context
- Include operation parameters
- Track error propagation

### 2. **Error Investigation**
- Check error logs first
- Verify error reproduction
- Analyze error patterns
- Test error scenarios

### 3. **Error Resolution**
- Fix root cause, not symptoms
- Implement proper error handling
- Add monitoring and alerting
- Update documentation

## 🎯 Best Practices Summary

### ✅ Do's
- Use structured error handling
- Implement proper logging
- Provide meaningful error messages
- Handle errors at appropriate levels
- Implement retry logic for transient errors
- Use circuit breakers for external services
- Monitor error rates and patterns
- Test error scenarios

### ❌ Don'ts
- Don't ignore errors
- Don't expose sensitive information
- Don't use generic error messages
- Don't catch errors without handling them
- Don't log errors without context
- Don't retry non-retryable errors
- Don't fail silently
- Don't use console.log for errors

## 🚀 Implementation Checklist

- [ ] Define error types and codes
- [ ] Implement error classes
- [ ] Set up error logging
- [ ] Configure error monitoring
- [ ] Implement validation error handling
- [ ] Add database error handling
- [ ] Handle external service errors
- [ ] Implement retry logic
- [ ] Add circuit breakers
- [ ] Set up error alerting
- [ ] Create error dashboards
- [ ] Test error scenarios
- [ ] Document error handling procedures

## 📚 Resources

- [Error Handling in Node.js](https://nodejs.org/api/errors.html)
- [Express Error Handling](https://expressjs.com/en/guide/error-handling.html)
- [Zod Validation](https://zod.dev/)
- [Winston Logging](https://github.com/winstonjs/winston)
- [Sentry Error Tracking](https://sentry.io/)

---

*This document provides comprehensive guidelines for implementing robust error handling in the Ask Ya Cham platform. Regular updates and reviews ensure continued effectiveness.*
