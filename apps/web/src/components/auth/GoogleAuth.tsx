'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface GoogleAuthProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
}

interface AuthState {
  email: string;
  otp: string;
  step: 'email' | 'otp' | 'loading' | 'success';
  error: string;
  message: string;
  countdown: number;
}

export const GoogleAuth: React.FC<GoogleAuthProps> = ({ onSuccess, onError }) => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    email: '',
    otp: '',
    step: 'email',
    error: '',
    message: '',
    countdown: 0
  });

  // Countdown timer for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (authState.countdown > 0) {
      timer = setTimeout(() => {
        setAuthState(prev => ({ ...prev, countdown: prev.countdown - 1 }));
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [authState.countdown]);

  /**
   * Send OTP for passwordless login - Google-like implementation
   */
  const sendOTP = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, step: 'loading', error: '', message: '' }));

      const response = await fetch('/api/auth/google/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, type: 'login' }),
      });

      const data = await response.json();

      if (data.success) {
        setAuthState(prev => ({
          ...prev,
          step: 'otp',
          message: 'OTP sent successfully! Please check your email.',
          countdown: 600 // 10 minutes
        }));
      } else {
        setAuthState(prev => ({
          ...prev,
          step: 'email',
          error: data.error?.message || 'Failed to send OTP'
        }));
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        step: 'email',
        error: 'Network error. Please try again.'
      }));
    }
  };

  /**
   * Verify OTP - Google-like implementation
   */
  const verifyOTP = async (email: string, otp: string) => {
    try {
      setAuthState(prev => ({ ...prev, step: 'loading', error: '', message: '' }));

      const response = await fetch('/api/auth/google/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, type: 'login' }),
      });

      const data = await response.json();

      if (data.success) {
        setAuthState(prev => ({
          ...prev,
          step: 'success',
          message: 'Authentication successful!'
        }));

        // Store user data
        if (data.data?.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
          localStorage.setItem('token', data.data.token);
        }

        // Call success callback
        if (onSuccess) {
          onSuccess(data.data?.user);
        }

        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setAuthState(prev => ({
          ...prev,
          step: 'otp',
          error: data.error?.message || 'Invalid OTP'
        }));
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        step: 'otp',
        error: 'Network error. Please try again.'
      }));
    }
  };

  /**
   * Google Social Login - Google-like implementation
   */
  const handleGoogleLogin = async () => {
    try {
      setAuthState(prev => ({ ...prev, step: 'loading', error: '', message: '' }));

      // Mock Google user data (in real implementation, use Google OAuth)
      const mockGoogleUser = {
        id: 'google_123456789',
        email: 'user@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        picture: 'https://via.placeholder.com/150',
        verified: true
      };

      const response = await fetch('/api/auth/google/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ googleUser: mockGoogleUser }),
      });

      const data = await response.json();

      if (data.success) {
        setAuthState(prev => ({
          ...prev,
          step: 'success',
          message: 'Google authentication successful!'
        }));

        // Store user data
        if (data.data?.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
          localStorage.setItem('token', data.data.token);
        }

        // Call success callback
        if (onSuccess) {
          onSuccess(data.data?.user);
        }

        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setAuthState(prev => ({
          ...prev,
          step: 'email',
          error: data.error?.message || 'Google authentication failed'
        }));
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        step: 'email',
        error: 'Network error. Please try again.'
      }));
    }
  };

  /**
   * Enhanced Password Reset - Google-like implementation
   */
  const handlePasswordReset = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, step: 'loading', error: '', message: '' }));

      const response = await fetch('/api/auth/google/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setAuthState(prev => ({
          ...prev,
          step: 'email',
          message: 'Password reset instructions sent to your email!'
        }));
      } else {
        setAuthState(prev => ({
          ...prev,
          step: 'email',
          error: data.error?.message || 'Failed to send password reset'
        }));
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        step: 'email',
        error: 'Network error. Please try again.'
      }));
    }
  };

  /**
   * Format countdown timer
   */
  const formatCountdown = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Ask Ya Cham
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Google-like authentication experience
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {/* Error Message */}
          {authState.error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {authState.error}
            </div>
          )}

          {/* Success Message */}
          {authState.message && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {authState.message}
            </div>
          )}

          {/* Email Step */}
          {authState.step === 'email' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={authState.email}
                  onChange={(e) => setAuthState(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => sendOTP(authState.email)}
                  disabled={!authState.email || (authState.step as string) === 'loading'}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {(authState.step as string) === 'loading' ? 'Sending...' : 'Send Login Code'}
                </button>

                <button
                  onClick={handleGoogleLogin}
                  disabled={(authState.step as string) === 'loading'}
                  className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={() => handlePasswordReset(authState.email)}
                  disabled={!authState.email || (authState.step as string) === 'loading'}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Forgot password?
                </button>
              </div>
            </div>
          )}

          {/* OTP Step */}
          {authState.step === 'otp' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Enter verification code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  maxLength={6}
                  required
                  value={authState.otp}
                  onChange={(e) => setAuthState(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '') }))}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
                <p className="mt-2 text-sm text-gray-600">
                  We sent a 6-digit code to {authState.email}
                </p>
                {authState.countdown > 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    Code expires in {formatCountdown(authState.countdown)}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => verifyOTP(authState.email, authState.otp)}
                  disabled={authState.otp.length !== 6 || (authState.step as string) === 'loading'}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {(authState.step as string) === 'loading' ? 'Verifying...' : 'Verify Code'}
                </button>

                <button
                  onClick={() => {
                    setAuthState(prev => ({ ...prev, step: 'email', otp: '', error: '', message: '' }));
                  }}
                  className="w-full text-center text-sm text-gray-600 hover:text-gray-500"
                >
                  Use a different email
                </button>

                {authState.countdown === 0 && (
                  <button
                    onClick={() => sendOTP(authState.email)}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-500"
                  >
                    Resend code
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Loading Step */}
          {(authState.step as string) === 'loading' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Please wait...</p>
            </div>
          )}

          {/* Success Step */}
          {authState.step === 'success' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="mt-2 text-sm text-gray-600">{authState.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleAuth;




