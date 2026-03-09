import {
  translateError,
  createSuccessNotification,
  createInfoNotification,
  createWarningNotification,
  formatFieldErrors,
  isRetryableError,
  getSuggestedAction,
} from './notificationService';

describe('notificationService', () => {
  describe('translateError', () => {
    test('translates network error correctly', () => {
      const error = {
        code: 'NETWORK_ERROR',
        correlationId: 'test-123',
      };

      const notification = translateError(error);

      expect(notification.message).toBe('Unable to connect to the server. Please check your internet connection.');
      expect(notification.severity).toBe('warning');
      expect(notification.correlationId).toBe('test-123');
    });

    test('translates authentication error correctly', () => {
      const error = {
        code: 'INVALID_CREDENTIALS',
        status: 401,
      };

      const notification = translateError(error);

      expect(notification.message).toBe('Invalid email or password. Please try again.');
      expect(notification.severity).toBe('warning');
    });

    test('translates OTP invalid error correctly', () => {
      const error = {
        code: 'OTP_INVALID',
        status: 401,
      };

      const notification = translateError(error);

      expect(notification.message).toBe('Invalid OTP. Please recheck and try again.');
      expect(notification.severity).toBe('warning');
    });

    test('translates validation error with field details', () => {
      const error = {
        code: 'VALIDATION_ERROR',
        status: 400,
        details: [
          { field: 'email', message: 'Email is required', code: 'REQUIRED_FIELD' },
          { field: 'password', message: 'Password is too short', code: 'INVALID_PASSWORD' },
        ],
      };

      const notification = translateError(error);

      expect(notification.message).toBe('Please fix 2 validation errors.');
      expect(notification.severity).toBe('warning');
      expect(notification.details).toHaveLength(2);
      expect(notification.details[0].field).toBe('email');
    });

    test('translates single validation error', () => {
      const error = {
        code: 'VALIDATION_ERROR',
        status: 400,
        details: [
          { field: 'email', message: 'Email is required', code: 'REQUIRED_FIELD' },
        ],
      };

      const notification = translateError(error);

      expect(notification.message).toBe('Email is required');
    });

    test('uses error message from API when available', () => {
      const error = {
        message: 'Custom error message from API',
        status: 400,
      };

      const notification = translateError(error);

      expect(notification.message).toBe('Custom error message from API');
    });

    test('falls back to status code message', () => {
      const error = {
        status: 404,
      };

      const notification = translateError(error);

      expect(notification.message).toBe('The requested resource was not found.');
    });

    test('handles timeout errors', () => {
      const error = {
        status: 408,
      };

      const notification = translateError(error);

      expect(notification.message).toBe('Request timeout. Please try again.');
      expect(notification.severity).toBe('warning');
    });

    test('handles server errors with error severity', () => {
      const error = {
        status: 500,
      };

      const notification = translateError(error);

      expect(notification.severity).toBe('error');
    });

    test('handles unknown errors', () => {
      const error = {};

      const notification = translateError(error);

      expect(notification.message).toBe('An unexpected error occurred. Please try again.');
      expect(notification.severity).toBe('error');
    });

    test('translates file upload errors', () => {
      const error = {
        code: 'FILE_TOO_LARGE',
        status: 400,
      };

      const notification = translateError(error);

      expect(notification.message).toBe('File size exceeds the maximum allowed limit.');
    });

    test('translates database errors', () => {
      const error = {
        code: 'DUPLICATE_ENTRY',
        status: 409,
      };

      const notification = translateError(error);

      expect(notification.message).toBe('This record already exists. Please use a different value.');
    });

    test('translates application-specific errors', () => {
      const error = {
        code: 'APPLICATION_ALREADY_EXISTS',
        status: 409,
      };

      const notification = translateError(error);

      expect(notification.message).toBe('You have already applied for this job.');
    });
  });

  describe('createSuccessNotification', () => {
    test('creates success notification', () => {
      const notification = createSuccessNotification('Operation successful');

      expect(notification.message).toBe('Operation successful');
      expect(notification.severity).toBe('success');
      expect(notification.details).toBeNull();
    });
  });

  describe('createInfoNotification', () => {
    test('creates info notification', () => {
      const notification = createInfoNotification('Information message');

      expect(notification.message).toBe('Information message');
      expect(notification.severity).toBe('info');
      expect(notification.details).toBeNull();
    });
  });

  describe('createWarningNotification', () => {
    test('creates warning notification', () => {
      const notification = createWarningNotification('Warning message');

      expect(notification.message).toBe('Warning message');
      expect(notification.severity).toBe('warning');
      expect(notification.details).toBeNull();
    });
  });

  describe('formatFieldErrors', () => {
    test('formats single field error', () => {
      const details = [
        { field: 'email', message: 'Email is required' },
      ];

      const formatted = formatFieldErrors(details);

      expect(formatted).toBe('Email is required');
    });

    test('formats multiple field errors', () => {
      const details = [
        { field: 'email', message: 'Email is required' },
        { field: 'password', message: 'Password is too short' },
      ];

      const formatted = formatFieldErrors(details);

      expect(formatted).toContain('1. email: Email is required');
      expect(formatted).toContain('2. password: Password is too short');
    });

    test('returns empty string for null details', () => {
      const formatted = formatFieldErrors(null);
      expect(formatted).toBe('');
    });

    test('returns empty string for empty array', () => {
      const formatted = formatFieldErrors([]);
      expect(formatted).toBe('');
    });

    test('returns empty string for non-array input', () => {
      const formatted = formatFieldErrors('not an array');
      expect(formatted).toBe('');
    });
  });

  describe('isRetryableError', () => {
    test('returns true for retryable error', () => {
      const error = { isRetryable: true };
      expect(isRetryableError(error)).toBe(true);
    });

    test('returns false for non-retryable error', () => {
      const error = { isRetryable: false };
      expect(isRetryableError(error)).toBe(false);
    });

    test('returns false when isRetryable is undefined', () => {
      const error = {};
      expect(isRetryableError(error)).toBe(false);
    });
  });

  describe('getSuggestedAction', () => {
    test('suggests checking internet for network errors', () => {
      const error = { code: 'NETWORK_ERROR' };
      const action = getSuggestedAction(error);

      expect(action).toBe('Please check your internet connection and try again.');
    });

    test('suggests logging in for expired token', () => {
      const error = { code: 'TOKEN_EXPIRED' };
      const action = getSuggestedAction(error);

      expect(action).toBe('Please log in again to continue.');
    });

    test('suggests logging in for invalid token', () => {
      const error = { code: 'TOKEN_INVALID' };
      const action = getSuggestedAction(error);

      expect(action).toBe('Please log in again to continue.');
    });

    test('suggests contacting support for unauthorized errors', () => {
      const error = { code: 'UNAUTHORIZED' };
      const action = getSuggestedAction(error);

      expect(action).toBe('Please contact support if you believe you should have access.');
    });

    test('suggests contacting support for forbidden errors', () => {
      const error = { code: 'FORBIDDEN' };
      const action = getSuggestedAction(error);

      expect(action).toBe('Please contact support if you believe you should have access.');
    });

    test('notifies team for server errors', () => {
      const error = { status: 500 };
      const action = getSuggestedAction(error);

      expect(action).toBe('Our team has been notified. Please try again later.');
    });

    test('suggests retry for retryable errors', () => {
      const error = { isRetryable: true };
      const action = getSuggestedAction(error);

      expect(action).toBe('Please try again in a moment.');
    });

    test('suggests reviewing input for other errors', () => {
      const error = { status: 400 };
      const action = getSuggestedAction(error);

      expect(action).toBe('Please review your input and try again.');
    });
  });

  describe('Edge Cases', () => {
    test('handles error with both code and status', () => {
      const error = {
        code: 'VALIDATION_ERROR',
        status: 400,
        message: 'Custom message',
      };

      const notification = translateError(error);

      expect(notification.message).toBe('Please check your input and try again.');
    });

    test('handles error with technical message', () => {
      const error = {
        message: 'Error: Technical database error',
        status: 500,
      };

      const notification = translateError(error);

      expect(notification.message).toBe('Server error. Please try again later.');
    });

    test('preserves correlation ID through translation', () => {
      const error = {
        code: 'VALIDATION_ERROR',
        correlationId: 'abc-123',
      };

      const notification = translateError(error);

      expect(notification.correlationId).toBe('abc-123');
    });

    test('handles validation error without details array', () => {
      const error = {
        code: 'VALIDATION_ERROR',
        status: 400,
      };

      const notification = translateError(error);

      expect(notification.message).toBe('Please check your input and try again.');
      expect(notification.details).toBeNull();
    });
  });

  describe('HTTP Status Code Coverage', () => {
    const statusTests = [
      { status: 400, expected: 'Invalid request. Please check your input.' },
      { status: 401, expected: 'Please log in to continue.' },
      { status: 403, expected: 'You do not have permission to perform this action.' },
      { status: 404, expected: 'The requested resource was not found.' },
      { status: 408, expected: 'Request timeout. Please try again.' },
      { status: 409, expected: 'A conflict occurred. The resource may already exist.' },
      { status: 422, expected: 'Unable to process your request. Please check your input.' },
      { status: 429, expected: 'Too many requests. Please wait a moment and try again.' },
      { status: 500, expected: 'Server error. Please try again later.' },
      { status: 502, expected: 'Server is temporarily unavailable. Please try again later.' },
      { status: 503, expected: 'Service temporarily unavailable. Please try again later.' },
      { status: 504, expected: 'Server timeout. Please try again later.' },
    ];

    statusTests.forEach(({ status, expected }) => {
      test(`translates ${status} status code correctly`, () => {
        const error = { status };
        const notification = translateError(error);
        expect(notification.message).toBe(expected);
      });
    });
  });
});
