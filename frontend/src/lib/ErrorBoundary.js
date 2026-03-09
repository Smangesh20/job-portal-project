import React from 'react';
import { Box, Typography, Button, Paper } from '@material-ui/core';
import { Error as ErrorIcon } from '@material-ui/icons';

/**
 * React Error Boundary Component
 * 
 * Catches React component errors and displays user-friendly fallback UI
 * Logs errors for debugging and monitoring
 * 
 * Validates: Requirements 4.1, 4.2
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      isResetting: false,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error Boundary caught an error:', {
      error: error.toString(),
      errorInfo: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
    });

    // Store error details in state
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo, this.state.errorId);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      isResetting: true,
    });

    // Call optional reset callback if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  componentDidUpdate(prevProps, prevState) {
    // Render a short blank frame after reset so parent can rerender with safe children.
    if (this.state.isResetting && !prevState.isResetting) {
      this.setState({ isResetting: false });
    }
  }

  render() {
    if (this.state.isResetting) {
      return null;
    }

    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          errorId: this.state.errorId,
          resetError: this.handleReset,
        });
      }

      // Default fallback UI
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
          padding={3}
        >
          <Paper
            elevation={3}
            style={{
              padding: '32px',
              maxWidth: '600px',
              textAlign: 'center',
            }}
          >
            <ErrorIcon
              style={{
                fontSize: '64px',
                color: '#f44336',
                marginBottom: '16px',
              }}
            />
            <Typography variant="h5" gutterBottom>
              {this.props.errorTitle || 'Something went wrong'}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              {this.props.errorMessage ||
                'We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.'}
            </Typography>
            {this.state.errorId && (
              <Typography
                variant="caption"
                color="textSecondary"
                display="block"
                gutterBottom
              >
                Error ID: {this.state.errorId}
              </Typography>
            )}
            <Box marginTop={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleReset}
                style={{ marginRight: '8px' }}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </Box>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                marginTop={3}
                padding={2}
                bgcolor="#f5f5f5"
                borderRadius={4}
                textAlign="left"
              >
                <Typography variant="subtitle2" gutterBottom>
                  Error Details (Development Only):
                </Typography>
                <Typography
                  variant="body2"
                  component="pre"
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontSize: '12px',
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
