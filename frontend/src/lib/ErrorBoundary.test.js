import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from './ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow = true, message = 'Test error' }) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div>No error</div>;
};

// Suppress console.error for cleaner test output
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  console.error.mockRestore();
});

describe('ErrorBoundary', () => {
  describe('Error Catching', () => {
    test('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    test('displays fallback UI when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    test('displays custom error title when provided', () => {
      render(
        <ErrorBoundary errorTitle="Custom Error Title">
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
    });

    test('displays custom error message when provided', () => {
      const customMessage = 'This is a custom error message';
      render(
        <ErrorBoundary errorMessage={customMessage}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    test('generates and displays error ID', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Error ID:/)).toBeInTheDocument();
    });
  });

  describe('Error Recovery', () => {
    test('provides try again button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    test('provides reload page button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Reload Page')).toBeInTheDocument();
    });

    test('resets error state when try again is clicked', () => {
      const { rerender } = render(
        <ErrorBoundary key="error">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

      // Click try again
      fireEvent.click(screen.getByText('Try Again'));

      // Re-render with no error
      rerender(
        <ErrorBoundary key="safe">
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
    });
  });

  describe('Callbacks', () => {
    test('calls onError callback when error occurs', () => {
      const onError = jest.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError message="Test error message" />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalled();
      const [error, errorInfo, errorId] = onError.mock.calls[0];
      expect(error.message).toBe('Test error message');
      expect(errorInfo).toBeDefined();
      expect(errorId).toMatch(/^error-/);
    });

    test('calls onReset callback when reset is triggered', () => {
      const onReset = jest.fn();

      render(
        <ErrorBoundary onReset={onReset}>
          <ThrowError />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByText('Try Again'));

      expect(onReset).toHaveBeenCalled();
    });
  });

  describe('Custom Fallback', () => {
    test('renders custom fallback UI when provided', () => {
      const customFallback = ({ error, errorId, resetError }) => (
        <div>
          <h1>Custom Fallback</h1>
          <p>Error: {error.message}</p>
          <p>ID: {errorId}</p>
          <button onClick={resetError}>Custom Reset</button>
        </div>
      );

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError message="Custom error" />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom Fallback')).toBeInTheDocument();
      expect(screen.getByText(/Error: Custom error/)).toBeInTheDocument();
      expect(screen.getByText(/ID: error-/)).toBeInTheDocument();
      expect(screen.getByText('Custom Reset')).toBeInTheDocument();
    });

    test('custom fallback reset button works', () => {
      const customFallback = ({ resetError }) => (
        <button onClick={resetError}>Custom Reset</button>
      );

      const { rerender } = render(
        <ErrorBoundary fallback={customFallback} key="custom-error">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByText('Custom Reset'));

      rerender(
        <ErrorBoundary fallback={customFallback} key="custom-safe">
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
    });
  });

  describe('Development Mode', () => {
    test('shows error details in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ThrowError message="Detailed error" />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Error Details \(Development Only\):/)).toBeInTheDocument();
      expect(screen.getByText(/Detailed error/)).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Error Logging', () => {
    test('logs error to console', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error');

      render(
        <ErrorBoundary>
          <ThrowError message="Logged error" />
        </ErrorBoundary>
      );

      expect(consoleErrorSpy).toHaveBeenCalled();
      const logCall = consoleErrorSpy.mock.calls.find(call => 
        call[0] === 'Error Boundary caught an error:'
      );
      expect(logCall).toBeDefined();
      expect(logCall[1]).toHaveProperty('errorId');
      expect(logCall[1]).toHaveProperty('timestamp');
    });
  });

  describe('Edge Cases', () => {
    test('handles multiple errors in sequence', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError message="First error" />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

      // Reset
      fireEvent.click(screen.getByText('Try Again'));

      // Throw another error
      rerender(
        <ErrorBoundary>
          <ThrowError message="Second error" />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    test('handles errors with no message', () => {
      const ThrowEmptyError = () => {
        throw new Error();
      };

      render(
        <ErrorBoundary>
          <ThrowEmptyError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    test('handles non-Error objects thrown', () => {
      const ThrowString = () => {
        throw 'String error';
      };

      render(
        <ErrorBoundary>
          <ThrowString />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
