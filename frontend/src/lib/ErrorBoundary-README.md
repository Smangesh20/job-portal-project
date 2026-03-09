# Error Boundary and Notification System

## Overview

This module provides comprehensive error handling and user notification capabilities for the React frontend application. It includes:

1. **Error Boundary**: Catches React component errors and displays user-friendly fallback UI
2. **Notification Service**: Translates API errors into user-friendly messages
3. **Notification Context**: Centralized notification management across the application

**Validates: Requirements 4.1, 4.2**

## Components

### ErrorBoundary

A React Error Boundary component that catches errors in the component tree and displays a fallback UI.

#### Features

- Catches and logs React component errors
- Displays user-friendly error messages
- Provides error recovery options (try again, reload page)
- Generates unique error IDs for tracking
- Shows detailed error information in development mode
- Supports custom fallback UI

#### Usage

```javascript
import ErrorBoundary from './lib/ErrorBoundary';

// Basic usage
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom error messages
<ErrorBoundary
  errorTitle="Unable to load dashboard"
  errorMessage="We're having trouble loading your dashboard. Please try again."
>
  <Dashboard />
</ErrorBoundary>

// With custom fallback UI
<ErrorBoundary
  fallback={({ error, errorId, resetError }) => (
    <div>
      <h1>Custom Error UI</h1>
      <p>Error ID: {errorId}</p>
      <button onClick={resetError}>Try Again</button>
    </div>
  )}
>
  <YourComponent />
</ErrorBoundary>

// With error callback
<ErrorBoundary
  onError={(error, errorInfo, errorId) => {
    // Send error to monitoring service
    console.error('Error caught:', { error, errorInfo, errorId });
  }}
  onReset={() => {
    // Cleanup or reset state
    console.log('Error boundary reset');
  }}
>
  <YourComponent />
</ErrorBoundary>
```

#### Props

- `errorTitle` (string): Custom error title (default: "Something went wrong")
- `errorMessage` (string): Custom error message
- `fallback` (function): Custom fallback UI renderer
- `onError` (function): Callback when error is caught
- `onReset` (function): Callback when error is reset

### Notification Service

Translates API errors into user-friendly messages and provides notification utilities.

#### Features

- Translates error codes to user-friendly messages
- Maps HTTP status codes to appropriate messages
- Handles validation errors with field-level details
- Provides severity levels (error, warning, info, success)
- Includes correlation ID tracking
- Suggests user actions based on error type

#### Usage

```javascript
import { 
  translateError, 
  createSuccessNotification,
  formatFieldErrors,
  getSuggestedAction 
} from './lib/notificationService';

// Translate API error
try {
  await api.post('/api/jobs', jobData);
} catch (error) {
  const notification = translateError(error);
  console.log(notification.message); // User-friendly message
  console.log(notification.severity); // 'error', 'warning', etc.
  console.log(notification.details); // Field-level errors if available
}

// Create success notification
const successNotification = createSuccessNotification('Job posted successfully!');

// Format field errors
const fieldErrors = [
  { field: 'email', message: 'Email is required' },
  { field: 'password', message: 'Password is too short' }
];
const formattedErrors = formatFieldErrors(fieldErrors);

// Get suggested action
const action = getSuggestedAction(error);
console.log(action); // "Please check your internet connection and try again."
```

#### Error Code Mappings

The service includes mappings for:

- **Authentication errors**: INVALID_CREDENTIALS, TOKEN_EXPIRED, UNAUTHORIZED, etc.
- **Validation errors**: VALIDATION_ERROR, REQUIRED_FIELD, INVALID_EMAIL, etc.
- **File upload errors**: FILE_TOO_LARGE, INVALID_FILE_TYPE, etc.
- **Database errors**: DUPLICATE_ENTRY, RESOURCE_NOT_FOUND, etc.
- **Network errors**: NETWORK_ERROR, TIMEOUT_ERROR, SERVER_ERROR, etc.
- **Application-specific errors**: APPLICATION_ALREADY_EXISTS, JOB_NOT_FOUND, etc.

### Notification Context

Provides centralized notification management using React Context.

#### Features

- Centralized notification state management
- Integration with error translation service
- Multiple notification methods (error, success, info, warning)
- Automatic error translation from API errors
- Support for field-level validation errors

#### Usage

```javascript
import { NotificationProvider, useNotification } from './lib/NotificationContext';

// Wrap your app with NotificationProvider
function App() {
  return (
    <NotificationProvider>
      <YourApp />
    </NotificationProvider>
  );
}

// Use notifications in components
function MyComponent() {
  const { showError, showSuccess, showInfo, showWarning } = useNotification();

  const handleSubmit = async () => {
    try {
      await api.post('/api/jobs', data);
      showSuccess('Job posted successfully!');
    } catch (error) {
      showError(error); // Automatically translates API error
    }
  };

  return (
    <button onClick={handleSubmit}>Submit</button>
  );
}
```

#### API

- `showNotification(message, severity, details)`: Show custom notification
- `showError(error)`: Show error notification (auto-translates API errors)
- `showSuccess(message)`: Show success notification
- `showInfo(message)`: Show info notification
- `showWarning(message)`: Show warning notification
- `closeNotification()`: Close current notification

## Integration with Existing MessagePopup

The notification system is designed to work seamlessly with the existing `MessagePopup` component:

```javascript
import { NotificationProvider, useNotification } from './lib/NotificationContext';
import MessagePopup from './lib/MessagePopup';

function App() {
  return (
    <NotificationProvider>
      <YourApp />
      <NotificationDisplay />
    </NotificationProvider>
  );
}

function NotificationDisplay() {
  const { notification, closeNotification } = useNotification();
  
  return (
    <MessagePopup
      open={notification.open}
      setOpen={closeNotification}
      severity={notification.severity}
      message={notification.message}
    />
  );
}
```

## Error Handling Best Practices

### 1. Wrap Route Components with Error Boundaries

```javascript
<Route path="/dashboard">
  <ErrorBoundary errorTitle="Dashboard Error">
    <Dashboard />
  </ErrorBoundary>
</Route>
```

### 2. Use Notification Context for API Errors

```javascript
const { showError, showSuccess } = useNotification();

try {
  const response = await api.post('/api/jobs', data);
  showSuccess('Job created successfully!');
} catch (error) {
  showError(error); // Automatically translated
}
```

### 3. Handle Form Validation Errors

```javascript
try {
  await api.post('/api/jobs', formData);
} catch (error) {
  if (error.code === 'VALIDATION_ERROR' && error.details) {
    // Display field-level errors
    error.details.forEach(detail => {
      setFieldError(detail.field, detail.message);
    });
  }
  showError(error);
}
```

### 4. Provide User Actions for Recoverable Errors

```javascript
const { showError } = useNotification();

try {
  await api.get('/api/jobs');
} catch (error) {
  showError(error);
  
  if (error.isRetryable) {
    // Show retry button
    setShowRetry(true);
  }
}
```

## Testing

### Unit Tests

Test error boundary behavior:

```javascript
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

test('displays fallback UI when error occurs', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});
```

Test notification service:

```javascript
import { translateError } from './notificationService';

test('translates network error correctly', () => {
  const error = {
    code: 'NETWORK_ERROR',
    correlationId: 'test-123',
  };

  const notification = translateError(error);

  expect(notification.message).toBe('Unable to connect to the server. Please check your internet connection.');
  expect(notification.severity).toBe('warning');
});
```

### Integration Tests

Test complete error flow:

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { NotificationProvider } from './NotificationContext';
import api from './apiClient';

test('displays error notification on API failure', async () => {
  // Mock API failure
  jest.spyOn(api, 'post').mockRejectedValue({
    code: 'VALIDATION_ERROR',
    message: 'Invalid input',
  });

  render(
    <NotificationProvider>
      <MyComponent />
    </NotificationProvider>
  );

  // Trigger API call
  fireEvent.click(screen.getByText('Submit'));

  // Verify error notification
  await waitFor(() => {
    expect(screen.getByText(/invalid input/i)).toBeInTheDocument();
  });
});
```

## Error Monitoring

The error boundary logs errors with the following information:

- Error message and stack trace
- Component stack trace
- Unique error ID for tracking
- Timestamp
- User context (if available)

In production, integrate with error monitoring services:

```javascript
<ErrorBoundary
  onError={(error, errorInfo, errorId) => {
    // Send to monitoring service (e.g., Sentry, LogRocket)
    errorMonitoringService.captureException(error, {
      errorId,
      errorInfo,
      timestamp: new Date().toISOString(),
    });
  }}
>
  <App />
</ErrorBoundary>
```

## Correlation ID Tracking

All errors include correlation IDs for tracking across frontend and backend:

```javascript
try {
  await api.post('/api/jobs', data);
} catch (error) {
  console.log('Correlation ID:', error.correlationId);
  // Use correlation ID to trace error in backend logs
}
```

## Customization

### Adding New Error Codes

Edit `notificationService.js` to add new error code mappings:

```javascript
const ERROR_MESSAGES = {
  // ... existing codes
  YOUR_NEW_ERROR_CODE: 'Your user-friendly message',
};
```

### Custom Error Boundary Styles

Provide custom fallback UI:

```javascript
<ErrorBoundary
  fallback={({ error, errorId, resetError }) => (
    <YourCustomErrorUI
      error={error}
      errorId={errorId}
      onReset={resetError}
    />
  )}
>
  <YourComponent />
</ErrorBoundary>
```

## Requirements Validation

This implementation validates:

- **Requirement 4.1**: API errors display user-friendly messages instead of technical details
- **Requirement 4.2**: Network errors show appropriate loading states and retry options
- **Requirement 4.3**: Form validation highlights specific fields with clear error descriptions (via field-level error details)
- **Requirement 4.4**: File upload errors provide specific guidance on requirements
- **Requirement 4.5**: Authentication errors guide users to appropriate recovery actions

## Related Components

- `apiClient.js`: API client with error interceptors and retry logic
- `MessagePopup.js`: Existing notification display component
- `SetPopupContext`: Legacy notification context (can be migrated to NotificationContext)
