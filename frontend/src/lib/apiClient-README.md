# API Client with Error Interceptors

## Overview

Centralized API client for the job portal frontend with built-in error handling, automatic retry logic, and correlation ID tracking.

**Validates: Requirements 4.1, 8.1**

## Features

### 1. Automatic Retry Logic with Exponential Backoff
- Automatically retries failed requests up to 3 times
- Uses exponential backoff (1s, 2s, 4s)
- Only retries transient errors (network issues, 5xx errors, 408, 429)
- Configurable retry behavior

### 2. Request/Response Correlation ID Tracking
- Generates unique correlation ID for each request
- Tracks requests across frontend and backend
- Includes correlation ID in all error responses
- Useful for debugging and log correlation

### 3. Standardized Error Handling
- Consistent error format across all API calls
- User-friendly error messages
- Preserves original error for debugging
- Indicates if error is retryable

### 4. Token Management
- Automatically includes JWT token from localStorage
- Adds Authorization header to all requests
- Supports token refresh flows

## Usage

### Basic Usage

```javascript
import api from '../lib/apiClient';

// GET request
api.get('/api/jobs')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error.message);
    console.log('Correlation ID:', error.correlationId);
  });

// POST request
api.post('/auth/login', { email, password })
  .then(response => {
    console.log('Login successful:', response.data);
  })
  .catch(error => {
    console.error('Login failed:', error.message);
  });
```

### Replacing Axios Calls

**Before:**
```javascript
import axios from 'axios';
import apiList from '../lib/apiList';

axios.post(apiList.login, loginDetails)
  .then(response => {
    // Handle success
  })
  .catch(err => {
    // Handle error
    console.log(err.response.data.message);
  });
```

**After:**
```javascript
import api from '../lib/apiClient';
import apiList from '../lib/apiList';

api.post(apiList.login, loginDetails)
  .then(response => {
    // Handle success
  })
  .catch(error => {
    // Handle error - standardized format
    console.log(error.message);
    console.log('Correlation ID:', error.correlationId);
  });
```

### Error Handling

The API client provides a standardized error format:

```javascript
{
  correlationId: 'uuid-v4-string',
  timestamp: '2024-01-15T10:30:00Z',
  isRetryable: true,
  status: 500,
  statusText: 'Internal Server Error',
  code: 'DATABASE_ERROR',
  message: 'Unable to process your request',
  details: [
    {
      field: 'email',
      message: 'Email is required',
      code: 'REQUIRED_FIELD'
    }
  ],
  originalError: Error // Original axios error
}
```

### Configuration

You can customize retry behavior and other settings:

```javascript
// Disable retry for specific request
api.post('/api/jobs', jobData, {
  retryCount: 3 // Set to 3 to skip retries
});

// Custom timeout
api.get('/api/jobs', {
  timeout: 5000 // 5 seconds
});
```

## Error Types

### Network Errors (status: 0)
- No response from server
- Connection timeout
- DNS resolution failure
- Automatically retried

### Client Errors (4xx)
- 400: Validation errors
- 401: Authentication required
- 403: Insufficient permissions
- 404: Resource not found
- Not retried

### Server Errors (5xx)
- 500: Internal server error
- 502: Bad gateway
- 503: Service unavailable
- 504: Gateway timeout
- Automatically retried

### Rate Limiting (429)
- Too many requests
- Automatically retried with backoff

## Integration with Backend

The API client works seamlessly with the backend error handling middleware:

1. **Correlation IDs**: Frontend generates correlation ID, backend includes it in response
2. **Error Format**: Backend returns standardized error format that client understands
3. **Retry Logic**: Client retries transient errors, backend handles idempotency

## Testing

The API client includes comprehensive tests:

- Unit tests for error formatting
- Unit tests for retry logic
- Property-based tests for error recovery
- Integration tests with mock server

## Migration Guide

To migrate existing components to use the new API client:

1. Replace `import axios from 'axios'` with `import api from '../lib/apiClient'`
2. Replace `axios.get/post/put/delete` with `api.get/post/put/delete`
3. Update error handling to use standardized error format
4. Remove manual retry logic (now handled automatically)
5. Use correlation IDs for debugging

## Examples

### Login Component

```javascript
import api from '../lib/apiClient';
import apiList from '../lib/apiList';

const handleLogin = async () => {
  try {
    const response = await api.post(apiList.login, loginDetails);
    localStorage.setItem('token', response.data.token);
    setPopup({
      open: true,
      severity: 'success',
      message: 'Logged in successfully',
    });
  } catch (error) {
    setPopup({
      open: true,
      severity: 'error',
      message: error.message,
    });
    console.error('Login error:', {
      correlationId: error.correlationId,
      code: error.code,
      details: error.details,
    });
  }
};
```

### Job Creation Component

```javascript
import api from '../lib/apiClient';
import apiList from '../lib/apiList';

const handleCreateJob = async (jobData) => {
  try {
    const response = await api.post(apiList.jobs, jobData);
    setPopup({
      open: true,
      severity: 'success',
      message: 'Job created successfully',
    });
  } catch (error) {
    // Handle validation errors
    if (error.details && error.details.length > 0) {
      error.details.forEach(detail => {
        setFieldError(detail.field, detail.message);
      });
    } else {
      setPopup({
        open: true,
        severity: 'error',
        message: error.message,
      });
    }
  }
};
```

## Best Practices

1. **Always use try-catch or .catch()**: Handle errors gracefully
2. **Log correlation IDs**: Include in error reports for debugging
3. **Show user-friendly messages**: Use error.message for user feedback
4. **Handle field-level errors**: Check error.details for validation errors
5. **Don't retry manually**: Let the client handle retries automatically
6. **Preserve user input**: Save form data before API calls
7. **Show loading states**: Indicate when requests are in progress

## Troubleshooting

### Request not retrying
- Check if error is retryable (network or 5xx errors)
- Verify retry count hasn't been exceeded
- Check console for retry logs

### Correlation ID not appearing
- Ensure backend includes X-Correlation-ID header in response
- Check browser network tab for header

### Token not included
- Verify token is stored in localStorage
- Check token key is 'token'
- Ensure token is valid

## Future Enhancements

- Request cancellation support
- Request deduplication
- Offline queue for failed requests
- Request/response caching
- Progress tracking for uploads
- WebSocket support
